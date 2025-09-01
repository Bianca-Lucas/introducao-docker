import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class registerDto {
    @ApiProperty({
        example: 'Jonas',
        description: 'Nome de usuário do administrador',
    })
    @IsNotEmpty({ message: 'O nome de usuário é obrigatório' })
    @IsString()
    username: string;

    @ApiProperty({
        example: 'jonas@gmail.com',
        description: 'Email do administrador',
    })
    @IsNotEmpty({ message: 'O email é obrigatório' })
    @IsEmail({}, { message: 'O email deve ser válido' })
    email: string;

    @ApiProperty({
        example: 'senha123',
        description: 'Senha do administrador',
    })
    @IsNotEmpty({ message: 'A senha é obrigatória' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    password: string;
}