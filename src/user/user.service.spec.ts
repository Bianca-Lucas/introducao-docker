import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('listar todos os usuários', async () => {
    const users = [{ id: '1', name: 'Maria', email: 'maria@gmail.com', password: 'senha456' }];
    mockPrisma.user.findMany.mockResolvedValue(users);

    await expect(service.findAll()).resolves.toEqual(users);
    expect(mockPrisma.user.findMany).toHaveBeenCalled();
  });

  it('buscar usuário por id existente', async () => {
    const user = { id: '1', name: 'Carlos', email: 'carlos@gmail.com', password: 'senha789' };
    mockPrisma.user.findUnique.mockResolvedValue(user);

    await expect(service.findUnique('1')).resolves.toEqual(user);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('buscar usuário por id inexistente lança NotFoundException', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(service.findUnique('999')).rejects.toThrow(NotFoundException);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: '999' } });
  });

  it('deve atualizar um usuário existente', async () => {
    const updatedData = { name: 'João Atualizado', email: 'joao@gmail.com', password: 'senha123' };
    const hashedPassword = 'hashedPassword';
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

    mockPrisma.user.findUnique.mockResolvedValue({ id: '1', ...updatedData });
    mockPrisma.user.update.mockResolvedValue({ id: '1', ...updatedData, password: hashedPassword });

    const result = await service.update('1', updatedData);

    expect(result).toEqual({ id: '1', ...updatedData, password: hashedPassword });
    expect(bcrypt.hash).toHaveBeenCalledWith(updatedData.password, 10);
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { ...updatedData },
    });
  });

  it('atualizar usuário inexistente lança NotFoundException', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.update('999', { name: 'Inexistente', email: 'x@gmail.com', password: 'senha123' })
    ).rejects.toThrow(NotFoundException);
  });

  it('deve deletar um usuário existente', async () => {
    const user = { id: '1', name: 'João', email: 'joao@gmail.com', password: 'senha123' };
    mockPrisma.user.findUnique.mockResolvedValue(user);
    mockPrisma.user.delete.mockResolvedValue(user);

    const result = await service.delete('1');
    expect(result).toEqual(user);
    expect(mockPrisma.user.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('deletar usuário inexistente lança NotFoundException', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(service.delete('999')).rejects.toThrow(NotFoundException);
  });
});
