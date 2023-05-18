import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ServeStaticModule} from '@nestjs/serve-static'; // New
// import { join } from 'path'; // New
import { CrudModule } from './crud/crud.module';

@Module({
//   imports: [
//     ServeStaticModule.forRoot({ // New
//       rootPath: join(__dirname, '../..', '/frontend/dist'), // New
//     }), // New
//   ],
 imports: [CrudModule],
 controllers: [AppController],
 providers: [AppService],
})
export class AppModule {}