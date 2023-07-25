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
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import routeConfig from './routes';

export function TokenGetter(){
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    HttpClientXsrfModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HomeComponent,
    LoginComponent,
    DetailsComponent,
  
    JwtModule.forRoot({
      config: {
        tokenGetter: TokenGetter,
        allowedDomains: ["localhost:7018"],
        disallowedRoutes: []
      }
    })
  ],
  providers: [HouseService,UserService,provideProtractorTestingSupport(),provideRouter(routeConfig)],
  bootstrap: [AppComponent]
})
export class AppModule { }
