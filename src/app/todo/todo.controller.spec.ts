import { Test, TestingModule } from '@nestjs/testing'
import { TodoController } from './todo.controller'
import { TodoService } from './todo.service'
import { TodoEntity } from './entities/todo.entity'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'

const todoEntityList: TodoEntity[] = [
  new TodoEntity({ id: '1', task: 'Test1', isDone: 0 }),
  new TodoEntity({ id: '2', task: 'Test2', isDone: 0 }),
  new TodoEntity({ id: '3', task: 'Test3', isDone: 0 }),
]

const newTodoEntity = new TodoEntity({ task: 'test', isDone: 0 })
const updatedTodoEntity = new TodoEntity({ task: 'testUpdated', isDone: 0 })

describe('TodoController', () => {
  let todoController: TodoController
  let todoService: TodoService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [{
        provide: TodoService,
        useValue: {
          create: jest.fn().mockResolvedValue(newTodoEntity),
          findAll: jest.fn().mockResolvedValue(todoEntityList),
          findOne: jest.fn().mockResolvedValue(todoEntityList[0]),
          update: jest.fn().mockResolvedValue(updatedTodoEntity),
          remove: jest.fn().mockResolvedValue(undefined),
        }
      }],
    }).compile()

    todoController = module.get<TodoController>(TodoController)
    todoService = module.get<TodoService>(TodoService)
  })

  it('should be defined', () => {
    expect(todoController).toBeDefined()
    expect(todoService).toBeDefined()
  })

  describe('create', () => {
    const body: CreateTodoDto = {
      task: 'test',
      isDone: 0
    }

    it('should return a todoEntity', async () => {
      const result = await todoController.create(body)

      expect(result).toEqual(newTodoEntity)
      expect(todoService.create).toHaveBeenCalledTimes(1)
      expect(todoService.create).toHaveBeenCalledWith(body)
    })

    it('should throw a exception', () => {
      jest.spyOn(todoService, 'create').mockRejectedValueOnce(new Error)
      expect(todoController.create(body)).rejects.toThrow()
    })
  })

  describe('findAll', () => {
    it('should return a todoEntity list', async () => {
      const result = await todoController.findAll()

      expect(result).toEqual(todoEntityList)
      expect(typeof result).toEqual('object')
      expect(todoService.findAll).toHaveBeenCalledTimes(1)
    })

    it('should throw a exception', () => {
      jest.spyOn(todoService, 'findAll').mockRejectedValueOnce(new Error)
      expect(todoController.findAll()).rejects.toThrow()
    })
  })

  describe('findOne', () => {
    const id: string = '1'
    it('should return a todoEntity', async () => {
      const result = await todoController.findOne(id)

      expect(result).toEqual(todoEntityList[0])
      expect(todoService.findOne).toHaveBeenCalledTimes(1)
      expect(todoService.findOne).toHaveBeenCalledWith(id)
    })
    it('should throw a exception', () => {
      jest.spyOn(todoService, 'findOne').mockRejectedValueOnce(new Error)
      expect(todoController.findOne(id)).rejects.toThrow()
    })
  })
  describe('update', () => {
    const id: string = '2'
    const bodyUpdate: UpdateTodoDto = {
      task: 'testUpdated',
    }
    it('should a updated todoEntity', async () => {
      const result = await todoController.update(id, bodyUpdate)
      expect(result).toEqual(updatedTodoEntity)
      expect(todoService.update).toHaveBeenCalledTimes(1)
      expect(todoService.update).toHaveBeenCalledWith(id, bodyUpdate)
    })

    it('should throw a exception', () => {
      jest.spyOn(todoService, 'update').mockRejectedValueOnce(new Error)
      expect(todoController.update(id, bodyUpdate)).rejects.toThrow()
    })
  })

  describe('delete', () => {
    const id: string = '3'
    it('should return undefined', async () => {
      const result = await todoController.remove(id)

      expect(result).toBeUndefined()
      expect(todoService.remove).toHaveBeenCalledTimes(1)
      expect(todoService.remove).toHaveBeenCalledWith(id)
    })

    it('should throw a exception', () => {
      jest.spyOn(todoService, 'remove').mockRejectedValueOnce(new Error)
      expect(todoController.remove(id)).rejects.toThrow()
    })
  })
})
