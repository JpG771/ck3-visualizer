import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { GraphRoutingModule } from './graph-routing.module';
import { GraphComponent } from './components/graph/graph.component';
import { GraphCardComponent } from './components/graph-card/graph-card.component';

@NgModule({
  declarations: [GraphComponent, GraphCardComponent],
  imports: [
    CommonModule,
    GraphRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
})
export class GraphModule {}
