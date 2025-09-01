import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        description: 'Nome do usuário',
        example: 'Bruno Henrique',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Email do usuário',
        example: 'brunin@gmail.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Senha do usuário',
        example: 'senha123',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
