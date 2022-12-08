import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { jwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('jwt/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('jwt/refresh-token')
  async refreshToken(@Request() req) {
    console.log(req.user);
    return await this.authService.refreshTokens(
      req.user.id,
      req.user.refreshToken,
    );
  }

  @UseGuards(jwtAuthGuard)
  @Get('me')
  async me(@Request() req): Promise<User> {
    return this.authService.getMe(req.user);
  }

  @UseGuards(jwtAuthGuard)
  @Get('jwt/logout')
  async logout(@Request() req): Promise<any> {
    return await this.authService.removeRefreshToken(req.user.id);
  }

  @Post('jwt/signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }
}
