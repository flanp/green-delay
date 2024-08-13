import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Subject } from 'rxjs';

declare var Tawk_API: any;

@Injectable({
  providedIn: 'root',
})
export class TawkService {
  private loaded: boolean;
  private renderer: Renderer2;
  private loadSubject: Subject<boolean> = new Subject<boolean>();

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private _document: Document
  ) {
    console.log('here');
    this.renderer = rendererFactory.createRenderer(null, null);
    // this.load();
  }

  public updateTawkUser(user: any) {
    this.loadedWrapper(() => {
      this.updateAtrributes(user);
    });
  }

  public setChatVisibility(show: boolean = false) {
    this.loadedWrapper(() =>
      show ? Tawk_API.showWidget() : Tawk_API.hideWidget()
    );
  }

  public load() {
    if (this.loaded) return;

    const s = this.renderer.createElement('script');
    s.type = 'text/javascript';
    s.text = `var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/614e45a5d326717cb683388f/1fgcs03ct';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();`;

    this.renderer.appendChild(this._document.body, s);
    Tawk_API.onLoad = this.loadedEvent.bind(this);
  }

  private loadedEvent() {
    this.loaded = true;
    this.loadSubject.next(this.loaded);
  }

  private loadedWrapper(func: any) {
    if (!this.loaded) {
      var sub = this.loadSubject.asObservable().subscribe({
        next: () => {
          func();
          sub.unsubscribe();
        },
        error: () => {},
      });
    } else {
      func();
    }
  }

  private updateAtrributes(username: string) {
    Tawk_API.setAttributes({ name: username }, function (error) {
      console.log(error);
    });
  }
}
