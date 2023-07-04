import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, pipe } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospitales.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css'],
})
export class MedicoComponent implements OnInit {
  public medicoForm!: FormGroup;
  public hospitales$: Observable<Hospital[]>;
  public editarMedico: boolean = false;
  public medicoSeleccionado: Medico;
  public id: any;

  constructor(
    public fb: FormBuilder,
    public hospitalService: HospitalService,
    public medicoService: MedicoService,
    public router: Router,
    public activatedRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.activatedRouter.params
    .subscribe(({id}) => {
      this.obtenerMedicoById(id);
      this.id = id;
    });

    this.hospitales$ = this.hospitalService.cargarHospitales();
                                           

    this.cargarMedico();
  }

  cargarMedico() {
    
      this.medicoForm = this.fb.group({
        nombre: ['', [Validators.required]],
        hospital: [this.hospitales$, [Validators.required]],
      });
    
  }

  obtenerMedicoById(id: string) {
    this.medicoService
      .cargarMedicoById(id)
      .subscribe(medico => {
        const {nombre, hospital} = medico;
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({nombre, hospital});
      });
  }

  guardarCambios() {
    
    if(this.medicoSeleccionado){
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico(data)
                        .subscribe(resp => {
                          Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'El médico ha sido actualizado satisfactoriamente',
                            showConfirmButton: false,
                            timer: 1500,
                          });
                        })
    }
    else{
      this.medicoService
      .crearMedico(this.medicoForm.value)
      .subscribe((resp: any) => {
        console.log(resp);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'El médico ha sido guardado satisfactoriamente',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigateByUrl(`/dashboard/medicos/${resp.medico._id}`);
      });
    }
    
  }
}
