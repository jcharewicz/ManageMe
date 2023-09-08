import { Component, OnInit } from '@angular/core';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { Functionality } from '../models/functionality.model';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { FunctionalityService } from '../services/functionality.service';
import { ProjectService } from '../services/project.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  
  user!: User;
  functionality!: Functionality;
  tasks: Task[] = [];
  editingTaskId: string | null = null;


  taskForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    priority: new FormControl('Low', Validators.required),
    exectime: new FormControl('', Validators.required),
  });

  constructor(
    private router: Router,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private userService: UserService,
    private projectService: ProjectService,
    private functionalityService: FunctionalityService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const projectId = params['projectId'];
      const functionalityId = params['functionalityId'];
      
      const project = this.projectService.getProjectById(projectId);
      if (!project) {
        this.router.navigate(['/error'], { queryParams: { message: `No project exists with id ${projectId}` } });
        return;
      }
  
      const functionality = this.functionalityService.get(functionalityId);
      if (!functionality) {
        this.router.navigate(['/error'], { queryParams: { message: `No functionality exists with id ${functionalityId} for project ${projectId}` } });
        return;
      }
  
      this.functionality = functionality;
      this.tasks = this.taskService.getTasksByFunctionalityId(functionalityId);
      this.user = this.userService.getUser();
    });
  }

  get todoTasks() {
    return this.tasks.filter(task => task.status === 'To-Do');
  }

  get doingTasks() {
    return this.tasks.filter(task => task.status === 'Doing');
  }

  get doneTasks() {
    return this.tasks.filter(task => task.status === 'Done');
  }

  onSubmit(): void {
    const controls = this.taskForm.controls as { [key: string]: FormControl };

    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        controls[controlName].markAsTouched();
      }
    }
  
    if (!this.taskForm.valid) {
      return;
    }

    const currentDate = new Date();

    const task: Task = {
      id: '',
      name: this.taskForm.value.name || '',
      description: this.taskForm.value.description || '',
      priority: 'Low',
      functionality: this.functionality,
      estimatedExecutionTime: this.taskForm.value.exectime || '',
      status: 'To-Do',
      dateAdded: this.taskService.formatDate(currentDate),
      startDate: '',
      endDate: '',
      assignedUser: this.user
    };

    this.taskService.createTask(task, this.functionalityService.updateFunctionalityStatus.bind(this.functionalityService));
    this.tasks.push(task);
    this.taskForm.reset();
  }

  editTask(id: string): void {
    this.editingTaskId = id;
  }

  stopEditing(): void {
    this.editingTaskId = null;
  }

  submitEditForm(task: Task): void {

    const currentDate = new Date();
    const formattedDate = this.taskService.formatDate(currentDate);
    
    if (task.status === 'Doing' && !task.startDate) {
        task.startDate = formattedDate;
        
    } 
    
    else if (task.status === 'Done' && !task.endDate) {
        task.endDate = formattedDate;
    }

    this.taskService.editTask(task, this.functionalityService.updateFunctionalityStatus.bind(this.functionalityService));
    this.stopEditing();
  }

  deleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id, this.functionalityService.updateFunctionalityStatus.bind(this.functionalityService));
      this.tasks = this.tasks.filter(t => t.id !== id);
    }
  }

  navigateToFunctionalities(): void {
    this.router.navigate([`/${this.functionality.project.id}/functionalities`]);
  }

  navigateToProjects(): void {
    this.router.navigate(['/projects']);
  }

  onDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }

    const task: Task = event.item.data;
    if(event.container.id === 'todoList') {
      task.status = 'To-Do';
    } else if(event.container.id === 'doingList') {
      task.status = 'Doing';
    } else if(event.container.id === 'doneList') {
      task.status = 'Done';
    }
  }

}