import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/user.model';
import { UserFormComponent } from './user-form/user-form.component';

@Component({
  selector: 'app-users',
  imports: [UserFormComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users = signal<User[]>([]);
  currentPage = signal(1);
  perPage = signal(0);
  totalItems = signal(0);
  totalPages = signal(0);
  isLoading = signal(false);

  isShowingForm = signal(false);
  editingUser = signal<User | null>(null);

  userService = inject(UserService);

  // Computed signal to check if more pages are available
  hasMorePages = computed(() => this.currentPage() < this.totalPages());

  constructor() {
    // Effect to load users when page changes
    effect(() => {
      this.loadUsers();
    });
  }

  ngOnInit(): void {
    // Initial load is handled by the effect
  }

  editUser(user: User) {
    this.editingUser.set(user);
    this.isShowingForm.set(true);
  }

  deleteUser(id: number) {
    this.userService.deleteUser(`${id}`).subscribe({
      next: () => {
        this.users.update(users => users.filter(user => user.id !== id));
      },
      error: (error) => {
        console.error('Error deleting user:', error);
      }
    });
  }

  submitUser(value: {name: string; job: string}) {
    if (this.editingUser()) {
      // Handle edit
      // const userToUpdate = this.editingUser();
      const id = this.editingUser()?.id;
      if (id) {
        this.userService.updateUser(`${id}`, value).subscribe({
          next: (updatedUser) => {
            this.users.update(users => 
              users.map(user => user.id === updatedUser.id ? updatedUser : user)
            );
            this.isShowingForm.set(false);
            this.editingUser.set(null);
          },
          error: (error) => {
            console.error('Error updating user:', error);
          }
        });
      }
    } else {
      // Handle create
      this.userService.addUser(value).subscribe({
        next: (newUser) => {
          this.users.update(users => [{first_name: newUser.name, last_name: "", email: "some email", id: 100, avatar: ""}, ...users]);
          this.isShowingForm.set(false);
          this.editingUser.set(null);
        },
        error: (error) => {
          console.error('Error creating user:', error);
        }
      });
    }
  }

  showAddUserForm() {
    this.isShowingForm.set(true);
  }

  loadUsers(): void {
    this.userService.getUsers(this.currentPage()).subscribe({
      next: (response) => {
        // If it's the first page, set the users directly
        // If it's a subsequent page, append the new users
        if (this.currentPage() === 1) {
          this.users.set(response.data);
        } else {
          this.users.update(currentUsers => [...currentUsers, ...response.data]);
        }
        
        // Update pagination information
        this.perPage.set(response.per_page);
        this.totalItems.set(response.total);
        this.totalPages.set(response.total_pages);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  loadMore(): void {
    this.isLoading.set(true);
    if (this.hasMorePages()) {
      this.currentPage.update(page => page + 1);
    }
  }
}
