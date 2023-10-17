import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IDocumentosvale } from '../interface/IDocumentosvale';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private url: string= environment.baseUrl;
  url2= 'http://localhost:8080/file';

  constructor(private http: HttpClient) { }

  multiple(myFiles: File[]){
    const formData= new FormData();
    myFiles.forEach(archivo=>{
      formData.append('file', archivo);
    });
    return this.http.post<IDocumentosvale[]>(`${this.url}`, formData).pipe(
      catchError((err: HttpErrorResponse)=>{
        return this.errorHandler(err)
      })
    );
  }

  errorHandler(error: HttpErrorResponse):Observable<never>{

    
    if(error.status ===500)
    return throwError(()=> new Error(error.statusText))
  if(error.status===400)
  return throwError(()=> new Error('Algo pasó'));
return throwError(()=>new Error('Error al subir archivos'));
  }

  download1(id:string): Observable<File>{
    // Recupera el token de acceso desde el local storage
    const token = localStorage.getItem('token');

    // Crea un objeto HttpHeaders para agregar el token de acceso en el encabezado 'Authorization'
    const headerss = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // Configura las opciones de la solicitud HTTP con los encabezados personalizados
    const requestOptions = {
      headers: headerss
    };
    //const headers= new HttpHeaders().set('Content-Type', 'Aplication/json');
    return this.http.get<File>(`${this.url}/document/descarga/${id}`,requestOptions
    //{headers, responseType: 'blob' as 'json'}
   )
  }
}
