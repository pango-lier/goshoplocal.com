import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AuthenticatedUser } from './interface/authenticated-user.interface';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ id, username }: any) {
    const payload: JwtPayload = {
      sub: id,
      username: username,
    };
    const refreshToken = await this.jwtService.signAsync(
      payload,
      this.getTokenOptions('refresh'),
    );
    await this.setCurrentRefreshToken(refreshToken, id);
    return {
      userData: { id, username },
      accessToken: await this.jwtService.signAsync(
        payload,
        this.getTokenOptions('access'),
      ),
      refreshToken,
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && user.password === password) {
      const { password, username, ...rest } = user;
      return rest;
    }
    return undefined;
  }

  public async createAccessTokenFromRefreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.decode(refreshToken) as JwtPayload;
      if (!decoded) {
        throw new Error();
      }
      const user = await this.userService
        .repository()
        .findOneBy({ id: decoded.sub });
      if (!user) {
        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
      }
      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (!isRefreshTokenMatching) {
        throw new UnauthorizedException('Invalid token');
      }
      await this.jwtService.verifyAsync(
        refreshToken,
        this.getTokenOptions('refresh'),
      );
      return this.login(user);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private getTokenOptions(type: string) {
    const options: JwtSignOptions = {
      secret: this.configService.get(`jwt.${type}Token.secret`),
    };
    const expiration = this.configService.get<number>(`jwt.${type}Token.ttl`);
    if (expiration) {
      options.expiresIn = expiration;
    }
    return options;
  }

  async getMe(authUser: AuthenticatedUser): Promise<User> {
    try {
      const user = await this.userService
        .repository()
        .findOneBy({ id: authUser.id });
      return user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const user = await this.userService.repository().update(userId, {
      refreshToken: currentHashedRefreshToken,
    });
    if (!user) {
      throw new ConflictException();
    }
    return user;
  }

  async removeRefreshToken(userId: number) {
    const user = await this.userService.repository().update(userId, {
      refreshToken: null,
    });
    if (!user) {
      throw new ConflictException();
    }
    return user;
  }
}
