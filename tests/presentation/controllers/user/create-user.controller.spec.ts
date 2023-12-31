import { type RegisterUser } from '@application/user/protocols/register-user.js'
import { faker } from '@faker-js/faker'
import { CreateUserController } from '@presentation/controllers/user/create-user.controller.js'
import { type HttpUserRegister } from '@presentation/protocols/controllers/request/user/httpUserRegister.js'
import { ValidationError } from '@presentation/protocols/validations/validation-error.js'
import { RegisterUserMock } from '@tests/presentation/mocks/user/register-user.mock.js'
import { jest } from '@jest/globals'
import { type UserRegisterDto } from '@application/user/dtos/user-register.dto.js'
import { Validation } from '@presentation/validations/validation.js'

// type registerUserFuntion = (user: UserRegisterDto) => Promise<UserResultDto>

describe('Create User Controller', () => {
  it('should return user create with 201 status code', async () => {
    const registerUserMock = new RegisterUserMock()

    const mockValidation = new Validation()

    const validateSpy = jest.spyOn(mockValidation, 'validate')

    const createUserController = new CreateUserController(registerUserMock, mockValidation)
    const requestMock: HttpUserRegister = {
      body: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    }

    const response = await createUserController.handle(requestMock)

    expect(validateSpy).toHaveBeenCalled()
    expect(response).toHaveProperty('statusCode', 201)
    expect(response).toHaveProperty('body')
    expect(response).toHaveProperty('body.id')
    expect(response).toHaveProperty('body.name')
    expect(response).toHaveProperty('body.email')
  })

  it('should return 400 status code if bad request about validation field', async () => {
    const registerUserMock = new RegisterUserMock()

    const mockValidation = new Validation()

    const validateSpy = jest.spyOn(mockValidation, 'validate').mockImplementationOnce(() => {
      Reflect.set(mockValidation, 'validationErrors', [new ValidationError('any_rule', 'any_field', 'any_message')])
    })

    const createUserController = new CreateUserController(registerUserMock, mockValidation)

    const requestMock: HttpUserRegister = {
      body: {
        email: faker.internet.email(),
        name: faker.person.firstName(),
        password: faker.internet.password()
      }
    }

    const response = await createUserController.handle(requestMock)

    expect(validateSpy).toHaveBeenCalled()
    expect(response).toHaveProperty('statusCode', 400)
  })

  it('should return 500 status code if bad request about something else', async () => {
    const registerUserMock: jest.Mocked<RegisterUser> = {
      register: jest.fn<(user: UserRegisterDto) => Promise<never>>().mockRejectedValue(new Error('any_error'))
    }

    const mockValidation = new Validation()

    const createUserController = new CreateUserController(registerUserMock, mockValidation)

    const requestMock: HttpUserRegister = {
      body: {
        email: faker.internet.email(),
        name: faker.person.firstName(),
        password: faker.internet.password()
      }
    }

    const response = await createUserController.handle(requestMock)

    expect(response).toHaveProperty('statusCode', 500)
  })
})
