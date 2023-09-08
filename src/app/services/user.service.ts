import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private localStorageKey = 'user';

  constructor() {
    this.initUser();
  }

  private initUser() {
    if (!localStorage.getItem(this.localStorageKey)) {
      const user: User = new User();
      user.id = '1';
      user.login = 'johndoe';
      user.password = 'johndoe123';
      user.name = 'John';
      user.lastName = 'Doe';
      this.setUser(user);
    }
  }

  getUser(): User {
    const userJson = localStorage.getItem(this.localStorageKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  setUser(user: User) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(user));
  }
}