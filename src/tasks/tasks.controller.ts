import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService, private readonly loggerService: Logger) {
    this.loggerService.setContext(TasksController.name);
  }

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto, @GetUser() user: User): Promise<Task[]> {
    this.loggerService.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
    this.loggerService.log('Call GetAllTask');
    return this.tasksService.getTasks(filterDto, user);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
    this.loggerService.log('Call CreateTask');
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
    this.loggerService.log(`Call GetTaskById with id ${id}`);
    return this.tasksService.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
    this.loggerService.log(`Call delete Task by Id with id ${id}`);
    return this.tasksService.deleteTaskById(id, user);
  }

  @Patch('/:id/status')
  updateTasksStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    this.loggerService.log(`Call update task by id with id ${id}`);
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
