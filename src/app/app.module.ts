import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuLateralComponent } from './components/menu-lateral/menu-lateral.component';
import { LoginComponent } from './components/login/login.component';
import { CityComponent } from './components/city/city.component';
import { RegisterComponent } from './components/register/register.component';
import { MapsComponent } from './components/maps/maps.component';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule} from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { UserComponent } from './components/user/user.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthService } from './services/auth/auth.service';
import { CollaboratorComponent } from './components/collaborator/collaborator.component';
import { WebcamModule } from 'ngx-webcam';
import { PublicAreaComponent } from './components/public-area/public-area.component';
import { ProfileComponent } from './components/profile/profile.component';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { ProblemsComponent } from './components/problems/problems.component';
import {MatCardModule} from '@angular/material/card';
import { SocialComponent } from './components/social/social.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ProblemDetailsComponent } from './components/problem-details/problem-details.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AboutComponent } from './components/about/about.component';
import { ResolvedComponent } from './components/resolved/resolved.component';
import { LojaComponent } from './components/loja/loja.component';







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
    PublicAreaComponent,
    ProfileComponent,
    ProblemsComponent,
    SocialComponent,
    ProblemDetailsComponent,
    AboutComponent,
    ResolvedComponent,
    LojaComponent,
    
  ],
  imports: [
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule,
    BrowserAnimationsModule,
    NgMultiSelectDropDownModule.forRoot(),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    ToastrModule.forRoot ( ),
    MatButtonModule,
    ReactiveFormsModule,
    WebcamModule,
    RouterModule,
    MatStepperModule,
    AngularFireAuthModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatCheckboxModule,
    
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
