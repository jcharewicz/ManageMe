import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { StatusUpdateService } from './status-update.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  tasks: Task[] = [];

  constructor(private statusUpdateService: StatusUpdateService) {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      this.tasks = JSON.parse(tasks);
    }
  }

  public getTaskById(taskId: string): Task | null {
    return this.tasks.find(task => task.id === taskId) || null;
  }

  getAll(): Task[] {
    return this.tasks;
  }

  getTasksByFunctionalityId(functionalityId: string): Task[] {
    return this.tasks.filter(task => task.functionality.id === functionalityId);
  }

  createTask(task: Task, updateFuncStatusCallback: (functionalityId: string) => void): void {
    let lastId = Number(localStorage.getItem('lastTaskId')) || 0;
    lastId++;
    task.id = lastId.toString();
    localStorage.setItem('lastTaskId', lastId.toString());
    this.tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    if (task) {
      this.statusUpdateService.updateStatusAfterTaskChange(task, updateFuncStatusCallback);
    }
  }

  deleteTask(id: string, updateFuncStatusCallback: (functionalityId: string) => void): void {
    const task = this.tasks.find(t => t.id === id);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
    if (task) {
      this.statusUpdateService.updateStatusAfterTaskChange(task, updateFuncStatusCallback);
    }
  }

  editTask(task: Task, updateFuncStatusCallback: (functionalityId: string) => void): void {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = task;
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      this.statusUpdateService.updateStatusAfterTaskChange(task, updateFuncStatusCallback);
    }
  }

  deleteTasksByFunctionalityId(functionalityId: string): void {
    this.tasks = this.tasks.filter(task => task.functionality.id !== functionalityId);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  formatDate(date: Date): string {
    return `${date.getHours()}-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

}