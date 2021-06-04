import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://endy:endy@endy.vcbo0.mongodb.net/microservice-jenius-endy?retryWrites=true&w=majority`
    ),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
