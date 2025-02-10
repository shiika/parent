import { CommonModule } from '@angular/common';
import { Component, input, OnChanges, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnChanges {
  user = input<User | null>(null);

  onSubmit = output<{name: string; job: string}>();
  
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      job: ['', Validators.required]
    });
  }

  ngOnChanges(): void {
    this.userForm.reset();
      if (this.user()) {
        this.userForm.setValue({
          name: this.user()?.first_name,
          job: `${this.user()?.first_name} job`
        });
      }
  }

  submit() {
    if (this.userForm.valid) {
      this.onSubmit.emit(this.userForm.value);
    }
  }
}