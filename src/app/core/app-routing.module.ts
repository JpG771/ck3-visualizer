import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReadFileComponent } from './components/read-file/read-file.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'file/import', redirectTo: 'file/read' },
  { path: 'file/read', component: ReadFileComponent },
  { path: 'graph', loadChildren: () => import('../graph/graph.module').then(m => m.GraphModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
