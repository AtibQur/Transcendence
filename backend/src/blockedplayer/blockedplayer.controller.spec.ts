import { Test, TestingModule } from '@nestjs/testing';
import { BlockedplayerController } from './blockedplayer.controller';
import { BlockedplayerService } from './blockedplayer.service';

describe('BlockedplayerController', () => {
  let controller: BlockedplayerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockedplayerController],
      providers: [BlockedplayerService],
    }).compile();

    controller = module.get<BlockedplayerController>(BlockedplayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
