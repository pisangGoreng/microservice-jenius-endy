import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  userName: string

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