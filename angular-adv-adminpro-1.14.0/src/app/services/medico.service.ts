import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  get token(){
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers : {
        'x-token': this.token
      }
    }
  }

  constructor(private http: HttpClient) { }

  cargarMedicos(): Observable<Medico[]>{
    return this.http.get(`${base_url}/medicos`, this.headers)
                    .pipe(map((resp: {ok: boolean, medicos: Medico[]}) => resp.medicos))
  }

  cargarMedicoById(id: string){
    return this.http.get(`${base_url}/medicos/${id}`, this.headers)
                    .pipe( map((resp: {ok:boolean, medico: Medico}) => resp.medico
                      ));
  }

  eliminarMedico(_id: string){
    return this.http.delete(`${base_url}/medicos/${_id}`, this.headers);
  }

  crearMedico(medico: {nombre: string, hospital: string}){
    return this.http.post(`${base_url}/medicos`, medico , this.headers);
  }

  actualizarMedico(medico: Medico){
    return this.http.put(`${base_url}/medicos/${medico._id}`, medico, this.headers);
  }
}
