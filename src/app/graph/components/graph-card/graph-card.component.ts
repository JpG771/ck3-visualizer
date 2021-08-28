import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-graph-card',
  templateUrl: './graph-card.component.html',
  styleUrls: ['./graph-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphCardComponent implements OnInit {
  @Input() header?: string;
  @Input() graphId?: string;

  @ViewChild('container') container: any;

  extended = false;

  constructor(private changeRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  extendView(value: boolean) {
    this.extended = value;
    if (this.graphId) {
      setTimeout(() => {
        const containerRect = this.container.nativeElement.getBoundingClientRect();
        Plotly.relayout(this.graphId, {
          autosize: false,
          width: containerRect.width,
          height: this.extended ? containerRect.height : 450,
          margin: 10,
        });
      }, 300);
    }
  }
}
