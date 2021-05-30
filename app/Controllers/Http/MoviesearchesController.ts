import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Post from 'App/Models/Post'
import axios from 'axios'
//import OMDB_KEY from 'env'

export default class MoviesearchesController {
  public async index ({ request, auth, response }: HttpContextContract) {
    const user = await auth.user
    const search = await request.input('search')
    const result = await axios.get(`http://www.omdbapi.com/?t=${search}&apikey=313ea078`)
    const title = result.data.Title
    const content = result.data.Plot
    const forumId = 5

    const post = new Post()
    const selectPost = await Post.findBy('title', title)

    post.title = title
    post.content = content
    post.forumId = forumId

    if (selectPost === null) {
      await user?.related('posts').save(post)

      return post
    }

    return response.json({
      'status': 'movie already exist in the database',
    })
  }
}
