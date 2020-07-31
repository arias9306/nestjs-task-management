import { Controller, Get, Post, Body, Logger, Param, Delete, Put, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly loggerService: Logger,
  ) {
    loggerService.setContext(TasksController.name);
  }

  @Get()
  getTasks(@Query() filterDto: GetTaskFilterDto): Task[] {
    this.loggerService.log('Call GetAllTask');
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTaskWithFilters(filterDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    this.loggerService.log('Call CreateTask');
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    this.loggerService.log(`Call GetTaskById with id ${id}`);
    return this.tasksService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string): void {
    this.loggerService.log(`Call delete Task by Id with id ${id}`);
    this.tasksService.deleteTaskById(id);
  }

  @Put('/:id')
  updateTasks(@Param('id') id: string, @Body() updateTaskDto: CreateTaskDto): Task {
    this.loggerService.log(`Call update task by id with id ${id}`);
    return this.tasksService.updateTaskById(id, updateTaskDto);

  }
}
