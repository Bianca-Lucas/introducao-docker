import { Test } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { BookService } from './book.service';
import { PrismaService } from '../prisma/prisma.service';
import { Book } from 'generated/prisma';

const mockPrismaService = {
  book: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('LivroService - testes completos', () => {
  let service: BookService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = moduleRef.get<BookService>(BookService);
  });

  it('deve criar um livro se não existir', async () => {
    const dadosLivro = { title: 'O Pequeno Príncipe', author: 'Antoine de Saint-Exupéry', publicationDate: new Date(), category: 'LITERATURE' };
    mockPrismaService.book.findUnique.mockResolvedValue(null);
    mockPrismaService.book.create.mockResolvedValue({ id: '1', ...dadosLivro });

    const resultado = await service.create(dadosLivro as any);

    expect(resultado).toEqual({ id: '1', ...dadosLivro });
  });

  it('deve lançar ConflictException se o livro já existir', async () => {
    mockPrismaService.book.findUnique.mockResolvedValue({ id: '1', title: 'Livro 1' } as any);

    await expect(service.create({ title: 'Memorias Póstumas de Brás Cubas', author: 'Machado de Assis', publicationDate: new Date(), category: 'LITERATURE' } as any))
      .rejects.toThrow(ConflictException);
  });

  it('deve listar todos os livros', async () => {
    const livros = [{ id: '1', title: 'Memorias Póstumas de Brás Cubas', author: 'Machado de Assis', publicationDate: new Date(), category: 'LITERATURE' }];
    mockPrismaService.book.findMany.mockResolvedValue(livros);

    const resultado = await service.findAll();

    expect(resultado).toEqual(livros);
  });

  it('deve buscar livro por id', async () => {
    const livro = { id: '1', title: 'Memorias Póstumas de Brás Cubas', author: 'Machado de Assis', publicationDate: new Date(), category: 'LITERATURE' };
    mockPrismaService.book.findUnique.mockResolvedValue(livro);

    const resultado = await service.findById('1');

    expect(resultado).toEqual(livro);
  });

  it('deve lançar NotFoundException ao buscar livro inexistente', async () => {
    mockPrismaService.book.findUnique.mockResolvedValue(null);

    await expect(service.findById('999')).rejects.toThrow(NotFoundException);
  });

  it('deve atualizar um livro existente', async () => {
    const livroAtual = {
      id: '1',
      title: 'O pequeno Príncipe',
      author: 'Antoine de Saint-Exupéry',
      publicationDate: new Date(),
      category: 'LITERATURE'
    };
    const dadosAtualizados = { title: 'O Pequeno Príncipe Atualizado', author: 'Antoine de Saint-Exupéry', publicationDate: new Date(), category: 'LITERATURE' };
    mockPrismaService.book.findUnique.mockResolvedValue(livroAtual);
    mockPrismaService.book.update.mockResolvedValue({ ...livroAtual, ...dadosAtualizados });

    const resultado = await service.update('1', dadosAtualizados as any);

    expect(resultado.title).toBe('O Pequeno Príncipe Atualizado');
  });

  it('deve lançar NotFoundException ao atualizar livro inexistente', async () => {
    mockPrismaService.book.findUnique.mockResolvedValue(null);

    await expect(service.update('999', { title: 'X' } as any)).rejects.toThrow(NotFoundException);
  });

  it('deve deletar um livro existente', async () => {
    const livro = { id: '1', title: 'O pequeno Príncipe', author: 'Antoine de Saint-Exupéry', publicationDate: new Date(), category: 'LITERATURE' };
    mockPrismaService.book.delete.mockResolvedValue(livro);

    const resultado = await service.delete('1');

    expect(resultado).toEqual(livro);
  });

  it('deve lançar NotFoundException ao deletar livro inexistente', async () => {
    mockPrismaService.book.delete.mockRejectedValue(new Error('não encontrado'));

    await expect(service.delete('999')).rejects.toThrow(NotFoundException);
  });
});
