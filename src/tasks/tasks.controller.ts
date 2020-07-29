import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly loggerService: Logger,
  ) {
    loggerService.setContext(TasksController.name)
  }

  @Get()
  getAllTasks(): Task[] {
    this.loggerService.log('Call GetAllTask');
    return this.tasksService.getAllTasks();
  }

  @Post()
  createTask(
    @Body('title') title: string,
    @Body('description') description: string,
  ): Task {
    this.loggerService.log('Call CreateTask');
    return this.tasksService.createTask(title, description);
  }
}
