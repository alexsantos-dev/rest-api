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

  async create(data: CreateTodoDto) {
    try {
      return await this.todoRepository.save(this.todoRepository.create(data))
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll() {
    return await this.todoRepository.find()
  }

  async findOne(id: string): Promise<TodoEntity> {
    try {
      return await this.todoRepository.findOneOrFail({ where: { id } })
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  async update(id: string, data: UpdateTodoDto) {
    try {
      const todo = await this.findOne(id)
      this.todoRepository.merge(todo, data)
      return await this.todoRepository.save(todo)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.todoRepository.softDelete(id)
  }

  async removeAll(task: string) {
    const tasks = await this.todoRepository.find({ where: { task } })
    await this.todoRepository.remove(tasks)
  }
}
