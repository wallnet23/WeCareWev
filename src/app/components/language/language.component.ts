import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { IpInfoConnectService } from '../../services/ip-info-connect.service';

@Component({
  selector: 'app-language',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule
  ],
  templateUrl: './language.component.html',
  styleUrl: './language.component.scss'
})
export class LanguageComponent {

  // languagesList: {code: string, name: string, flag: string}[] = [
  //   {code: 'en', name: 'EN', flag: 'en.png'},
  //   {code: 'it', name: 'IT', flag: 'it.png'}
  // ]
  languagesList: { code: string, name: string, sign: string, flag: string }[] = this.ipInfoConnectService.languagesList;
  language = new FormControl<string>('en');

  constructor(private ipInfoConnectService: IpInfoConnectService) {
    this.ipInfoConnectService.setUserLanguageApp();
  }

  selectLanguage(code: string) {
    this.ipInfoConnectService.setUserLanguageDb(code);
  }

  getSelectedLanguage() {
    return this.languagesList.find(lang => lang.code === this.language.value);
  }

}
