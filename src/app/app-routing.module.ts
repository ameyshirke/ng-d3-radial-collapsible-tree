import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CollapsibleRadialTreeComponent} from "./components/collapsible-radial-tree/collapsible-radial-tree.component";


const routes: Routes = [
  { path: 'tree', component: CollapsibleRadialTreeComponent }, // Radial tree page route
  // Add more routes as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
