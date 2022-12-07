import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { jwtAuthGuard } from './guards/jwtGuard';
import { LocalAuthGuard } from './guards/localGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('jwt/login')
  async login(@Request() req) {
    console.log(req.user);
    return this.authService.login(req.user);
  }

  @UseGuards(jwtAuthGuard)
  @Post('jwt/refresh-token')
  async refreshToken(@Request() req) {
    return await this.authService.createAccessTokenFromRefreshToken(
      req.user.refreshToken,
    );
  }

  @UseGuards(jwtAuthGuard)
  @Get('me')
  async me(@Request() req): Promise<User> {
    return this.authService.getMe(req.user);
  }

  @UseGuards(jwtAuthGuard)
  @Get('logout')
  async logout(@Request() req): Promise<any> {
    return await this.authService.removeRefreshToken(req.user.id);
  }
}
