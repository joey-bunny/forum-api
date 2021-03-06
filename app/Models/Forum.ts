import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, BelongsTo, HasMany} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Post from './Post'

export default class Forum extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public users: BelongsTo<typeof User>

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>
}
