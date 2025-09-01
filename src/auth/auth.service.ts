import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';
import { registerDto } from './dto/register.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async generateToken(payload: { id: string; email: string; role: UserRole }) {
    return this.jwtService.signAsync(payload, { expiresIn: '1h' });
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciais inválidas!');

    if (!user.password)
      throw new UnauthorizedException(
        'Usuário não possui senha definida (Logar com o Google)',
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Credenciais inválidas!');

    return user;
  }

  async register(dto: registerDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) throw new Error('Email já cadastrado!');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.username,
        email: dto.email,
        password: hashedPassword,
        role: UserRole.USER
      },
      select: { id: true, name: true, email: true, role: true },
    });

    return user
  }

  async login(dto: LoginDto): Promise <LoginResponseDto> {
    const user = await this.validateUser(dto.email, dto.password);

    const access_token = await this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {access_token}
  }
}
