import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  authService = inject(AuthService);
  router = inject(Router);

  isLoading = signal(false);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const {email, password} = this.loginForm.value;
      this.isLoading.set(true);
      this.authService.login(email, password).subscribe({
        next: (response) => {
          // Handle successful login
          this.isLoading.set(false);
          this.router.navigate(['/users']);
        },
        error: (error) => {
          // Handle error
          this.isLoading.set(false);
        }
      });
    }
  }
}
