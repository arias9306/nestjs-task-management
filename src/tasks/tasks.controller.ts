import { Controller, Get, Post, Body, Logger, Param, Delete, Query, UsePipes, ValidationPipe, ParseIntPipe, Patch } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { TaskStatusValidationPipe } from './task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly loggerService: Logger,
  ) {
    loggerService.setContext(TasksController.name);
  }

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto): Promise<Task[]> {
    this.loggerService.log('Call GetAllTask');
    return this.tasksService.getTasks(filterDto);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    this.loggerService.log('Call CreateTask');
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    this.loggerService.log(`Call GetTaskById with id ${id}`);
    return this.tasksService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.loggerService.log(`Call delete Task by Id with id ${id}`);
    return this.tasksService.deleteTaskById(id);
  }

  @Patch('/:id/status')
  updateTasksStatus(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus): Promise<Task> {
    this.loggerService.log(`Call update task by id with id ${id}`);
    return this.tasksService.updateTaskStatus(id, status);
  }
}
