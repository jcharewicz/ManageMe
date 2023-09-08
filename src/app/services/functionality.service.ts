import { Injectable } from '@angular/core';
import { Functionality } from '../models/functionality.model';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root'
})
export class FunctionalityService {

  functionalities: Functionality[] = [];

  constructor(private taskService: TaskService) {
    const functionalities = localStorage.getItem('functionalities');
    if (functionalities) {
      this.functionalities = JSON.parse(functionalities);
    }
  }

  getAll(): Functionality[] {
    return this.functionalities;
  }

  get(id: string) {
    return this.functionalities.find(func => func.id === id);
  }

  getFunctionalitiesByProjectId(projectId: string): Functionality[] {
    return this.functionalities.filter(func => func.project.id === projectId);
  }

  createFunctionality(functionality: Functionality): void {
    let lastId = Number(localStorage.getItem('lastFunctionalityId')) || 0;
    lastId++;
    functionality.id = lastId.toString();
    localStorage.setItem('lastFunctionalityId', lastId.toString());
    this.functionalities.push(functionality);

    localStorage.setItem('functionalities', JSON.stringify(this.functionalities));
}

  deleteFunctionality(id: string): void {
  const index = this.functionalities.findIndex(f => f.id === id);
  if (index !== -1) {
      this.functionalities.splice(index, 1);
      localStorage.setItem('functionalities', JSON.stringify(this.functionalities));
  
      this.taskService.deleteTasksByFunctionalityId(id);
  }
}

  editFunctionality(functionality: Functionality): void {
  const index = this.functionalities.findIndex(f => f.id === functionality.id);
  if (index !== -1) {
      this.functionalities[index] = functionality;
      localStorage.setItem('functionalities', JSON.stringify(this.functionalities));
  }
}

  updateFunctionalityStatus(functionalityId: string): void {
  const functionality = this.get(functionalityId);
  if (!functionality) return;

  const tasks = this.taskService.getTasksByFunctionalityId(functionalityId);

  if (tasks.every(task => task.status === 'Done')) {
    functionality.status = 'Done';
  } else if (tasks.some(task => task.status === 'Doing')) {
    functionality.status = 'Doing';
  } else {
    functionality.status = 'To-Do';
  }

  this.editFunctionality(functionality);
  }

}