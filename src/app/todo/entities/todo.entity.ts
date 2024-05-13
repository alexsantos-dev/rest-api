import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm'

@Entity({ name: 'todos' })
export class TodoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  task: string

  @Column({ name: 'is_done', type: 'tinyint', width: 1 })
  isDone: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string
}
