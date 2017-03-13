import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {ShowAllPage} from "../pages/show-all/show-all";
import {FullScreenPage} from "../pages/full-screen/full-screen";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ShowAllPage,
    FullScreenPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ShowAllPage,
    FullScreenPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
