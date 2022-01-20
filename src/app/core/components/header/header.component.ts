import {Component, OnInit} from '@angular/core';
import {from, map, Observable, switchMap} from "rxjs";
import {ref, getDownloadURL} from "firebase/storage";
import {storage} from "../../../app.module";
import {ImageService} from "../../services/image.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public menuOpen: boolean = false;
  // @ts-ignore
  public vm$: Observable<any>;

  constructor(
    private readonly imageService: ImageService) {
  }

  public ngOnInit(): void {
    this.vm$ = this.imageService.getSafeImage("Method Draw Image.png")
  }

  public toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
