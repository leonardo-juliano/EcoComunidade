import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProblemsService } from '../../services/problems/problems.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MapService } from 'src/app/services/map/map.service';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { AngularFireStorage } from '@angular/fire/storage';
import { Toast } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProfileService } from 'src/app/services/profile/profile.service';


declare const $: any;

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-problems',
  templateUrl: './problems.component.html',
  styleUrls: ['./problems.component.css']
})
export class ProblemsComponent implements OnInit {
  problemsDetails = [];
  displayedColumns: string[] = ['type', 'local', 'urgente', 'status', 'date', 'image', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>(); // Não precisa passar nada aqui
  show_details = false;
  problem: '';
  description: string;
  status: string;
  type: string;
  date: string;
  urgent: string;
  green_area: string;
  imageUrlShow: string;
  imageUrl = '';
  selectedImage: File | null = null;
  idProblem = '';
  lat = '';
  long = '';
  user = '';
  problemsDetails2 = [];

  statusProblem = [
    { 'id': '1', 'name': 'EM ANDAMENTO' },
    { 'id': '2', 'name': 'PARADO' },
    { 'id': '3', 'name': 'NÃO RESOLVIDO' }
  ]

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    private problemsService: ProblemsService,
    public dialog: MatDialog,
    private mapsservice: MapService,
    private storage: AngularFireStorage,
    private toastr: ToastrService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private profileService: ProfileService
    ) {}

  ngOnInit() {
    this.problemsService.getProblems().subscribe((problems) => {
      this.problemsDetails = problems;
      this.dataSource.data = problems; 
    });    
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user.email
      }
    });
    this.problemsService.getProblems().subscribe((problems) => {
      this.problemsDetails2 = problems;
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];  
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  
      if (allowedTypes.includes(file.type)) {
        this.selectedImage = file;
        this.uploadImage(); 
      } else {
        console.error('Tipo de arquivo não suportado. Selecione uma imagem.');
      }
    }
  }

  uploadImage(): void {
    if (this.selectedImage) {
      const filePath = `/images/${this.selectedImage.name}`;
      const fileRef = this.storage.ref(filePath);
  
      this.storage.upload(filePath, this.selectedImage)
        .then(() => {
          console.log('Imagem enviada com sucesso!');
        })
        .catch(error => {
          console.error('Erro ao enviar imagem:', error.message);
        });
    } else {
      console.error('Nenhuma imagem selecionada.');
    }
  }

  end_details() {
    this.show_details = false;
  }

   viewDetails(problem){
    this.idProblem = problem;
     this.problemsService.getProblemById(problem).subscribe(async (problems) => {
      $('#problem').val(problems.Register_problem);
      $('#description').val(problems.description);
      $('#status').val(problems.status);
      $('#date').val(problems.date);
      $('#green_area').val(problems.green_area ? problems.green_area : "Não informado");
      this.lat = problems.lat;
      this.long = problems.long;
      if(problems.urgent == true){
        this.urgent = "Sim";
        $('#urgent').val('Sim');
      }else{
        $('#urgent').val('Não');
      }
      this.imageUrl = problems.image;
      this.imageUrlShow = await this.mapsservice.getImageUrl('gs://eco-comunidade.appspot.com/images/' + this.imageUrl);
      
  });
  try {
    
  } catch (error) {
    console.log(error);
  }

  this.show_details = true;
  }

  resolvedProblem(){
     const data = {
      status: 'Resolvido',
      imageResolved: this.selectedImage,
      dateResolved: new Date().toLocaleDateString(),
      descriptionResolved: $('#descriptionResolved').val(),
      active: 2,
      userResolved: this.user
     }
     try {
      this.problemsService.updateProblem(this.idProblem, data);
      this.toastr.success( 'Você colaborou com a comunidade!', 'Obrigado !');
      this.profileService.addPoints(this.user, 10);
      this.toastr.success('+10 pontos', 'Parabéns!');
    }catch(error){
       console.log(error);
       this.toastr.warning( 'Algo deu errado, tente novamente!','Ops !',);

     }

   }

   changeStatus(){
     const data = {
      status: $('#status_problem').val(),
      imageResolved: this.selectedImage,
      descriptionResolved: $('#descriptionStatus').val(),
     }
     try {
      this.problemsService.updateProblem(this.idProblem, data);
      this.toastr.success( 'Status alterado !', 'Obrigado pelo feedback !');
      this.profileService.addPoints(this.user, 3);
      this.toastr.success('+3 pontos', 'Parabéns!');
    }catch(error){
       console.log(error);
       this.toastr.warning( 'Algo deu errado, tente novamente!','Ops !',);

     }

   }

   redirectMaps(){
    this.router.navigate(['maps', this.lat + "," + this.long]);
   }

   problemDetails(id) {
    this.problemsService.getProblemById(id).subscribe( async (problem) => {
      this.idProblem = problem.id;
      $('#problem').val(problem.Register_problem);
      $('#local').val(problem.green_area);
      $('#description').val(problem.description);
      $('#status').val(problem.status);
      $('#urgent').val(problem.urgent ? 'Sim' : 'Não');
      this.lat = problem.lat;
      this.long = problem.long;
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


