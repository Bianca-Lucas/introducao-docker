import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { registerDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      generateToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('deve registrar um usuário', async () => {
    const dto: registerDto = {
      username: 'Lucas',
      email: 'lucas@gmail.com',
      password: '123456',
    };

    const result = {
      id: '1',
      name: dto.username,
      email: dto.email,
      role: UserRole.USER,
      access_token: 'fake-jwt-token',
    };

    mockAuthService.register.mockResolvedValue({
      id: result.id,
      name: result.name,
      email: result.email,
      role: result.role,
      access_token: result.access_token
    });

    mockAuthService.generateToken.mockResolvedValue(result.access_token);

    const response = await controller.register(dto);

    expect(response).toEqual(result);

    expect(mockAuthService.register).toHaveBeenCalledWith(
      expect.objectContaining({
        username: dto.username,
        email: dto.email,
        password: dto.password,
      }),
    );
  });

  it('deve logar um usuário', async () => {
    const dto: LoginDto = { email: 'lucas@gmail.com', password: '123456' };

    const result = {
      id: '1',
      name: 'Lucas',
      email: dto.email,
      role: UserRole.USER,
      access_token: 'fake-jwt-token',
    };

    mockAuthService.login.mockResolvedValue(result);

    const response = await controller.login(dto);

    expect(response).toEqual(result);
    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
  });
});
