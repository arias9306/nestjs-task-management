import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Logger } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, Logger],

    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should retrieve 3 task', () => {
    service.createTask('task 1', 'description 1');
    service.createTask('task 2', 'description 2');
    service.createTask('task 3', 'description 3');

    const tasks = service.getAllTasks();

    expect(tasks.length).toBe(3)
    expect(tasks[0].title).toBe('task 1');
  })

  it('should create a task', () => {
    const newTask = service.createTask('task 1', 'description 1');

    expect(newTask.title).toBe('task 1');
    expect(newTask.description).toBe('description 1');
    expect(newTask.id).not.toBe('')
  })
});
