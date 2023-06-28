import { Test, TestingModule } from '@nestjs/testing';
import { BlockedplayerService } from './blockedplayer.service';

describe('BlockedplayerService', () => {
  let service: BlockedplayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockedplayerService],
    }).compile();

    service = module.get<BlockedplayerService>(BlockedplayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
