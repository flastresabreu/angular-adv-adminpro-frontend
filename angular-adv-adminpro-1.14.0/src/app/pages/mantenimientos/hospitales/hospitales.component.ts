import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospitales.model';
import Swal from 'sweetalert2';
import { BusquedaService } from 'src/app/services/busqueda.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit {

  public hospitales: Hospital[] = [];
  public hospitaleTemp: Hospital[] = [];
  public cargando: boolean = true;

  constructor(public hospitalService: HospitalService,
              public buscarService: BusquedaService) { }

  ngOnInit(): void {
    this.cargarHospitales();
  }

  cargarHospitales(){
    this.cargando = true;
    this.hospitalService.cargarHospitales()
                        .subscribe((resp: Hospital[]) => {
                          console.log(resp);
                          this.cargando = false;
                          this.hospitales = resp;
                        });
  }

  crearHospital(){
  }

  guardarCambios(hospital: Hospital){
    const {_id, nombre} = hospital;
    this.hospitalService.actualizarHospital(_id, nombre)
                        .subscribe(resp => {
                          Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: `Hospital ${nombre} actualizado correctamente`,
                            showConfirmButton: false,
                            timer: 1500
                          })
                        })
  }

  eliminarHospital(hospital){
    const { _id } = hospital;

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
        this.hospitalService.borrarHospital(_id).subscribe((resp) => {
          console.log(result);
          this.cargarHospitales();
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

  async abrirSweetAlert(){
    const {value, isConfirmed} = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    })
    // console.log(valor);
   if(value.trim().length > 0){
      this.hospitalService.crearHospital(value)
                        .subscribe(resp => {
                          this.cargarHospitales();
                          Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: `Hospital creado correctamente`,
                            showConfirmButton: false,
                            timer: 1500
                          })
                        })
   }
   else if(value.length === 0 && isConfirmed){
    Swal.fire({
      icon: 'error',
      title: 'Error...',
      text: 'Debe llenar el campo del nombre',
    })
   }
  }

  // buscarHospitales(termino: string){
  //   this.hospitalService.cargarHospitales()
  //                       .subscribe((resp: Hospital[]) => {
  //                         this.hospitales = resp.filter(res => res.nombre.toLocaleLowerCase().includes(termino.toLocaleLowerCase()))
  //                       },
  //                       error => {
  //                         console.log(error)
  //                       })
  // }

  buscar(termino: string){
    if(termino.length === 0){
      return this.cargarHospitales();
    }
    this.buscarService.buscarMedicosHospitales('hospital', termino)
                      .subscribe((resp) => {
                        this.hospitales = resp
                      })
  }
}
