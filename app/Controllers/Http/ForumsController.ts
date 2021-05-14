import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Forum from 'App/Models/Forum'
//import Post from 'App/Models/Post'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class ForumsController {
  public async index ({}: HttpContextContract) {
    //const user = auth.user
    //const posts = await Post.findBy('username', username)
    //const post = await Post.query().preload('forums')
    //const post = await Post.all()
    //const forumPost = await post.

    const forum = await Forum.query().preload('users').preload('posts')

    return forum
  }

  public async store ({ request, auth }: HttpContextContract) {
    const validationSchema = schema.create({
      title: schema.string({ trim: true }, [
        rules.required(),
        rules.unique({table: 'forums', column: 'title'}),
      ]),
      description: schema.string({ trim: true }, [
        rules.required(),
        rules.minLength(4),
      ]),
    })

    const ValidatedData = await request.validate({
      schema: validationSchema,
    })

    const users = await auth.user
    const forum = new Forum()
    forum.title = ValidatedData.title
    forum.description = ValidatedData.description
    await users?.related('forums').save(forum)

    return forum.toJSON()
  }

  public async show ({ params }: HttpContextContract){
    try {
      const forum = await Forum.findOrFail(params.id)
      if(forum){
        return forum
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async update ({ auth, request, params }: HttpContextContract) {
    const forum = await Forum.findOrFail(params.id)
    const user = await auth.authenticate()
    const forumuid = forum.userId
    if(forum){
      forum.title = request.input('title')
      forum.description = request.input('description')
      if (user.id === forumuid) {
        await forum.save()

        return forum
      }
      return 'Unauthorized to update'
    }
    return
  }

  public async destroy ({ auth, params }) {
    const forum = await Forum.findOrFail(params.id)
    const user = auth.authenticate()
    if (forum){
      const forumuid = forum.userId
      if (user.id === forumuid) {
        await forum.delete()

        return 'Forum deleted successfully'
      }

      return 'Unauthorized to delete'
    }
    return
  }
}
