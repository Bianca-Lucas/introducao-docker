import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { BookService } from "./book.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UpdateBookDto } from "./dto/uptade-book.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AdminGuard } from "../auth/admin.guard";
import { UserGuard } from "src/auth/user.guard";

@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiOperation({ summary: 'Criar um novo livro' })
    @ApiResponse({ status: 201, description: 'Livro criado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    create(@Body() data: CreateBookDto) {
        return this.bookService.create(data);
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Listar todos os livros' })
    @ApiResponse({ status: 200, description: 'Lista de livros retornada com sucesso.' })
    @ApiResponse({ status: 404, description: 'Nenhum livro encontrado.' })
    findAll() {
        return this.bookService.findAll();
    }

    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obter um livro por ID' })
    @ApiResponse({ status: 200, description: 'Livro encontrado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Livro não encontrado.' })
    findById(@Param('id') id: string) {
        return this.bookService.findById(id);
    }

    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiOperation({ summary: 'Atualizar um livro por ID' })
    @ApiResponse({ status: 200, description: 'Livro atualizado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    @ApiResponse({ status: 404, description: 'Livro não encontrado.' })
    update(@Param('id') id: string, @Body() data: UpdateBookDto) {
        return this.bookService.update(id, data);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiOperation({ summary: 'Deletar um livro por ID' })
    @ApiResponse({ status: 200, description: 'Livro deletado com sucesso.'})
    @ApiResponse({ status: 404, description: 'Livro não encontrado.' })
    delete(@Param('id') id: string) {
        return this.bookService.delete(id);
    }
}