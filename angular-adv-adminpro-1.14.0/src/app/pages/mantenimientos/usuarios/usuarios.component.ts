import { Component, OnDestroy, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import {BusquedaService} from 'src/app/services/busqueda.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuarioTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando = true;
  public imgSubs: Subscription;

  constructor(private usuarioService: UsuarioService,
              private busquedaService: BusquedaService,
              private modalImagenService: ModalImagenService) { }
 

  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs = this.modalImagenService.nuevaImagen
            .pipe(delay(1500))
            .subscribe(img => this.cargarUsuarios());
  }

  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe(({total, usuarios}) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuarioTemp = usuarios;
        this.cargando = false;
      })
  }

  cambiarPagina(valor: number){
    this.desde += valor;
    if(this.desde < 0){
      this.desde = 0;
    }
    else if(this.desde >= this.totalUsuarios){
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar(termino: string){

    if(termino.length === 0){
      return this.usuarios = this.usuarioTemp;
    }



    this.busquedaService.buscar('usuario', termino)
                        .subscribe((resp:any[]) => {
                          console.log(resp);
                        })
    
  }

  eliminarUsuario(usuario: Usuario){

    if(usuario.uid === this.usuarioService.uid){
      return Swal.fire('Error', 'No se puede borrar asi mismo', 'error');
    }

    Swal.fire({
      title: 'Borrar usuario?',
      text: `Esta a punto de borrar usuario ${usuario.nombre}`,//"You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario)
                            .subscribe(resp => 
                              {
                                Swal.fire(
                                  'Usuario borrado',
                                  `${usuario.nombre} fue eliminado correctamente`,
                                  'success'
                                )
                                this.cargarUsuarios();
                              }
                              );

      }
    })
  }

  cambiarRole(usuario: Usuario){
    this.usuarioService.guardarUsuario(usuario)
                        .subscribe(resp => {
                          console.log(resp);
                        })
  }

  abrirModal(usuario: Usuario){
    console.log(usuario);
    const {uid, img} = usuario;
    this.modalImagenService.abrirModal('usuarios', uid, img);
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  
}
