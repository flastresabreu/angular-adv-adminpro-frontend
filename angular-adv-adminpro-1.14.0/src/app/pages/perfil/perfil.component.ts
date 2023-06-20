import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit, OnChanges {

  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imagenTemp : any;

  constructor(public fb: FormBuilder, 
              public usuarioservice: UsuarioService,
              public fileUploadService: FileUploadService
              ) { 
                this.usuario = usuarioservice.usuario;
              }

  ngOnChanges(changes: SimpleChanges): void {
    this.actualizarPerfil();
  }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, [Validators.required]],
      email: [this.usuario.email, [Validators.required, Validators.email]]
    })

  }

  actualizarPerfil(){
    // console.log(this.perfilForm.value);
    this.usuarioservice.actualizarPerfil(this.perfilForm.value).subscribe(
      resp => {
        const { nombre, email} = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;

        Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
      },
      err => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    )
  }

  cambiarImagen(file: File){

    if(!file){
      return this.imagenTemp = null;
    }
    
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log(reader.result);
        this.imagenTemp = reader.result;
      }    

    this.imagenSubir = file;
  }

  subirImagen(){
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
      .then(img => {
        this.usuario.img = img;
        Swal.fire('Guardado', 'Imagen guardada satisfactoriamente', 'success');
      }).catch(err => {
        Swal.fire('Error', 'No se pudo guardar la imagen', 'error');
      });
  }

}
