import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string, includePassword = false) {
    const query = this.userModel.findOne({ email: email.toLowerCase() });

    if (includePassword) {
      query.select('+passwordHash');
    }

    return query.exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async findByUsername(username: string) {
    return this.userModel
      .findOne({ username: username.toLowerCase().trim() })
      .exec();
  }

  async createUser(data: {
    username: string;
    email: string;
    passwordHash: string;
  }) {
    const user = new this.userModel({
      ...data,
      username: data.username.toLowerCase().trim(),
      email: data.email.toLowerCase().trim(),
    });

    return user.save();
  }

  async findByResetToken(token: string) {
    return this.userModel.findOne({
      resetPasswordToken: token,
    });
  }
}
