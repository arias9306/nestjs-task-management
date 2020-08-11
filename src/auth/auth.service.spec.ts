import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

const mockUserRepository = () => ({
  validateUserPassword: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
  signUp: jest.fn(),
});

const mockAuthCredentials: AuthCredentialsDto = { username: 'user', password: 'password' };

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        Logger,
        { provide: UserRepository, useFactory: mockUserRepository },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should signUp the user', () => {
    authService.signUp(mockAuthCredentials);
    expect(userRepository.signUp).toHaveBeenCalled();
  });

  describe('signIn', () => {
    it('should login successfully', async () => {
      jest.spyOn(userRepository, 'validateUserPassword').mockResolvedValue('username');
      jest.spyOn(jwtService, 'sign').mockReturnValue('qwerty');

      const result = await authService.signIn(mockAuthCredentials);

      expect(jwtService.sign).toHaveBeenCalled();
      expect(result).toStrictEqual({ accessToken: 'qwerty' });
    });

    it('should throw an UnauthorizedException', async () => {
      jest.spyOn(userRepository, 'validateUserPassword').mockResolvedValue(null);

      try {
        await authService.signIn(mockAuthCredentials);
      } catch (e) {
        expect(e).toStrictEqual(new UnauthorizedException('Invalid credentials'));
      }
    });
  });
});
