import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CollapsibleRadialTreeComponent } from './components/collapsible-radial-tree/collapsible-radial-tree.component';
import {CollapsibleRadialTreeModule} from "./components/collapsible-radial-tree/collapsible-radial-tree.module";

@NgModule({
  declarations: [
    AppComponent,
    CollapsibleRadialTreeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
