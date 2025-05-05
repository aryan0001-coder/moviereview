import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { Types } from 'mongoose';

interface JwtPayload {
  email: string;
  sub: string;
  role: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  user: UserResponse;
  accessToken?: string;
}

type UserWithoutPassword = Omit<UserDocument, 'password'> & {
  _id: Types.ObjectId;
  email: string;
  name: string;
  role: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    const userObj = user.toObject() as UserWithoutPassword & {
      password: string;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...result } = userObj;
    return result as UserWithoutPassword;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      email: user.email,

      sub: user._id.toString(),
      role: user.role,
    };

    const userResponse: UserResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return {
      user: userResponse,
      accessToken: this.jwtService.sign(payload),
    };
  }
  async register(
    createUserDto: CreateUserDto,
  ): Promise<Omit<AuthResponse, 'accessToken'>> {
    const user = await this.usersService.create(createUserDto);
    const userResponse: UserResponse = {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return {
      user: userResponse,
    };
  }
}
