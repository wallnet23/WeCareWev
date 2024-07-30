import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { IpInfoConnectService } from '../../services/ip-info-connect.service';
import { Store } from '@ngrx/store';
import { UserState } from '../../ngrx/user/user.reducer';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

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
  //language = new FormControl<string>('en');
  selectedLanguage: { code: string, name: string, sign: string, flag: string } = this.languagesList[0];

  constructor(private ipInfoConnectService: IpInfoConnectService, private store: Store<{ user: UserState }>,
    private authService: AuthService, private translateService: TranslateService) {
    this.ipInfoConnectService.setUserLanguageApp((code: string) => this.selectLanguage(code));
    // console.log("Lingua", translateService.currentLang);
    this.getSelectedLanguage();
  }

  /**
   * Seleziona la lingua e la assegna al database se l'utente è loggato
   * @param code valore selezionato dall'utente
   */
  selectLanguage(code: string) {
    this.ipInfoConnectService.setUserLanguageDb(code);
    if (this.authService.isLoggedIn()) {
      this.getSelectedLanguage();
    }
    else {
      this.selectedLanguage = this.languagesList.find(val => val.code == code)!;
    }
  }

  /**
   * Prende La lingua che è stata selezionata oppure quella di default per visualizzarla nel button
   */
  getSelectedLanguage() {
    (this.store.select(state => state.user.userInfo).subscribe(
      (val) => {
        if (val?.lang_code == 'it') {
          this.selectedLanguage = this.languagesList[1];
        }
        else {
          this.selectedLanguage = this.languagesList[0];
        }
      }
    ))
  }

}
