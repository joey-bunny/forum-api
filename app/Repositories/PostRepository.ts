import Post from 'App/Models/Post'

export default class PostRepository {
  private model

  constructor () {
    this.model = Post
  }

  public async getAllPosts () {
    const posts = await Post.query().preload('users').preload('forums')
    return posts
  }
}
