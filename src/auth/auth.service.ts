import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { comparePassword } from '../utils/hash';

export interface MyUserProfile {
  sub?: string;
  name?: string;
  email?: string;
  role?: Role[];
  source?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private db: DatabaseService,
  ) {}

  async generateToken(userProfile: MyUserProfile) {
    if (!userProfile) {
      throw new UnauthorizedException('UserProfile is null');
    }
    const payload = {
      sub: userProfile.sub,
      name: userProfile.name,
      email: userProfile.email,
      role: userProfile.role,
      source: 'NEST',
    };
    // return signAsync
    return this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string) {
    if (!token) {
      throw new UnauthorizedException('Token is null');
    }
    let profile: MyUserProfile;
    const decryptedToken = await this.jwtService.verifyAsync(token, {
      secret: 'secret',
    });
    profile = {
      ...decryptedToken,
      source: 'NEST',
    };
    return profile;
  }

  async verifyCredentials(credential: { email: string; password: string }) {
    const foundUser = await this.db.user.findUnique({
      where: {
        email: credential.email,
      },
    });
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    const matched = await comparePassword(
      credential.password,
      String(foundUser.hashedPassword),
    );
    if (!matched) {
      throw new UnauthorizedException('Password is not matched');
    }
    return foundUser;
  }

  convertToProfile(user: User): MyUserProfile {
    return {
      sub: String(user.id),
      name: String(user.fullName),
      email: String(user.email),
      role: user.role,
      source: 'NEST',
    };
  }

  parseTimeToSeconds(input: string): number {
    const regex = /^(\d+)([smhd])$/i;
    const match = input.match(regex);

    if (!match) {
      throw new Error(`Invalid time format: ${input}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 60 * 60 * 24;
      default:
        throw new Error(`Unsupported time unit: ${unit}`);
    }
  }
}
