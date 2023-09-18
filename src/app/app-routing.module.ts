import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MapsComponent } from './components/maps/maps.component';
import { RegisterComponent } from './components/register/register.component';
import { CityComponent } from './components/city/city.component';
import { UserComponent } from './components/user/user.component';
import { CollaboratorComponent } from './components/collaborator/collaborator.component';

const routes: Routes = [
  {path:'login', component: LoginComponent },
  {path: 'maps/:id', component : MapsComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'city', component: CityComponent},
  {path: 'user', component: UserComponent},
  {path: 'collaborator', component: CollaboratorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
