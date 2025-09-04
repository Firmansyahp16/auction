import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { generateID, IDType } from '../utils/generateID';
import { hashPassword } from '../utils/hash';
import { AuthService } from './auth.service';

@Controller('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private db: DatabaseService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.verifyCredentials(body);
    const profile = await this.authService.convertToProfile(user);
    const token = await this.authService.generateToken(profile);
    return {
      token: token,
      userId: profile.sub,
      ttl: this.authService.parseTimeToSeconds('1h'),
    };
  }

  @Post('register')
  async register(
    @Body()
    body: {
      fullName: string;
      email: string;
      password: string;
      role?: Role[];
    },
  ) {
    const foundUser = await this.db.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (foundUser) {
      throw new BadRequestException('User already exists');
    }
    const regex = new RegExp(/^[A-Za-z0-9]+$/);
    if (!regex.test(body.password)) {
      throw new BadRequestException(
        'Password must have at least one capital letter, one small letter and one number',
      );
    }
    const hashed = await hashPassword(body.password, 10);
    const user = await this.db.user.create({
      data: {
        id: generateID(IDType.USER),
        fullName: body.fullName,
        email: body.email,
        hashedPassword: hashed,
        role: body.role,
      },
    });
    const profile = this.authService.convertToProfile(user);
    const token = await this.authService.generateToken(profile);
    return {
      token: token,
      userId: profile.sub,
      ttl: this.authService.parseTimeToSeconds('1h'),
    };
  }

  @Post('refresh')
  async refresh(@Body() body: { token: string }) {
    const decoded = await this.authService.verifyToken(body.token);
    const userId = decoded.sub;
    if (!userId) {
      throw new BadRequestException('Invalid token');
    }
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const profile = this.authService.convertToProfile(user);
    const token = await this.authService.generateToken(profile);
    return {
      token: token,
      userId: profile.sub,
      ttl: this.authService.parseTimeToSeconds('1h'),
    };
  }
}
