import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageComponent } from "../../../components/language/language.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    LanguageComponent,
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  valid: boolean = true;
  toggled: boolean = true;
  type: string = 'password'

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  constructor(private router: Router,
     private authService: AuthService) { }

     ngOnInit(): void {
     }

  async login() {
    // try {
    await this.authService.loginUser(
      this.loginForm.get('email')?.value!,
      this.loginForm.get('password')?.value!);
    if (this.authService.getToken() != null) {
      this.router.navigate(['/systemsList']);
    }
    // } catch (error) {
    //   console.error('Login failed', error);
    // }
  }

  seePassword() {
    if (this.type === 'password') {
      this.type = 'text';
      this.toggled = false;
    }
    else {
      this.type = 'password';
      this.toggled = true;
    }
  }

}

