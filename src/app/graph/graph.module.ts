import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { GraphRoutingModule } from './graph-routing.module';
import { GraphComponent } from './components/graph/graph.component';

@NgModule({
  declarations: [GraphComponent],
  imports: [CommonModule, GraphRoutingModule, MatCardModule],
})
export class GraphModule {}
