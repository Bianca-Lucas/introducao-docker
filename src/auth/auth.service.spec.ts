import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let mockPrismaService: any;
  let mockJwtService: any;

  beforeEach(async () => {
    mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    mockJwtService = {
      signAsync: jest.fn().mockResolvedValue('fakeToken'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('deve registrar um novo usuário', async () => {
    const dto = { username: 'Lucas', email: 'lucas@gmail.com', password: '123456' };

    mockPrismaService.user.findUnique.mockResolvedValue(null);
    mockPrismaService.user.create.mockResolvedValue({
      id: '1',
      name: dto.username,
      email: dto.email,
      role: UserRole.USER,
    });

    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

    const result = await service.register(dto);

    expect(result).toEqual({
      id: '1',
      name: dto.username,
      email: dto.email,
      role: UserRole.USER,
    });
  });

  it('deve gerar um token JWT válido', async () => {
    const payload = { id: '1', email: 'lucas@gmail.com', role: UserRole.USER };

    const token = await service.generateToken(payload);

    expect(token).toBe('fakeToken');
    expect(mockJwtService.signAsync).toHaveBeenCalledWith(payload, { expiresIn: '1h' });
  });
  
  it('deve realizar login com credenciais válidas', async () => {
    const dto = { email: 'lucas@gmail.com', password: '123456' };
    const user = {
      id: '1',
      email: dto.email,
      password: 'hashedPassword',
      role: UserRole.USER,
    };

    mockPrismaService.user.findUnique.mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const result = await service.login(dto);

    expect(result).toEqual({
      access_token: 'fakeToken',
    });
  });

  it('deve lançar erro ao tentar registrar email já existente', async () => {
    const dto = { username: 'Lucas', email: 'lucas@gmail.com', password: '123456' };
    mockPrismaService.user.findUnique.mockResolvedValue({ id: '1', email: dto.email });

    await expect(service.register(dto)).rejects.toThrow('Email já cadastrado!');
  });

  it('deve lançar UnauthorizedException se senha for inválida', async () => {
    const dto = { email: 'lucas@gmail.com', password: 'wrong' };
    const user = { id: '1', email: dto.email, password: 'hashedPassword', role: UserRole.USER };

    mockPrismaService.user.findUnique.mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
  });

  it('validateUser deve lançar UnauthorizedException se usuário não existir', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(null);

    await expect(service.validateUser('email@teste.com', '123456'))
      .rejects.toThrow(new UnauthorizedException('Credenciais inválidas!'));
  });

  it('validateUser deve retornar usuário se credenciais forem válidas', async () => {
    const user = { id: '1', email: 'a@a.com', password: 'hashedPassword', role: UserRole.USER };
    mockPrismaService.user.findUnique.mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const result = await service.validateUser('a@a.com', '123456');

    expect(result).toEqual(user);
  });
});
