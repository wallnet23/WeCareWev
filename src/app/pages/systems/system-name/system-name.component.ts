import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'app-system-name',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './system-name.component.html',
  styleUrl: './system-name.component.scss'
})
export class SystemNameComponent {

  isValid: boolean = true;

  systemInfoFormGroup = this.formBuilder.group({
    name: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string>('')
  })

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  send() {
    //SAVE THE FORM 
    this.router.navigate(['/systemOverview', this.systemInfoFormGroup.get('name')?.value]);
  }
}
