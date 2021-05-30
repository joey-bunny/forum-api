import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CommentsController {
  public async index ({}: HttpContextContract) {
    const comment = await Comment.query().preload('posts')

    return comment
  }

  public async store ({ auth, request }: HttpContextContract) {
    const validationSchema = schema.create({
      comment: schema.string({ trim: true }, [
        rules.required(),
      ]),
      post: schema.number([
        rules.exists({ table: 'posts', column: 'id'}),
      ]),
    })

    const validatedData = await request.validate({
      schema: validationSchema,
    })

    const user = await auth.user
    const comments = new Comment()
    comments.comment = validatedData.comment
    comments.postId = validatedData.post

    await user?.related('comments').save(comments)

    return comments
  }

  public async destroy ({ auth, params, response}: HttpContextContract) {
    const comment = await Comment.findOrFail(params.id)
    const user = await auth.authenticate()

    if (comment) {
      const commentuid = comment.userId

      if(commentuid === user.id) {
        await comment.delete()

        return response.json({
          'status': 'Comment deleted',
        })
      }

      return response.json({
        'status': 'Unauthorized to delete comment',
      })
    }

    return response.json({
      'status': 'Comment not found',
    })
  }
}
