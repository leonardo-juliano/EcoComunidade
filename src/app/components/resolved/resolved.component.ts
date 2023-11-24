import { Component, OnInit } from '@angular/core';
import { ProblemsService } from '../../services/problems/problems.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { MapService } from 'src/app/services/map/map.service';


declare const $: any;
@Component({
  selector: 'app-resolved',
  templateUrl: './resolved.component.html',
  styleUrls: ['./resolved.component.css']
})
export class ResolvedComponent implements OnInit {

  problemsDetails = [];
  imageUrlShow: string;
  imageUrl = '';

  constructor(
    public problemsService: ProblemsService,
    private afAuth: AngularFireAuth,
    private profileService: ProfileService,
    private mapsservice: MapService,
  ) { }

  ngOnInit() {
    this.problemsService.getProblemsResolved().subscribe((problems) => {
      this.problemsDetails = problems;
    });
  }

  resolvedDetails(id) {
    this.imageUrl = '';
    this.imageUrlShow = '';
    this.problemsService.getProblemById(id).subscribe(async (problem) => {
      $('#problemResolved').val(problem.Register_problem);
      $('#localResolved').val(problem.green_area);
      $('#descriptionResolved').val(problem.descriptionResolved);
      this.profileService.buscarUsuarioPorEmail(problem.userResolved)
        .subscribe(data => {
          $('#nameResolved').val(data[0].name);
        });
        this.imageUrl = problem.imageResolved;
        this.imageUrlShow = await this.mapsservice.getImageUrl('gs://eco-comunidade.appspot.com/images/' + this.imageUrl);     
    }
    );
  }

  problemDetails(id) {
    this.problemsService.getProblemById(id).subscribe( async (problem) => {
      $('#problem').val(problem.Register_problem);
      $('#local').val(problem.green_area);
      $('#description').val(problem.description);
      this.profileService.buscarUsuarioPorEmail(problem.user)
      .subscribe(data => {
        $('#nameUser').val(data[0].name);
      });
      this.imageUrl = problem.image;
      this.imageUrlShow = await this.mapsservice.getImageUrl('gs://eco-comunidade.appspot.com/images/' + this.imageUrl);     
    }
    );
  }

}
