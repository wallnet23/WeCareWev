import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { InViewportDirective } from '../../../directives/in-viewport.directive';
import { TicketTableComponent } from "./components/ticket-table/ticket-table.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    TranslateModule,
    InViewportDirective,
    TicketTableComponent
  ],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss'
})
export class TicketListComponent {

  @Input() idsystem: number = 0;
  isSmall: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.updateWindowDimensions();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if (window.innerWidth < 768) {
      this.isSmall = true;
    }
    else {
      this.isSmall = false;
    }
  }

  newTicket() {
    this.router.navigate(['ticketNew'], { queryParams: { idsystem: this.idsystem } })
  }

}
