import { Test, TestingModule } from '@nestjs/testing';
import { ChannelmemberService } from './channelmember.service';

describe('ChannelmemberService', () => {
  let service: ChannelmemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelmemberService],
    }).compile();

    service = module.get<ChannelmemberService>(ChannelmemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
