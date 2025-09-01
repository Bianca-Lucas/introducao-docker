import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';

@Controller('users') 
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Listar todos os usuários' }) 
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso.' }) 
  @ApiResponse({ status: 404, description: 'Nenhum usuário encontrado.' }) 
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Obter um usuário por ID' }) 
  @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso.' }) 
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' }) 
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  findUnique(@Param('id') id: string) {
    return this.userService.findUnique(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Atualizar um usuário por ID' }) 
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' }) 
  @ApiResponse({ status: 400, description: 'Dados inválidos.' }) 
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' }) 
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Deletar um usuário por ID' }) 
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso.' }) 
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' }) 
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
