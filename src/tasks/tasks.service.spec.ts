import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
});

const mockUser = {
  username: 'TestUser',
  id: 'someId',
  password: 'somePassword',
  tasks: [],
};

const mockTask = {
  title: 'Test title',
  description: 'Test desc',
  id: 'someId',
  status: TaskStatus.OPEN,
  user: mockUser,
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTasksById', () => {
    it('calls TasksRepository.findOne and return the result', async () => {
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findOne and handles and error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('calls TasksRepository.createTask and create a task', async () => {
      tasksRepository.createTask.mockResolvedValue(mockTask);
      const result = await tasksService.createTask(mockTask, mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.createTask and handles and error', async () => {
      tasksRepository.createTask.mockResolvedValue(null);
      expect(tasksService.createTask(mockTask, mockUser)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
