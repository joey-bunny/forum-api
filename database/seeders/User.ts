import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    const uniquekey = 'email'

    await User.updateOrCreateMany(uniquekey, [
      {
        email: 'joey@adonisjs.com',
        password: 'secret',
      },
      {
        email: 'romain@adonisjs.com',
        password: 'secret',
      },
    ])
  }
}
