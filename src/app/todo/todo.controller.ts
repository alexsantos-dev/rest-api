import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common'
import { TodoService } from './todo.service'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'
import { ParseUUIDPipe } from '@nestjs/common'
import { HttpCode } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
@Controller('api/v1/todos')
@ApiTags('Todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto) {
    return await this.todoService.create(createTodoDto)
  }

  @Get()
  async findAll() {
    return await this.todoService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.todoService.findOne(id)
  }

  @Patch(':id')
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() data: UpdateTodoDto) {
    return await this.todoService.update(id, data)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.todoService.remove(id)
  }
}
