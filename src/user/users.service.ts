import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema'


@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>
    ) {}

  public create(){
    console.log('service ny ajalan')
    const createdUser = new this.userModel({
      userName: 'username',
      password: 'bukabuka',
      accountNumber: 123,
      emailAddress: 'emailAddress',
      identityNumber: 123
    });
    return createdUser.save();
  }
}