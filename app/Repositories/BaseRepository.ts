export default class BaseRepository {
  private model

  constructor (model) {
    this.model = model
  }

  public async getAll ({ relations }) {
    if (relations) return this.model.query().preload(relations)

    return this.model.get()
  }
}
