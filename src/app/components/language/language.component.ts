import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { IpInfoConnectService } from '../../services/ip-info-connect.service';
import { Store } from '@ngrx/store';
import { UserState } from '../../ngrx/user/user.reducer';
import { AuthService } from '../../services/auth.service';

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

  languagesList: { code: string, name: string, sign: string, flag: string }[] = this.ipInfoConnectService.languagesList;
  selectedLanguage: { code: string, name: string, sign: string, flag: string } = this.languagesList[0];
  @Output() lang = new EventEmitter<string>();

  constructor(private ipInfoConnectService: IpInfoConnectService, private store: Store<{ user: UserState }>,
    private authService: AuthService) {
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
      this.lang.emit(this.selectedLanguage.code);
    }
  }

  /**
   * Prende La lingua che è stata selezionata oppure quella di default per visualizzarla nel button
   */
  private getSelectedLanguage() {
    (this.store.select(state => state.user.userInfo).subscribe(
      (val) => {
        if (val?.lang_code == 'it') {
          this.selectedLanguage = this.languagesList[1];
          this.lang.emit(this.languagesList[1].code);
        }
        else {
          this.selectedLanguage = this.languagesList[0];
          this.lang.emit(this.languagesList[0].code);

        }
      }
    ))
  }

}
