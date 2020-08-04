import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCreadentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) { }


  signUp(authCredentialsDto: AuthCreadentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }
}
