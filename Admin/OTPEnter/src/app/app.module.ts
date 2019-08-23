import { NgModule,ChangeDetectorRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule , HTTP_INTERCEPTORS} from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TokenInterceptor } from './token.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, ReactiveFormsModule],
  providers: [
    StatusBar,
    SplashScreen,
    QRScanner,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    } 
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
