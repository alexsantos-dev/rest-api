import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TodoEntity } from './entities/todo.entity'

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>
  ) { }

  async create(data: CreateTodoDto): Promise<TodoEntity> {
    try {
      return await this.todoRepository.save(this.todoRepository.create(data))
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll(): Promise<TodoEntity[]> {
    try {
      const results = await this.todoRepository.find()
      if (results.length === 0) {
        throw new Error('No results found for this operation')
      }
      return results
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  async findOne(id: string): Promise<TodoEntity> {
    try {
      return await this.todoRepository.findOneOrFail({ where: { id } })
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  async update(id: string, data: UpdateTodoDto): Promise<TodoEntity> {
    try {
      const todo = await this.findOne(id)
      if (Object.keys(data).length === 0) {
        throw new Error('Object data can´t be empty')
      }
      return await this.todoRepository.save(this.todoRepository.merge(todo, data))
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: string): Promise<undefined> {
    await this.findOne(id)
    await this.todoRepository.delete(id)
  }
}
