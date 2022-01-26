import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import {ImageService} from "../../services/image.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public menuOpen: boolean = false;
  @Output() public imageLoaded: EventEmitter<void> = new EventEmitter<void>();
  // @ts-ignore
  public vm$: Observable<any>;
  public links: string[] = [
    '/', 'locations', 'contact'
  ];
  public linkDisplay: {[key: string]: string} = {
    '/': 'Home',
    locations: 'Locations',
    contact: 'Contact Us'
  }

  constructor(
    private readonly imageService: ImageService) {
  }

  public ngOnInit(): void {
    this.vm$ = this.imageService.getSafeImage("carealotlogo.svg")
      .pipe(
        tap(() => {
          this.imageLoaded.emit(void 0);
        })
      )
  }

  public toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  public getLinkDisplay(link: string): string {
    return this.linkDisplay[link];
  }
}
