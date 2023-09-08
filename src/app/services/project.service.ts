import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor() {

    let projects = this.getProjects();

    if (!projects || projects.length === 0) {
      const defaultProject = new Project('1', 'Default Project', 'This is the description of a default project.');
      this.setProjects([defaultProject]);
    }
  }


  getProjects(): Project[] {
    const projects = localStorage.getItem('projects');
    return projects ? JSON.parse(projects) : [];
  }


  setProjects(projects: Project[]): void {
    localStorage.setItem('projects', JSON.stringify(projects));
  }


  getProjectById(projectId: string): Project | null {
    const projects = this.getProjects();
    return projects.find(project => project.id === projectId) || null;
  }
}