import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  
  constructor(
    private userService: UserService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private ref: DynamicDialogRef) {}

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      newPasswordConfirmation: ['', Validators.required]
    });
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      this.userService.changePassword(
        this.changePasswordForm.controls.oldPassword.value,
        this.changePasswordForm.controls.newPassword.value,
        this.changePasswordForm.controls.newPasswordConfirmation.value).subscribe(_ => {
          this.toastService.addSingle('success', '', 'Palavra-passe alterada com sucesso');
          this.ref.close();
        });
    }
  }
}