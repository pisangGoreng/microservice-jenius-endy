import { config } from 'dotenv';
config();

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { RedisCacheModule } from './redisCache/redisCache.module';

const {
  MONGGOSE_USER,
  MONGGOSE_PASSWORD,
  DB_NAME
} = process.env
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${MONGGOSE_USER}:${MONGGOSE_PASSWORD}@endy.vcbo0.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
    ),
    RedisCacheModule,
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
