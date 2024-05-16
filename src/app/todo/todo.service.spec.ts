import { Test, TestingModule } from '@nestjs/testing'
import { TodoService } from './todo.service'
import { Repository } from 'typeorm'
import { TodoEntity } from './entities/todo.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'

describe('TodoService', () => {
  let todoService: TodoService
  let todoRepository: Repository<TodoEntity>

  const todoEntityList: TodoEntity[] = [
    new TodoEntity({ id: '1', task: 'Test1', isDone: 0 }),
    new TodoEntity({ id: '2', task: 'Test2', isDone: 0 }),
    new TodoEntity({ id: '3', task: 'Test3', isDone: 0 }),
  ]

  const updatedTodoEntity = new TodoEntity({ task: 'testUpdated', isDone: 0 })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(todoEntityList[0]),
            create: jest.fn().mockReturnValue(todoEntityList[0]),
            find: jest.fn().mockResolvedValue(todoEntityList),
            findOneOrFail: jest.fn().mockResolvedValue(todoEntityList[0]),
            merge: jest.fn().mockReturnValue(updatedTodoEntity),
            softDelete: jest.fn().mockReturnValue(undefined),
          }
        }
      ],
    }).compile()

    todoService = module.get<TodoService>(TodoService)
    todoRepository = module.get<Repository<TodoEntity>>(getRepositoryToken(TodoEntity))
  })

  it('should be defined', () => {
    expect(todoService).toBeDefined()
    expect(todoRepository).toBeDefined()
  })

  describe('create', () => {
    const data: CreateTodoDto = {
      task: 'Test1',
      isDone: 0
    }
    it('should create a todo entity', async () => {
      const result = await todoService.create(data)

      expect(result).toEqual(todoEntityList[0])
      expect(todoRepository.create).toHaveBeenCalledTimes(1)
      expect(todoRepository.create).toHaveBeenCalledWith(data)
      expect(todoRepository.save).toHaveBeenCalledTimes(1)
      expect(todoRepository.save).toHaveBeenCalledWith(todoRepository.create(data))
    })

    it('should throw an exception', () => {
      jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error())
      expect(todoService.create(data)).rejects.toThrow()
    })
  })
  describe('findAll', () => {
    it('should return a todo entity list', async () => {
      const result = await todoService.findAll()

      expect(result).toEqual(todoEntityList)
      expect(todoRepository.find).toHaveBeenCalledTimes(1)
    })
    it('should throw an exception', () => {
      jest.spyOn(todoRepository, 'find').mockRejectedValueOnce(new Error())
      expect(todoService.findAll).rejects.toThrow()
    })
  })
  describe('findOne', () => {
    const id: string = '1'
    it('should return a todo entity', async () => {
      const result = await todoService.findOne(id)

      expect(result).toEqual(todoEntityList[0])
      expect(todoRepository.findOneOrFail).toHaveBeenCalledTimes(1)
      expect(todoRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id } })
    })
    it('should throw an exception', () => {
      jest.spyOn(todoRepository, 'findOneOrFail').mockRejectedValueOnce(new Error())
      expect(todoService.findOne).rejects.toThrow()
    })
  })
  describe('update', () => {
    const data: UpdateTodoDto = {
      task: 'testUpdated',
      isDone: 0
    }
    const id: string = '1'

    it('should return a updated todo entity', async () => {
      jest.spyOn(todoRepository, 'save').mockResolvedValue(updatedTodoEntity)
      jest.spyOn(todoService, 'findOne').mockResolvedValue(todoEntityList[0])
      const result = await todoService.update(id, data)

      expect(result).toEqual(updatedTodoEntity)
      expect(todoService.findOne).toHaveBeenCalledTimes(1)
      expect(todoService.findOne).toHaveBeenCalledWith(id)
      expect(todoRepository.merge).toHaveBeenCalledTimes(1)
      expect(todoRepository.merge).toHaveBeenCalledWith(todoEntityList[0], data)
      expect(todoRepository.save).toHaveBeenCalledTimes(1)
      expect(todoRepository.save).toHaveBeenCalledWith(todoRepository.merge(todoEntityList[0], data))
    })
    it('should throw an exception', () => {
      jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error())

      expect(todoService.update).rejects.toThrow()
    })
  })

  describe('remove', () => {
    const id: string = '3'

    it('should return undefined', async () => {
      jest.spyOn(todoService, 'findOne').mockResolvedValue(todoEntityList[0])
      const result = await todoService.remove(id)

      expect(result).toBeUndefined()
      expect(todoService.findOne).toHaveBeenCalledTimes(1)
      expect(todoService.findOne).toHaveBeenCalledWith(id)
      expect(todoRepository.softDelete).toHaveBeenCalledTimes(1)
      expect(todoRepository.softDelete).toHaveBeenCalledWith(id)
    })

    it('should throw an exception', () => {
      jest.spyOn(todoRepository, 'softDelete').mockRejectedValueOnce(new Error())

      expect(todoService.remove).rejects.toThrow()
    })
  })
})
