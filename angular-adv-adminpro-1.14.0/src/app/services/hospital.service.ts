import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { delay, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Hospital } from '../models/hospitales.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})

export class HospitalService {

  get token(){
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers:{
        'x-token': this.token
      }
    }
  }

  constructor(public http: HttpClient) { }

  //http://localhost:3000/api/hospitales
  cargarHospitales(): Observable<Hospital[]>{
    return this.http.get<Hospital[]>(`${base_url}/hospitales`, this.headers)
                    .pipe(
                      map((resp: any) => resp.hospitales)
                    );
  }

  crearHospital(nombre: string): Observable<any>{
    return this.http.post<any>(`${base_url}/hospitales`, {nombre}, this.headers);
  }

  actualizarHospital(_id: string, nombre: string): Observable<any>{
    return this.http.put<any>(`${base_url}/hospitales/${_id}`, {nombre}, this.headers);
  }

  borrarHospital(_id: string): Observable<any>{
    return this.http.delete<any>(`${base_url}/hospitales/${_id}`, this.headers);
  }

  

  // cargarHospitales(){
  //   const url = `${base_url}/hospitales`;
  //   return this.http.get(url, this.headers)
  //               .pipe(
  //                 map((resp: any) => {
  //                   const hospitales = resp.hospitales.map(
  //                     hospital => new Hospital(hospital.nombre, hospital._id, hospital.img, hospital.usuario)
  //                   );
  //                   return {
  //                     total: resp.total,
  //                     hospitales
  //                   };
  //                 })
  //                 )
  // }

}
