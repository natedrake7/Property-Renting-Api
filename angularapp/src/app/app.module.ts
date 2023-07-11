import { NgModule } from '@angular/core';
import { BrowserModule, provideProtractorTestingSupport } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DetailsComponent } from './components/details/details.component';
import { HouseService } from './services/house.service';
import { UserService } from './services/user.service';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import routeConfig from './routes';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    HttpClientXsrfModule,
    BrowserModule,
    AppRoutingModule,
    HomeComponent,
    LoginComponent,
    DetailsComponent
  ],
  providers: [HouseService,UserService,provideProtractorTestingSupport(),provideRouter(routeConfig)],
  bootstrap: [AppComponent]
})
export class AppModule { }
