import {Component, ElementRef, OnInit, ViewChild, Input} from '@angular/core';
import {environment} from '@environment';
import {UriBuilder} from '../../../data-provider';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';


@Component({
  selector: 'bla-bogenkontrollliste-download',
  templateUrl: './bogenkontrollliste-download.component.html'
})
export class BogenkontrolllisteDownloadComponent implements OnInit {

  public ActionButtonColors = ActionButtonColors;

  // Get the value of the attribute from the html tag
  @Input()
  wettkampfid: number;

  @ViewChild('downloadLink')
  private aElementRef: ElementRef;

  constructor() {}

  ngOnInit() {}

  public getDownloadUrl(path: string): string {
    return new UriBuilder()
      .fromPath(environment.backendBaseUrl)
      .path('v1/download')
      .path(path)
      .path('?wettkampfid=' + this.wettkampfid)
      .build();
  }
}
