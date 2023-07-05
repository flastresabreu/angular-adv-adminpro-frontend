import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators'
import { Usuario } from '../models/usuario.model';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

  get token():string{
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      } 
    }
  }


  constructor(private http: HttpClient) { }

  private transformarUsuarios(resultados: any[]): Usuario[]{
    return resultados.map(usuario => new Usuario(usuario.nombre, usuario.email, '', usuario.img, usuario.google, usuario.role, usuario.uid))
  }

  private transformarMedico(resultados: any[]){
    return resultados;
  }

  private transformarHospitales(resultados: any[]){
    return resultados;
  }

  busquedaGlobal(termino: string){

    const url = `${base_url}/todo/${termino}`;
    return this.http.get<any[]>(url, this.headers)
  }

  buscar(
    tipos: 'usuario'|'medicos'|'hospitales',
    termino: string
  ){
    const url = `${base_url}/todo/coleccion/${tipos}/${termino}`;
    return this.http.get<any[]>(url, this.headers)
                .pipe(
                    map((resp: any) => {
                      if(resp.length === 0){
                        return {'msg': 'Nohau resultados'}
                      }
                    }),
                    map((resp:any) => {
                      switch(tipos){
                        case 'usuario':
                          return this.transformarUsuarios(resp.resultados)

                        default: 
                          return[];  
                      }
                    })
                  );
  }

  buscarMedicosHospitales(
    tipos: 'medico'|'hospital',
    termino: string){
      const url = `${base_url}/todo/coleccion/${tipos}/${termino}`;
      return this.http.get<{ok: boolean, ressultado: any[]}>(url, this.headers)
                .pipe(map((resp: any) => {
                    switch(tipos){
                      case 'medico':
                        return this.transformarMedico(resp.resultado)
                      
                      case 'hospital':
                        return  this.transformarHospitales(resp.resultado)

                      default: 
                        return [];  
                    }
                }))
    }
}
