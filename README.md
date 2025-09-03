<p align="center">
  <img src="src/assets/book-platform.png" alt="Book Platform Logo" width="300"/>
</p>

# Book Platform📚
> Este projeto desenvolvido em NestJS e TypeScript tem como objetivo principal proporcionar uma experiência mais eficiente e organizada para criar, listar, atualizar e deletar livros.📘

## 🚀 Começando
Essas instruções permitirão que você obtenha uma cópia do projeto na sua máquina local para fins de desenvolvimento e teste.

Consulte **[Implantação](##-Implantação)** para saber como implantar o projeto.

## Índices:
- [Objetivo do Projeto](##-Objetivo-do-Projeto)
- [Funcionalidades](##-Funcionalidades)
- [Estruturas de Pastas](##-Estruturas-de-Pastas)
- [Instalação](##-Instalação)
- [Principais Dependências](#Principais-Dependências)
- [Ferramentas](##-Ferramentas)
- [Implantação](##-Implantação)
- [Contribuição](##-Contribuição)
- [Licença](##-Licença)
- [Autores](##-Autores)

## Objetivo do Projeto 🚀
> A motivação por trás deste projeto é melhorar a experiência do turista, facilitando o acesso a informações confiáveis e organizadas sobre os destinos, promovendo o turismo consciente e valorizando os atrativos das regiões litorâneas e demais pontos turísticos.

## Funcionalidades 🚀
- A aplicação permite o registro e login de usuários, oferecendo acesso a informações importantes sobre os livros que desejam conhecer. 
- Além disso, conta com a funcionalidade de registro e login de usuários administradores, que têm permissões especiais para gerenciar os dados do sistema.
- Os administradores podem adicionar novos livros, listar todos os livros cadastrados, filtrar livros por ID, atualizar as informações de cada livro e remover livros do banco de dados quando necessário. Com essas funcionalidades, o sistema garante que os dados estejam sempre atualizados e relevantes para quem os acessa.

## Estruturas de Pastas 📂
```bash
├── src/
|   ├── assets/
|          └── book-platform.png
│   ├── auth/
│       ├── dto/
|       |    ├── login-response.dto.ts
|       |    ├── login.dto.ts
|       |    └── register.dto.ts
|       ├── admin.guard.ts
|       ├── auth.controller.spec.ts
|       ├── auth.controller.ts
|       ├── auth.module.ts
|       ├── auth.service.spec.ts
|       ├── auth.service.ts
|       ├── jwt-auth.guard.ts
|       ├── jwt.strategy.ts
|       └── user.guard.ts
│   ├── book/
│       ├── dto/
|       |    ├── create-book.dto.ts
|       |    └── update-book.dto.ts
|       ├── book.controller.spec.ts
|       ├── book.controller.ts
|       ├── book.module.ts
|       ├── book.service.spec.ts
|       └── book.service.ts
│   ├── prisma/
|       ├── prisma.module.ts
|       ├── prisma.service.spec.ts
|       └── prisma.service.ts
│   ├── user/
│       ├── dto/
|       |    ├── create-user.dto.ts
|       |    └── update-user.dto.ts
|       ├── user.controller.spec.ts
|       ├── user.controller.ts
|       ├── user.module.ts
|       ├── user.service.spec.ts
|       └── user.service.ts
├── app.module.ts
└── main.ts
```
## Instalação📦
Clone o repositório e instale as dependências:

```bash
git clone https://github.com/Bianca-Lucas/introducao-docker.git
cd introducao-docker
npm install
```

## Principais Dependências🧱
Instale manualmente, se necessário:

```bash
npm install @nestjs/passport passport passport-jwt 
npm install @nestjs/swagger swagger-ui-express
npm install bcrypt
npm install class-transformer class-validator
npm install jsonwebtoken @nestjs/jwt 
npm install prisma @prisma/client
```

## Ferramentas 🛠️
- Bcrypt;
- Class-Validator;
- Class-Transformer;
- JWT;
- NestJS;
- Prisma;
- Swagger;

## Implantação ☁️
Para executar este projeto em um ambiente de produção, siga as etapas abaixo:

### 1. Configuração do Banco de Dados
- Certifique-se de ter o PostgreSQL instalado e rodando.
- Configure o arquivo ```.env ``` com as variáveis necessárias, por exemplo:
``` bash
DATABASE_URL="postgresql://user:password@localhost:5432/bookplatform"
JWT_SECRET="sua_chave_super_secreta"
PORT=3000
```

### 2. Gerar o Prisma Client
Após configurar o banco de dados, rode:
``` bash
npx prisma migrate dev
npx prisma generate
```

### 3. Build da Aplicação
Para gerar os arquivos de produção:
``` bash
npm run build
```

### 4. Rodar em Produção
Inicie o servidor com:
``` bash
npm run start:prod
```

### 5. Usando Docker (Opcional)🐳
O projeto já está preparado para rodar em containers.
- Suba os serviços com:
``` bash
docker-compose up --build
```
- Isso vai iniciar tanto o PostgreSQL quanto a API NestJS.

## Contribuição 🙋‍♂️
Contribuições são bem-vindas!
Sinta-se livre para abrir issues ou enviar pull requests.

## Licença 📝 
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Autores
| [<img loading="lazy" widht= 150 height= 150 src="https://avatars.githubusercontent.com/u/197404558?v=4" widht=50><br><sub>Bianca Lucas</sub>](https://github.com/Bianca-Lucas) 
| :---: |