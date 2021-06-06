import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude } from "class-transformer";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true })
  username: string

  @Prop()
  password: string

  @Prop()
  accountNumber: number

  @Prop()
  emailAddress: string

  @Prop()
  identityNumber: number
}

export const UserSchema = SchemaFactory.createForClass(User);