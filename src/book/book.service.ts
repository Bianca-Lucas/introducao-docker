import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/uptade-book.dto";
import { Book } from "@prisma/client";
import { BookCategory } from '@prisma/client';

@Injectable()
export class BookService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateBookDto) {
        const bookExist = await this.prisma.book.findUnique({
            where: { title: data.title }
        })

        if (bookExist) {
            throw new ConflictException("Livro já cadastrado!")
        }

        const newBook = await this.prisma.book.create({
            data: {
                title: data.title,
                author: data.author,
                publicationDate: data.publicationDate,
                category: data.category?.toUpperCase() as BookCategory
            }
        })

        return newBook
    }

    async findAll(): Promise<Book[]> {
        return this.prisma.book.findMany()
    }

    async findById(id: string): Promise<Book | null> {
        const founderBook = await this.prisma.book.findUnique({
            where: { id }
        })

        if (!founderBook) {
            throw new NotFoundException(`
                
                Livro com id ${id} não identificado
                
                `)
        }

        return founderBook
    }

    async update(id: string, data: UpdateBookDto) {
        const book = await this.prisma.book.findUnique({ where: { id } });

        if (!book) {
            throw new NotFoundException(`Livro com id ${id} não identificado`);
        }

        return this.prisma.book.update({
            where: { id },
            data: { ...data, category: data.category?.toUpperCase() as BookCategory },
        });
    }

    async delete(id: string): Promise<Book | null> {
        try {
            return await this.prisma.book.delete({ where: { id } })
        } catch {
            throw new NotFoundException(`

                Livro com id ${id} não identificado
                
                `)
        }
    }
}