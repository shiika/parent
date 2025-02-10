import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../../environments/environment';
import { UserResponse } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    http = inject(HttpClient);
    apiUrl = env.apiUrl;

    getUsers(page: number = 1): Observable<UserResponse> {
        return this.http.get<UserResponse>(`${this.apiUrl}/users`, {
            params: {
                page: page.toString()
            }
        });
    }

    getUserDetails(userId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/users/${userId}`);
    }

    addUser(data: { name: string; job: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/users`, data);
    }

    updateUser(userId: string, data: { name: string; job: string }): Observable<any> {
        return this.http.put(`${this.apiUrl}/users/${userId}`, data);
    }

    deleteUser(userId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/users/${userId}`);
    }
}