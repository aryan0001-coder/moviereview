import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { ConfigService,ConfigModule } from '@nestjs/config';

Module({
  imports: [
    ConfigModule, 
    JwtModule.registerAsync({
      imports: [ConfigModule], // ← Optional if you want config in JWT config
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  providers: [AuthService,JwtStrategy],
  exports: [AuthService,JwtStrategy],
})
export class AuthModule {}


//  providers: [AuthService, JwtStrategy],
//   exports: [AuthService],
//UsersModule