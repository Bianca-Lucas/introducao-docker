import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    register: jest.fn(),
    findAll: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('listar todos os usuários', async () => {
    const result = [{ id: '1', name: 'Maria', email: 'maria@gmail.com', password: 'senha456' }];
    mockUserService.findAll.mockResolvedValue(result);

    await expect(controller.findAll()).resolves.toEqual(result);
    expect(mockUserService.findAll).toHaveBeenCalled();
  });

  it('buscar usuário por id existente', async () => {
    const user = { id: '1', name: 'Carlos', email: 'carlos@gmail.com', password: 'senha789' };
    mockUserService.findUnique.mockResolvedValue(user);

    await expect(controller.findUnique('1')).resolves.toEqual(user);
    expect(mockUserService.findUnique).toHaveBeenCalledWith('1');
  });

  it('buscar usuário por id inexistente lança NotFoundException', async () => {
    mockUserService.findUnique.mockRejectedValue(new NotFoundException('Usuário com id não encontrado'));

    await expect(controller.findUnique('999')).rejects.toThrow(NotFoundException);
    expect(mockUserService.findUnique).toHaveBeenCalledWith('999');
  });

  it('deve atualizar um usuário existente', async () => {
    const dto = { name: 'João Atualizado', email: 'joao@gmail.com', password: 'joao123' };
    const result = { id: '1', ...dto };
    mockUserService.update.mockResolvedValue(result);

    await expect(controller.update('1', dto)).resolves.toEqual(result);
    expect(mockUserService.update).toHaveBeenCalledWith('1', dto);
  });

  it('atualizar usuário inexistente lança NotFoundException', async () => {
    mockUserService.update.mockRejectedValue(new NotFoundException('Usuário com id não encontrado'));

    await expect(controller.update('999', { name: 'Inexistente' } as any))
      .rejects.toThrow(NotFoundException);
    expect(mockUserService.update).toHaveBeenCalledWith('999', { name: 'Inexistente' });
  });

  it('deve deletar um usuário existente', async () => {
    const result = { id: '1', name: 'João', email: 'joao@gmail.com', password: 'joao123' };
    mockUserService.delete.mockResolvedValue(result);

    await expect(controller.delete('1')).resolves.toEqual(result);
    expect(mockUserService.delete).toHaveBeenCalledWith('1');
  });

  it('deletar usuário inexistente lança NotFoundException', async () => {
    mockUserService.delete.mockRejectedValue(new NotFoundException('Usuário com id não encontrado'));

    await expect(controller.delete('999')).rejects.toThrow(NotFoundException);
    expect(mockUserService.delete).toHaveBeenCalledWith('999');
  });
});
