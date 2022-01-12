import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { ButtonModule, USER_DETAILS, UserDetails } from '@wfh/ui';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'wfh-profile',
  template: `
    <section *ngIf="user$ | async as user">
      <img [src]="user.avatar" class="rounded-md    " [alt]="user.firstName" />
    </section>
    <section class="mt-10">
      <form class="max-w-xl" [formGroup]="userForm">
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input class="w-full" type="text" id="firstName" formControlName="firstName" />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input class="w-full" type="text" id="lastName" formControlName="lastName" />
          </div>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input class="w-full" type="email" id="email" formControlName="email" readonly />
        </div>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-4 group-validation"
          formGroupName="passwords"
        >
          <div class="form-group max-w-xs">
            <label for="currentPassword">Current Password</label>
            <input
              class="w-full"
              type="password"
              [style.paddingRight.rem]="2"
              id="currentPassword"
              formControlName="current"
              passwordToggle
            />
          </div>
          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input
              [style.paddingRight.rem]="2"
              class="w-full"
              type="password"
              id="newPassword"
              formControlName="new"
              passwordToggle
            />
          </div>
        </div>

        <footer class="flex gap-4 mt-6">
          <button wfh type="submit" [disabled]="true" form="userForm" variant="primary">
            Update
          </button>
          <button wfh type="button" variant="neutral" [disabled]="true">Cancel</button>
        </footer>
      </form>
    </section>
  `,
  styles: [
    `
      :host {
        @apply block mx-auto max-w-screen-2xl px-4 md:px-6;
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  userForm!: FormGroup;

  constructor(
    @Inject(USER_DETAILS) public readonly user$: Observable<UserDetails>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
    this.user$.subscribe((user) => {
      this.userForm.patchValue(user);
    });
  }

  private initForm() {
    this.userForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      passwords: this.fb.group({
        current: [''],
        new: [''],
      }),
    });
  }
}

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ProfileComponent }]),
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class ProfileModule {}
