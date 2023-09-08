import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  project!: Project;

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const projects = this.projectService.getProjects();
    // Branie pierwszego projektu - bo nie ma więcej
    if (projects && projects.length > 0) {
      this.project = projects[0];
    } else {
      this.router.navigate(['/error'], { queryParams: { message: `No projects found` } });
      return;
    }
  }

  navigateToFunctionalities(): void {
    this.router.navigate([`/${this.project.id}/functionalities`]);
  }
  
}