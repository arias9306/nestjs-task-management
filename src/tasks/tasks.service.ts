import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { DeleteResult } from 'typeorm';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  async getTaskById(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id, userId: user.id } });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTaskById(id: number, user: User): Promise<void> {
    const deleteResult: DeleteResult = await this.taskRepository.delete({ id, userId: user.id });

    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();

    return task;
  }

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }
}
