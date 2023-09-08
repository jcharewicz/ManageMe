import { Functionality } from "./functionality.model";
import { User } from './user.model';

  export class Task {
    id: string;
    name: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    functionality: Functionality;
    estimatedExecutionTime: string;
    status: 'To-Do' | 'Doing' | 'Done';
    dateAdded: string;
    startDate: string;
    endDate: string;
    assignedUser: User;

    constructor(
      id?: string,
      name?: string,
      description?: string,
      priority?: 'Low' | 'Medium' | 'High',
      functionality?: Functionality,
      estimatedExecutionTime?: string,
      status?: 'To-Do' | 'Doing' | 'Done',
      dateAdded?: string,
      startDate?: string,
      endDate?: string,
      assignedUser?: User
    ) {
      this.id = id || '';
      this.name = name || '';
      this.description = description || '';
      this.priority = priority || 'Low';
      this.functionality = functionality || new Functionality();
      this.estimatedExecutionTime = estimatedExecutionTime || '';
      this.status = status || 'To-Do';
      this.dateAdded = dateAdded || '';
      this.startDate = startDate || '';
      this.endDate = endDate || '';
      this.assignedUser = assignedUser || new User();
    }
  }