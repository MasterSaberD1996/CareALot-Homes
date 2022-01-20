import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {from, map, Observable, switchMap} from "rxjs";
import {getDownloadURL, ref} from "firebase/storage";
import {storage} from "../../app.module";

@Injectable({providedIn: 'root'})
export class ImageService {
  constructor(
    private readonly http: HttpClient,
    private readonly sanitizer: DomSanitizer
  ) {}

  public getSafeImage(imageLocation: string): Observable<SafeUrl> {
    const pathReference = ref(storage, imageLocation);
    return from(getDownloadURL(pathReference))
      .pipe(
        switchMap((url) => {
          return this.http.get(url, {
            responseType: "blob",
          })
        }),
        map((blob: any) => {
          const objectUrl = URL.createObjectURL(blob);
          return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        })
      )
  }
}
