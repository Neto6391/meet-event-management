import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'
import CreateUser from 'App/Validators/CreateUserValidator'
import UpdateUser from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const payloadData = await request.validate(CreateUser)

    const userByEmail = await User.findBy('email', payloadData.email)
    const userByUsername = await User.findBy('username', payloadData.username)

    if (userByEmail) throw new BadRequestException('Email is already in use', 409)
    if (userByUsername) throw new BadRequestException('Username is already in use', 409)

    const user = await User.create(payloadData)
    return response.created({ user })
  }

  public async update({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const { username, email, password, avatar } = await request.validate(UpdateUser)
    const user = await User.findOrFail(id)
    console.log('chegou?')
    user.email = email
    user.username = username
    user.password = password

    if (avatar) user.avatar = avatar
    await user.save()
    return response.ok({ user })
  }
}
