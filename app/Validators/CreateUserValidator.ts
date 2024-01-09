import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string([rules.email({})]),
    username: schema.string(),
    password: schema.string([rules.minLength(6)]),
  })

  public messages: CustomMessages = {}
}
