import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

test.group('User', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create an user', async ({ assert, client }) => {
    const usersPayload = {
      email: 'test@email.com',
      username: 'test',
      password: 'test123',
      avatar: 'images.com/image/1',
    }
    const response = await client.post('/api/v1/users').json(usersPayload)

    const { password, avatar, ...expected } = usersPayload
    response.assertStatus(201)
    response.assertBodyContains({ user: expected })
    assert.notExists(response.body().user.password, 'Password defined')
  })

  test('it should return 409 when email is already in use', async ({ client }) => {
    const { email } = await UserFactory.create()
    const usersPayload = {
      email,
      username: 'test',
      password: 'test123',
      avatar: 'images.com/image/1',
    }

    const response = await client.post('/api/v1/users').json(usersPayload)
    response.assertStatus(409)
    response.assertBodyContains({
      code: 'BAD_REQUEST',
      message: 'Email is already in use',
    })
  })

  test('it should return 409 when username is already in use', async ({ client }) => {
    const { username } = await UserFactory.create()
    const usersPayload = {
      email: 'test@email.com',
      username,
      password: 'test123',
      avatar: 'images.com/image/1',
    }
    const response = await client.post('/api/v1/users').json(usersPayload)
    response.assertStatus(409)
    response.assertBodyContains({
      code: 'BAD_REQUEST',
      message: 'Username is already in use',
    })
  })

  test('it should return 422 when required data is not provided', async ({ client }) => {
    const response = await client.post('/api/v1/users').json({})
    response.assertStatus(422)
    response.assertBodyContains({
      code: 'BAD_REQUEST',
      status: 422,
    })
  })

  test('it should return 422 when providing an invalid email', async ({ client }) => {
    const response = await client
      .post('/api/v1/users')
      .json({ email: 'test', username: 'test', password: 'test123' })
    response.assertStatus(422)

    response.assertBodyContains({
      code: 'BAD_REQUEST',
      status: 422,
    })
  })

  test('it should return 422 when providing an invalid password', async ({ client }) => {
    const response = await client
      .post('/api/v1/users')
      .json({ email: 'test@gmail.com', username: 'test', password: 'tes' })
    response.assertStatus(422)

    response.assertBodyContains({
      code: 'BAD_REQUEST',
      status: 422,
    })
  })

  test('it should update an user', async ({ client }) => {
    const user = await UserFactory.create()
    const email = 'test@test.com'
    const avatar = 'http://github.com/Neto6391'
    const response = await client
      .put(`/api/v1/users/${user.id}`)
      .json({ email, avatar, username: 'test1', password: 'test1234' })
    response.assertStatus(200)
    response.assertBodyContains({
      user: {
        email,
        avatar,
        id: user.id,
      },
    })
  })

  test('it should update the password of the user', async ({ assert, client }) => {
    const user = await UserFactory.create()
    const password = 'test1234'
    const response = await client
      .put(`/api/v1/users/${user.id}`)
      .json({ email: user.email, username: user.username, avatar: user.avatar, password })
    response.assertStatus(200)
    response.assertBodyContains({
      user: {
        id: user.id,
      },
    })
    await user.refresh()
    assert.isTrue(await Hash.verify(user.password, password))
  })

  test('it should return 422 when required data is not provided', async ({ client }) => {
    const user = await UserFactory.create()
    const response = await client.put(`/api/v1/users/${user.id}`).json({})
    response.assertBodyContains({
      code: 'BAD_REQUEST',
      status: 422,
    })
  })

  test('it should return 422 when providing an invalid email', async ({ client }) => {
    const user = await UserFactory.create()
    const response = await client.put(`/api/v1/users/${user.id}`).json({
      email: 'test@',
      username: user.username,
      avatar: user.avatar,
    })
    response.assertBodyContains({
      code: 'BAD_REQUEST',
      status: 422,
    })
  })

  test('it should return 422 when providing an invalid password', async ({ client }) => {
    const user = await UserFactory.create()
    const response = await client
      .put(`/api/v1/users/${user.id}`)
      .json({ email: 'test@', username: user.username, avatar: user.avatar, password: 'test' })
    response.assertBodyContains({
      code: 'BAD_REQUEST',
      status: 422,
    })
  })

  test('it should return 422 when providing an invalid avatar', async ({ client }) => {
    const user = await UserFactory.create()
    const response = await client.put(`/api/v1/users/${user.id}`).json({
      email: 'test@',
      username: user.username,
      avatar: 'images',
      password: 'test',
    })
    response.assertBodyContains({
      code: 'BAD_REQUEST',
      status: 422,
    })
  })

  test('it should return 422 when providing an invalid username', async ({ client }) => {
    const user = await UserFactory.create()
    const response = await client.put(`/api/v1/users/${user.id}`).json({
      email: 'test@',
      username: '',
      avatar: user.avatar,
      password: 'test',
    })
    response.assertBodyContains({
      code: 'BAD_REQUEST',
      status: 422,
    })
  })
})
