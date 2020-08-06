import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatus = [TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN];

  transform(value: string): any {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" is an invalid status`);
    }
    return value;
  }

  private isStatusValid(status: any) {
    const index = this.allowedStatus.indexOf(status);
    return index !== -1;
  }
}
