import { Test, TestingModule } from "@nestjs/testing";
import { BookController } from "./book.controller";
import { BookService } from "./book.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/uptade-book.dto";
import { NotFoundException } from "@nestjs/common";

const mockBookService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

describe("Book Controller Test", () => {
    let controller: BookController;
    let service: BookService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BookController],
            providers: [
                {
                    provide: BookService,
                    useValue: mockBookService,
                },
            ],
        }).compile();

        controller = module.get<BookController>(BookController);
        service = module.get<BookService>(BookService);
    });

    it("deve criar um livro", async () => {
        const createBookDto: CreateBookDto = {
            title: "Memorias Póstumas de Brás Cubas",
            author: "Machado de Assis",
            category: "FICTION",
        };
        const result = { id: "1", ...createBookDto };
        mockBookService.create.mockResolvedValue(result);

        expect(await controller.create(createBookDto)).toEqual(result);
        expect(mockBookService.create).toHaveBeenCalledWith(createBookDto);
    });

    it("listar todos os livros", async () => {
        const result = [
            { id: "1", title: "O Pequeno Príncipe", author: "Antoine de Saint-Exupéry", category: "FICCAO" },
        ];
        mockBookService.findAll.mockResolvedValue(result);

        expect(await controller.findAll()).toEqual(result);
        expect(mockBookService.findAll).toHaveBeenCalled();
    });

    it("buscar livro por id", async () => {
        const book = { id: "1", title: "Diario de um Banana", author: "Jeff Kinney", category: "INFANTIL" };
        mockBookService.findById.mockResolvedValue(book);

        expect(await controller.findById("1")).toEqual(book);
        expect(mockBookService.findById).toHaveBeenCalledWith("1");
    });

    it("deve lançar NotFoundException se o livro não for encontrado", async () => {
        mockBookService.findById.mockRejectedValue(new NotFoundException("Livro não encontrado"));

        await expect(controller.findById("id não existente")).rejects.toThrow(NotFoundException);
    });

    it("deve atualizar um livro", async () => {
        const updateBookDto: UpdateBookDto = {
            title: "O Pequeno Príncipe - Edição Especial",
            author: "Antoine de Saint-Exupéry",
            category: "FICCAO",
        };
        const result = { id: "1", ...updateBookDto };
        mockBookService.update.mockResolvedValue(result);

        expect(await controller.update("1", updateBookDto)).toEqual(result);
        expect(mockBookService.update).toHaveBeenCalledWith("1", updateBookDto);
    });

    it("deve lançar NotFoundException ao atualizar livro por id inexistente", async () => {
        mockBookService.update.mockRejectedValue(new NotFoundException());

        await expect(controller.update("999", { title: "O pequeno príncipe" } as any)).rejects.toThrow(NotFoundException);
    });

    it("deve deletar um livro", async () => {
        const bookId = "1";
        mockBookService.delete.mockResolvedValue({ id: bookId });

        expect(await controller.delete(bookId)).toEqual({ id: bookId });
        expect(mockBookService.delete).toHaveBeenCalledWith(bookId);
    });
});
