import { Module } from '@nestjs/common';
import { TasksController } from './tasks/tasks.controller';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TasksModule],
  controllers: [TasksController],
})
export class AppModule {}
