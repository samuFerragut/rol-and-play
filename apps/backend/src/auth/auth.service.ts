import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingEmail = await this.usersService.findByEmail(
      registerDto.email,
    );

    if (existingEmail) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_EXISTS',
        field: 'email',
        message: 'Ya existe una cuenta creada con este correo.',
      });
    }

    const existingUsername = await this.usersService.findByUsername(
      registerDto.username,
    );

    if (existingUsername) {
      throw new ConflictException({
        code: 'USERNAME_ALREADY_EXISTS',
        field: 'username',
        message: 'Este nombre de usuario ya está en uso.',
      });
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.createUser({
      username: registerDto.username,
      email: registerDto.email,
      passwordHash,
    });

    const token = await this.createAccessToken(user.id, user.email);

    return {
      accessToken: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.identifier, true);

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    const token = await this.createAccessToken(user.id, user.email);

    return {
      accessToken: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  private async createAccessToken(userId: string, email: string) {
    return this.jwtService.signAsync({
      sub: userId,
      email,
    });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);

    // SIEMPRE devolvemos éxito
    if (!user) {
      return {
        success: true,
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 30); // 30 min

    await user.save();

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    await this.mailService.sendPasswordResetEmail(user.email, resetUrl);

    return {
      success: true,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByResetToken(
      resetPasswordDto.token,
    );

    if (
      !user ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      throw new UnauthorizedException('El enlace de recuperación ha expirado.');
    }

    const passwordHash = await bcrypt.hash(resetPasswordDto.password, 10);

    user.passwordHash = passwordHash;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return {
      success: true,
    };
  }
}
