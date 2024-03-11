# Inizializzazione di un progetto
```
npx @nestjs/cli new <nomeProgetto>
```

# Generazione moduli da cli
```
npx @nestjs/cli g module <nomeModulo>
```

# Generazione service
```
npx @nestjs/cli g service <nomeService>
```

# Generazione controller
```
npx @nestjs/cli g controller <nomeController>
```

# Concetto di container

Un module contiene tutte le dipendenze necessarie per funzionare (CONTROLLER - SERVICES - REPOSITORY).

Un controller, contiene tutte le rotte e i metodi http del modulo, dove si possono invocare i metodi (SERVICES).

Un service, contiene la parte logica di un'api, che comunica strettamente con i (REPOSITORY).

Un repository, contiene la parte gestionale di un'api, come ad esempio funzioni di un ORM come prisma, per salvare / leggere dati sul DB.

# Rendere un module esportabile
## Esempio del modulo Cpu

```
// cpu.module.ts
@Module({
  imports: [PowerModule],
  providers: [CpuService],
  exports: [CpuService], // Permette di esportare il modulo corrente
})
export class CpuModule {}
```

# Importare un modulo o più, dentro un altro

```
//computer.module.ts
import { Module } from '@nestjs/common';
import { ComputerController } from './computer.controller';
import { CpuModule } from 'src/cpu/cpu.module';
import { DiskModule } from 'src/disk/disk.module';

@Module({
  controllers: [ComputerController],
  imports: [CpuModule, DiskModule], // Il modulo computer contiene il modulo CPU e DISK
})
export class ComputerModule {}

// computer.controller.ts
import { Controller, Get } from '@nestjs/common';
import { CpuService } from 'src/cpu/cpu.service';
import { DiskService } from 'src/disk/disk.service';

@Controller('computer') // Rotta /computer
export class ComputerController {
  // Così possiamo utilizzare i services dei moduli importati.
  constructor(
    private cpuService: CpuService,
    private diskService: DiskService,
  ) {}
  @Get() // Definita la rotta GET su /computer/
  run() {
    return [this.cpuService.compute(1, 2), this.diskService.getData()]; // .compute() è un metodo dentro cpu.service.ts, stessa cosa per getData()
  }
}
```

# Aggiunta di dati persistenti (Prisma ORM)
```
npm install prisma --save-dev
```
```
// Init creerà prisma/schema.prisma con le strutture dati del tuo Database, inclusi i dati di connessione al DB.
// Creerà anche un .env con i dati relativi alla connection sul DB.
npx prisma init
```

# Inserimento di un modello Prisma su schema.prisma
```
model Users {
  id Int @id @default(autoincrement())
  email String
  password String
}
```

Bisogna generare la migration col seguente comando (il db deve essere attivo):

```
npx prisma migrate dev --name init
// Questo creerà la tabella users nel database, in quanto su schema.prisma c'è solo model Users
```

# Creazione del modello dentro la cartella che contiene services etc, esempio: users.model.ts
```

import { Prisma } from '@prisma/client';
// Sfruttiamo il modello creato
export class Users implements Prisma.UsersCreateInput {
  id: number;
  email: string;
  password: string;
}
```

# Creazione del service di prisma
```
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

# PrismaService e le sue dipendenze dai moduli
Dovrebbe trovarsi dentro users.module.ts in questo caso, tra i providers.
```
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [UsersService, PrismaService],
  controllers: [UsersController],
})
export class UsersModule {}

```

# Usiamo prisma dentro un service (users.service.ts)
```
import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(): Promise<Users> {
    return this.prisma.users.create({
      data: {
        email: 'testinUser@gmail.com',
        password: 'qwerty123@',
      },
    });
  }
}
```

# Utilizziamo il service all'interno del controller (users.controller.ts)
```
import { Controller } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from '@prisma/client';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  async create(): Promise<Users> {
    return this.usersService.create();
  }
}
```
## Ulteriori info su NestJS & Prisma
(Link)[https://www.youtube.com/watch?v=t_8Ez7vjDdQ]
