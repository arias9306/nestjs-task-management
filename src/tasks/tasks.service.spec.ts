import { Logger, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from '../auth/user.entity';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = new User();
mockUser.username = 'Test';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository: TaskRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, Logger, { provide: TaskRepository, useFactory: mockTaskRepository }],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  it('should be defined', () => {
    expect(tasksService).toBeDefined();
  });

  it('get all task', async () => {
    const task = new Task();
    task.description = 'description 1';
    task.title = 'Title 1';
    jest.spyOn(taskRepository, 'getTasks').mockResolvedValue([task]);
    const filters: GetTaskFilterDto = { status: TaskStatus.OPEN, search: 'some search querty' };

    const result = await tasksService.getTasks(filters, mockUser);

    expect(taskRepository.getTasks).toHaveBeenCalled();
    expect(result).toStrictEqual([task]);
  });

  describe('getTaskById', () => {
    it('should retrieve one task', async () => {
      const task = new Task();
      task.description = 'description 1';
      task.title = 'Title 1';
      task.id = 1;
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(task);

      const result = await tasksService.getTaskById(1, mockUser);

      expect(result).toEqual(task);
      expect(taskRepository.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: mockUser.id } });
    });

    it('throw an error thas is not found', async () => {
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);

      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
        new NotFoundException(`Task with ID "${1}" not found.`),
      );
    });
  });

  it('should create a new task', () => {
    const task = new Task();
    task.description = 'description 1';
    task.title = 'Title 1';
    task.id = 1;
    task.status = TaskStatus.OPEN;
    jest.spyOn(taskRepository, 'createTask').mockResolvedValue(task);
    const createTaskDto = { description: 'description 1', title: 'Title 1' };
    expect(tasksService.createTask(createTaskDto, mockUser)).resolves.toBe(task);
    expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
  });

  describe('deleteTaskById', () => {
    it('should delete the taks', async () => {
      jest.spyOn(taskRepository, 'delete').mockResolvedValue({ affected: 1, raw: 1 });

      await tasksService.deleteTaskById(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id });
    });

    it('should throw a NotFoundException', () => {
      jest.spyOn(taskRepository, 'delete').mockResolvedValue({ affected: 0, raw: 1 });

      expect(tasksService.deleteTaskById(1, mockUser)).rejects.toThrow(
        new NotFoundException(`Task with ID "${1}" not found.`),
      );
    });
  });

  it('should update the tasks status', async () => {
    const task = new Task();
    task.description = 'description 1';
    task.title = 'Title 1';
    task.id = 1;
    task.status = TaskStatus.OPEN;
    jest.spyOn(task, 'save').mockResolvedValue(task);
    jest.spyOn(tasksService, 'getTaskById').mockResolvedValue(task);
    task.status = TaskStatus.IN_PROGRESS;

    const result = await tasksService.updateTaskStatus(1, TaskStatus.IN_PROGRESS, mockUser);
    expect(result.status).toBe(TaskStatus.IN_PROGRESS);
    expect(tasksService.getTaskById).toHaveBeenCalled();
    expect(task.save).toHaveBeenCalled();
  });
});
