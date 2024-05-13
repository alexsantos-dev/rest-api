import { PartialType } from '@nestjs/mapped-types'
import { CreateTodoDto } from './create-todo.dto'
import { ValidateIf, IsNotEmpty } from 'class-validator'
export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @ValidateIf(o => !o.task && !o.isDone)
  @IsNotEmpty({ message: 'At least one field should be provided' })
  readonly atLeastOneField: string
}
