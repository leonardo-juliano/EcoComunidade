import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { MenuLateralComponent } from './components/menu-lateral/menu-lateral.component';
import { LoginComponent } from './components/login/login.component';
import { CityComponent } from './components/city/city.component';
import { RegisterComponent } from './components/register/register.component';
import { MapsComponent } from './components/maps/maps.component';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';


import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule} from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { UserComponent } from './components/user/user.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthService } from './services/auth/auth.service';
import { CollaboratorComponent } from './components/collaborator/collaborator.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuLateralComponent,
    LoginComponent,
    CityComponent,
    RegisterComponent,
    MapsComponent,
    UserComponent,
    CollaboratorComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    ToastrModule.forRoot ( ),
    FormsModule,
    RouterModule,
    AngularFireAuthModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD_lGpJO31TkbmQsT9pJJS6N5RURmovzbk'
    })
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
