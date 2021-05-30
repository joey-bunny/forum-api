import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import PostRepository from 'App/Repositories/PostRepository'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class PostController {
  private repository

  constructor () {
    this.repository = new PostRepository()
  }

  public async index ({}: HttpContextContract) {
    return this.repository.getAllPosts()
  }

  public async store ({ auth, request }: HttpContextContract) {
    const validationSchema = schema.create({
      title: schema.string({ trim: true }, [
        rules.required(),
        rules.unique({ table: 'posts', column: 'title'}),
      ]),
      content: schema.string({ trim: true }, [
        rules.required(),
        rules.minLength(4),
      ]),
      forum: schema.number([
        rules.exists({ table: 'forums', column: 'id'}),
      ]),
    })

    const validatedData = await request.validate({
      schema: validationSchema,
    })

    const user = await auth.user
    const post = new Post()

    post.title = validatedData.title
    post.content = validatedData.content
    post.forumId = validatedData.forum

    await user?.related('posts').save(post)

    return post
  }

  public async show ({ params }: HttpContextContract){
    try {
      const post = await Post.findOrFail(params.id)
      if(post){
        return post
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async update ({ auth, request, params }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)
    const user = await auth.authenticate()
    const postuid = post.userId

    if(post) {
      post.title = request.input('title')
      post.content = request.input('content')

      if (user.id === postuid) {
        await post.save()

        return post
      }
      return 'Unauthorized to update this post'
    }
    return
  }

  public async destroy ({ auth, params }) {
    const post = await Post.findOrFail(params.id)
    const user = auth.authenticate()
    if (post){
      const postuid = post.userId
      if (user.id === postuid) {
        await post.delete()

        return 'Post deleted successfully'
      }

      return 'Unauthorized to delete'
    }
    return
  }
}
