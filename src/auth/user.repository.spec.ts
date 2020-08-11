import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';

const mockCredentialsDto: AuthCredentialsDto = { username: 'user', password: '123456' };

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let save: jest.Mock;

    beforeEach(() => {
      save = jest.fn().mockResolvedValue(undefined);
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('should successfully signs up the user', () => {
      expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
      expect(userRepository.create).toHaveBeenCalled();
    });
  });
});
