import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Min, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty({
        example: 'jonas@gmail.com',
        description: 'Email do usuário',
    })
    @IsNotEmpty({ message: 'O email não pode ser vazio' })
    @IsEmail({}, { message: 'Email inválido' })
    email: string;

    @ApiProperty({
        example: 'senha123',
        description: 'Senha do usuário',
    })
    @IsNotEmpty({ message: 'A senha não pode ser vazia' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    password: string;
}