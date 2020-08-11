import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Logger } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { UserRepository } from '../auth/user.repository';

describe('Tasks Controller', () => {
  let controller: TasksController;
  // let tasksService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([TaskRepository])],
      controllers: [TasksController],
      providers: [TasksService, Logger],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    // tasksService = module.get<TasksService>(TasksService);
  });

  xit('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('should return an array of task', async () => {
  //   const task = new Task();
  //   task.description = 'description 1';
  //   task.title = 'title 1';
  //   task.status = TaskStatus.OPEN;
  //   task.id = 1;

  //   const result: Task[] = [task];
  //   jest.spyOn(tasksService, 'getTasks').mockImplementation(() => result);

  //   expect(controller.getTasks()).toBe(result);
  // });

  // it('should return an new task', async () => {
  //   const result: Task = {
  //     description: 'description 1',
  //     status: TaskStatus.OPEN,
  //     title: 'new task',
  //     id: '1',
  //   };
  //   jest.spyOn(tasksService, 'createTask').mockImplementation(() => result);

  //   expect(
  //     controller.createTask({
  //       title: 'new task',
  //       description: 'description 1',
  //     }),
  //   ).toBe(result);
  // });
});
