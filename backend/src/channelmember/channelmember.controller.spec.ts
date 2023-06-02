import { Test, TestingModule } from '@nestjs/testing';
import { ChannelmemberController } from './channelmember.controller';
import { ChannelmemberService } from './channelmember.service';

describe('ChannelmemberController', () => {
  let controller: ChannelmemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelmemberController],
      providers: [ChannelmemberService],
    }).compile();

    controller = module.get<ChannelmemberController>(ChannelmemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
