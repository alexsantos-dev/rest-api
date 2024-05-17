import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { CreateTodoDto } from 'src/app/todo/dto/create-todo.dto'
import { TodoEntity } from 'src/app/todo/entities/todo.entity'
import { UpdateTodoDto } from 'src/app/todo/dto/update-todo.dto'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let todoTestEntity: TodoEntity
  const todoTestEntityData: CreateTodoDto = {
    task: 'TestTask',
    isDone: 1
  }
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('app should be defined', () => {
    expect(app).toBeDefined()
  })

  describe('POST /api/v1/todos', () => {
    it('should create a todo entity and return status 200', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/todos')
        .send(todoTestEntityData)
        .expect(201)

      todoTestEntity = createResponse.body
    })
  })

  describe('GET /api/v1/todos', () => {
    it('return a todo entity list and status 200', async () => {
      const todoListGetResponse = await request(app.getHttpServer())
        .get('/api/v1/todos')
        .expect(200)

      expect(todoListGetResponse.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining(todoTestEntity)
        ])
      )
    })
  })

  describe('GET /api/v1/todos/:id', () => {
    it('should return a todo entity and status 200', async () => {
      const oneTodoEntity = await request(app.getHttpServer())
        .get(`/api/v1/todos/${todoTestEntity.id}`)
        .expect(200)

      expect(oneTodoEntity.body).toEqual(
        expect.objectContaining(todoTestEntity)
      )
    })

    it('should throw an exception and return status 404', async () => {
      const todoUndefinedId: string = "45a04837-4168-4ee6-be3c-4471ad81e0ae"

      const oneTodoEntity = await request(app.getHttpServer())
        .get(`/api/v1/todos/${todoUndefinedId}`)
        .expect(404)

      expect(oneTodoEntity.body.message).toEqual('Could not find any entity of type \"TodoEntity\" matching: {\n    \"where\": {\n        \"id\": \"45a04837-4168-4ee6-be3c-4471ad81e0ae\"\n    }\n}')
    })

    it('should throw an exception and return status 400', async () => {
      const badId: string = "badId"

      const oneTodoEntity = await request(app.getHttpServer())
        .get(`/api/v1/todos/${badId}`)
        .expect(400)

      expect(oneTodoEntity.body.message).toEqual('Validation failed (uuid is expected)')
    })
  })

  describe('PATCH /api/v1/todos/:id', () => {
    const todoTestEntityDataUpdate: UpdateTodoDto = {
      task: 'TestTaskUpdate',
      isDone: 0
    }
    it('should update a entity and return status 200', async () => {
      const updateTodoEntity = await request(app.getHttpServer())
        .patch(`/api/v1/todos/${todoTestEntity.id}`)
        .send(todoTestEntityDataUpdate)
        .expect(200)

      expect(updateTodoEntity.body).toEqual(
        expect.objectContaining(
          {
            id: todoTestEntity.id,
            task: todoTestEntityDataUpdate.task,
            isDone: todoTestEntityDataUpdate.isDone,
            createdAt: todoTestEntity.createdAt,
            updatedAt: expect.any(String)
          }
        )
      )
    })

    it('should throw an exception and return status 400', async () => {
      const updateTodoEntity = await request(app.getHttpServer())
        .patch(`/api/v1/todos/${todoTestEntity.id}`)
        .send({})
        .expect(400)
      expect(updateTodoEntity.body.message).toEqual('Object data can´t be empty')
    })
  })

  describe('DELETE /api/v1/todos/:id', () => {
    it('should return undefined body and status 204', async () => {
      const deleteTodoEntity = await request(app.getHttpServer())
        .delete(`/api/v1/todos/${todoTestEntity.id}`)
        .expect(204)
      expect(Object.keys(deleteTodoEntity.body).length).toEqual(0)
    })
  })
})
