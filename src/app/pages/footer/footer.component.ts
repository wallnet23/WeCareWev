import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { UserState } from '../../ngrx/user/user.reducer';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  constructor(private store: Store<{ user: UserState }>) { }
  lang = 'en';
  ngOnInit(): void {
    this.store.select(state => state.user.userInfo).subscribe(
      (val) => {
        if (val && val.lang_code && val.lang_code.length > 0) {
          this.lang = val.lang_code;
        }
      });
  }
}
