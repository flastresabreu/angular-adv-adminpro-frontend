import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipos: 'usuarios'|'medicos'|'hospitales'): string {
    if(!img){
      return `${base_url}/upload/usuarios/no-image`;
    }
    else if(img.includes('https')){
      return img;
    }
  //http://localhost:3000/api/upload/usuarios/127a76e0-f613-44ee-9edc-700ba7554aa0.jpg
    else if(img){
      return `${base_url}/upload/${tipos}/${img}`;
    }
    else{
      return `${base_url}/upload/usuarios/no-image`;
    }       
  }

}
