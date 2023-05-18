import { Controller, Post, Body } from '@nestjs/common';
import { CrudService } from './crud.service';

@Controller()
export class CrudController {
    constructor(private readonly crudService: CrudService) {}

    @Post()
    createPlayer(@Body('username') username: string): Promise<void> {
        return this.crudService.createPlayer(username);
    }
}
