import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Logger } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';

describe('Tasks Controller', () => {
  let controller: TasksController;
  let tasksService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService, Logger],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of task', async () => {
    const result: Task[] = [
      {
        description: 'description 1',
        status: TaskStatus.OPEN,
        id: '1',
        title: 'task 1',
      },
    ];
    jest.spyOn(tasksService, 'getAllTasks').mockImplementation(() => result);

    expect(controller.getAllTasks()).toBe(result);
  });

  it('should return an new task', async () => {
    const result: Task = {
      description: 'description 1',
      status: TaskStatus.OPEN,
      title: 'new task',
      id: '1',
    };
    jest.spyOn(tasksService, 'createTask').mockImplementation(() => result);

    expect(controller.createTask('new task', 'description 1')).toBe(result);
  });
});
