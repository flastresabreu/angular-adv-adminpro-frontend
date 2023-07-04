import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedaService } from 'src/app/services/busqueda.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit {

  public medicos: Medico[];
  public cargando : boolean = true;

  constructor(private medicoService: MedicoService,
             private modalImagenService: ModalImagenService,
             private buscarService: BusquedaService) { }

  ngOnInit(): void {
    this.cargarMedicos();
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicoService.cargarMedicos()
                      .subscribe((resp: any) => {
                        console.log(resp);
                        this.cargando = false
                        this.medicos = resp;
                      });
  }

  eliminarMedico(medico){
    const { _id } = medico;

    Swal.fire({
      title: 'Estas seguro?',
      text: 'Deseas revertir la eliminación!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.eliminarMedico(_id).subscribe((resp) => {
          console.log(result);
          this.cargarMedicos();
        });
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Hospital eliminado correctamente`,
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  }

  abrirModal(medico: Medico){
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }

  // async abrirSweetAlert(){
  //   const {value, isConfirmed} = await Swal.fire<string>({
  //     title: 'Crear Médico',
  //     text: 'Ingrese el nombre del nuevo médico',
  //     input: 'text', 
  //     inputPlaceholder: 'Nombre del médico',
  //     showCancelButton: true
  //   })
  //    console.log(value);
  //  if(value.trim().length > 0){
  //     this.medicoService.crearMedico(value)
  //                       .subscribe(resp => {
  //                         this.cargarMedicos();
  //                         Swal.fire({
  //                           position: 'top-end',
  //                           icon: 'success',
  //                           title: `Hospital creado correctamente`,
  //                           showConfirmButton: false,
  //                           timer: 1500
  //                         })
  //                       })
  //  }
  //  else if(value.length === 0 && isConfirmed){
  //   Swal.fire({
  //     icon: 'error',
  //     title: 'Error...',
  //     text: 'Debe llenar el campo del nombre',
  //   })
  //  }
  // }

  // buscar(termino: string){
  //   this.medicoService.cargarMedicos()
  //     .subscribe((resp: Medico[]) => {
  //       this.medicos = resp.filter(
  //         res => res.nombre.toLocaleLowerCase().includes(termino.toLocaleLowerCase())
  //       )
  //       console.log(this.medicos)
  //     },
  //     err => {
  //       console.log(err)
  //     })
  // }

  buscar(termino: string){
    if(termino.length === 0){
      return this.cargarMedicos();
    }
    this.buscarService.buscarMedicosHospitales('medico', termino)
                      .subscribe(
                        (resp) => {
                          this.medicos = resp;
                        }
                      );
  }

}
