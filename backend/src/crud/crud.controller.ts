import { Controller, Post, Body } from '@nestjs/common';
import { CrudService } from './crud.service';

@Controller()
export class CrudController {
    constructor(private readonly crudService: CrudService) {}

    @Post('createplayer')
    createPlayer(@Body('username') username: string): Promise<void> {
        return this.crudService.createPlayer(username);
    }

    @Post('incrementwins')
    updateWins(@Body('id') id: number): Promise<void> {
        console.log(id);
        return this.crudService.updateWins(id);
    }

    @Post('incrementlosses')
    updateLosses(@Body('id') id: number): Promise<void> {
        console.log(id);
        return this.crudService.updateLosses(id);
    }

    @Post('incrementlevel')
    updateLevel(@Body('id') id: number): Promise<void> {
        console.log(id);
        return this.crudService.updateLevel(id);
    }
}
