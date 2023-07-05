import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Hospital } from 'src/app/models/hospitales.model';
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedaService } from 'src/app/services/busqueda.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];


  constructor(private activatedRoute: ActivatedRoute,
              private busquedaService: BusquedaService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      ({termino}) => { this.busquedaGlobal(termino)
      }
    )
  }

  busquedaGlobal(termino: string){
    this.busquedaService.busquedaGlobal(termino).subscribe(
      (resp: any) => {
        console.log(resp);
        this.usuarios = resp.usuario;
        this.medicos = resp.medico;
        this.hospitales = resp.hospital;
      }
    )
  }

}
