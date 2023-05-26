import { Controller, Post, Delete, Body, Param } from '@nestjs/common';
import { CrudService } from './crud.service';

@Controller()
export class CrudController {
    constructor(private readonly crudService: CrudService) {}

    @Post('createplayer')
    createPlayer(@Body('username') username: string): Promise<void> {
        return this.crudService.createPlayer(username, "fakeauth", "fakeauthref");
    }

    @Post('changeusername')
    updateUsername(@Body('id') id: string, @Body('username') username: string) {
        return this.crudService.updateUsername(+id, username);
    }

    @Post('incrementwins')
    updateWins(@Body('id') id: string): Promise<void> {
        console.log(id);
        console.log(+id);
        return this.crudService.updateWins(+id);
    }

    @Post('incrementlosses')
    updateLosses(@Body('id') id: string): Promise<void> {
        return this.crudService.updateLosses(+id);
    }

    @Post('incrementlevel')
    updateLevel(@Body('id') id: string): Promise<void> {
        return this.crudService.updateLevel(+id);
    }

    @Delete('deleteplayer/:id')
    deletePlayer(@Param('id') id: string) {
        return this.crudService.deletePlayer(+id);
    }
}
