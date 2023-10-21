import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user = '';

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    private afAuth: AngularFireAuth,
  ) { }

  async ngOnInit() {
    await this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user.email
      }
    });
    this.getUser();
  }

  getUser() {
    console.log('user',this.user)
    this.profileService.buscarUsuarioPorEmail(this.user)
      .subscribe(data => {
        console.log('detalhes user',data);
      });
  }
}
