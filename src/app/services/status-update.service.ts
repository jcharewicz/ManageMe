import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class StatusUpdateService {

  constructor() {}

  updateFunctionalityStatus(functionalityUpdateMethod: (functionalityId: string) => void, functionalityId: string): void {
    functionalityUpdateMethod(functionalityId);
  }

  updateStatusAfterTaskChange(task: Task, functionalityUpdateMethod: (functionalityId: string) => void): void {
    if (task) {
      this.updateFunctionalityStatus(functionalityUpdateMethod, task.functionality.id);
    }
  }
}