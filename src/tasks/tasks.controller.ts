import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly loggerService: Logger,
  ) {
    loggerService.setContext(TasksController.name);
  }

  @Get()
  getAllTasks(): Task[] {
    this.loggerService.log('Call GetAllTask');
    return this.tasksService.getAllTasks();
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    this.loggerService.log('Call CreateTask');
    return this.tasksService.createTask(createTaskDto);
  }
}
