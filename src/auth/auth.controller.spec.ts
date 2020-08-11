import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';

describe('Auth Controller', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [Logger, AuthService],
      imports: [AuthModule],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  xit('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
