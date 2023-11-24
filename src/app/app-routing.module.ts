import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MapsComponent } from './components/maps/maps.component';
import { RegisterComponent } from './components/register/register.component';
import { CityComponent } from './components/city/city.component';
import { UserComponent } from './components/user/user.component';
import { CollaboratorComponent } from './components/collaborator/collaborator.component';
import { PublicAreaComponent } from './components/public-area/public-area.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProblemsComponent } from './components/problems/problems.component';
import { SocialComponent } from './components/social/social.component';
import { AboutComponent } from './components/about/about.component';
import { ResolvedComponent } from './components/resolved/resolved.component';
import { LojaComponent } from './components/loja/loja.component';


const routes: Routes = [
  {path:'login', component: LoginComponent },
  {path: 'maps/:id', component : MapsComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'city', component: CityComponent},
  {path: 'user', component: UserComponent},
  {path: 'collaborator', component: CollaboratorComponent},
  {path: 'public_area', component: PublicAreaComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'profile', component: ProfileComponent},
  {path: 'problems', component: ProblemsComponent},
  {path: 'social', component: SocialComponent},
  {path: 'detalhes/:id', component: ProblemsComponent},
  {path: 'sobre', component: AboutComponent},
  {path: 'resolvidos', component: ResolvedComponent},
  {path: 'loja', component: LojaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
