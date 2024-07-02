import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-warranty-trial',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './warranty-trial.component.html',
  styleUrl: './warranty-trial.component.scss'
})
export class WarrantyTrialComponent {

  trialText: string = "Richiesta estensione garanzia";

}
