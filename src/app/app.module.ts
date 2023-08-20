import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { MenuLateralComponent } from './components/menu-lateral/menu-lateral.component';
import { LoginComponent } from './components/login/login.component';
import { CityComponent } from './components/city/city.component';
import { RegisterComponent } from './components/register/register.component';
import { MapsComponent } from './components/maps/maps.component';

// import { environment } from '../environments/environment';
// import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
// import { AngularFirestoreModule} from '@angular/fire/compat/firestore';
// import { AngularFireStorageModule } from '@angular/fire/compat/storage';
@NgModule({
  declarations: [
    AppComponent,
    MenuLateralComponent,
    LoginComponent,
    CityComponent,
    RegisterComponent,
    MapsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // AngularFireModule.initializeApp(environment.firebase),
    // AngularFirestoreModule,
    // AngularFireDatabaseModule,
    // AngularFireStorageModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD_lGpJO31TkbmQsT9pJJS6N5RURmovzbk'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
