import { Component, OnInit } from '@angular/core';
import { FunctionalityService } from '../services/functionality.service';
import { ActivatedRoute } from '@angular/router';
import { Functionality } from '../models/functionality.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ProjectService } from '../services/project.service';
import { User } from '../models/user.model';
import { Project } from '../models/project.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-functionality',
  templateUrl: './functionality.component.html',
  styleUrls: ['./functionality.component.css']
})
export class FunctionalityComponent implements OnInit {
  
  user!: User;
  project!: Project;
  functionalities: Functionality[] = [];
  editingFunctionalityId: string | null = null;

  functionalityForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    priority: new FormControl('Low', Validators.required),
  });

  constructor(
    private router: Router,
    private functionalityService: FunctionalityService,
    private route: ActivatedRoute,
    private userService: UserService,
    private projectService: ProjectService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const projectId = params['projectId'];
      this.functionalities = this.functionalityService.getFunctionalitiesByProjectId(projectId);
  
      if (!this.functionalities) {
        this.functionalities = [];
      }
      
      const project = this.projectService.getProjectById(projectId);
      if (!project) {
        this.router.navigate(['/error'], { queryParams: { message: `No project exists with id ${projectId}` } });
        return;
      }
  
      this.project = project;
      this.user = this.userService.getUser();
    });
  }

  onSubmit(): void {

    const controls = this.functionalityForm.controls as { [key: string]: FormControl };

    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        controls[controlName].markAsTouched();
      }
    }
  
    if (!this.functionalityForm.valid) {
      return;
    }
  

    const functionality: Functionality = {
      id: '',
      name: this.functionalityForm.value.name || '',
      description: this.functionalityForm.value.description || '',
      priority: 'Low',
      project: this.project,
      owner: this.user,
      status: 'To-Do'
    };

    this.functionalityService.createFunctionality(functionality);
    this.functionalities.push(functionality);
    this.functionalityForm.reset();
  }

  navigateToTasks(functionalityId: string): void {
    this.router.navigate([`/${this.project.id}/${functionalityId}/tasks`]);
  }

  editFunctionality(id: string): void {
    this.editingFunctionalityId = id;
  }

  stopEditing(): void {
    this.editingFunctionalityId = null;
  }

  submitEditForm(functionality: Functionality): void {
    this.functionalityService.editFunctionality(functionality);
    this.stopEditing();
  }

  deleteFunctionality(id: string): void {
    if (confirm('Are you sure you want to delete this functionality? All associated tasks will also be deleted.')) {
      this.functionalityService.deleteFunctionality(id);
      this.functionalities = this.functionalities.filter(f => f.id !== id);
    }
  }
  
  navigateToProjects(): void {
    this.router.navigate(['/projects']);
  }
  
}