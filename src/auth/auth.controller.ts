import { Controller, Post, Body, Logger, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly logger: Logger) {
    logger.setContext(AuthController.name);
  }

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCreadentialsDto: AuthCredentialsDto): Promise<void> {
    this.logger.log('Sign up a new user.');
    return this.authService.signUp(authCreadentialsDto);
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) authCreadentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    this.logger.log('Sign in a user.');
    return this.authService.signIn(authCreadentialsDto);
  }
}
