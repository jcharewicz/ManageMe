import { Project } from './project.model';
import { User } from './user.model';

export class Functionality {
  id: string;
  name: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  project: Project;
  owner: User;
  status: 'To-Do' | 'Doing' | 'Done';

  constructor(
    id?: string,
    name?: string,
    description?: string,
    priority?: 'Low' | 'Medium' | 'High',
    project?: Project,
    owner?: User,
    status?: 'To-Do' | 'Doing' | 'Done'
  ) {
    this.id = id || '';
    this.name = name || '';
    this.description = description || '';
    this.priority = priority || 'Low';
    this.project = project || new Project('1', 'Default Project', 'This is a default project');
    this.owner = owner || new User();
    this.status = status || 'To-Do';
  }
}