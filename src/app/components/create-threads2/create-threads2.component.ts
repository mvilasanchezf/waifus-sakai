import { Component, OnInit } from '@angular/core';
import {Constants} from "../../common/constants";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";
import {MultimediaModel} from "../../model/multimedia.model";
import {error} from "protractor";

@Component({
    selector: 'app-create-threads2',
    templateUrl: './create-threads2.component.html',
    styleUrls: ['./create-threads2.component.scss'],
    providers: [MessageService]
})
export class CreateThreads2Component implements OnInit {

    url: string = Constants.apiURL;
    private thread:string;
    header: HttpHeaders;
    photo:boolean;
    emptyArray:boolean=false;
    multimedia:MultimediaModel[] = [];

    constructor( private messageService: MessageService,
                 private route: ActivatedRoute,
                 private http: HttpClient,
                 private router: Router) {
        this.url += "multimediaCreation";
        this.route.queryParams.subscribe(params => this.thread = params.id);
        this.header = new HttpHeaders();
        this.header = this.header.append('idThread', this.thread);
        this.photo = false;
    }

    onBasicUpload(event, box) {
        if (box ===1){
            this.photo = true;
        }
        this.messageService.add({severity: 'success', summary: 'Imagen actualizada', detail: ''});
    }

    uploadImages(event, box){
        this.emptyArray = false;
        this.onBasicUpload(event, box);
        this.http.get<Object>(this.url, {observe: 'response'}).subscribe( (resp:any) => {
            resp.body['multimediaArray'].forEach((media:any)=>{
                media = new MultimediaModel();
                media.constructorCreateThread(media['directory']);
                this.multimedia.push(media);
            })
            if(resp.body['multimediaArray'].length===0){
                this.emptyArray = true;
            }
        },()=>{
            this.emptyArray = true;
        }
        );
    }

    ngOnInit(): void {
    }

    showPreview(event, id, idBox){
        document.getElementById(idBox).style.display = 'block';
        let img = document.getElementById(id).querySelector("img");
        let file = event.currentFiles[0];
        img['src'] = URL.createObjectURL(file);
    }

    removePreview(id, idBox){
        document.getElementById(idBox).style.display = 'none';
        document.getElementById(id).querySelector("img")['src'] = "#";
    }

    finish(){
        if (this.photo){
            Swal.fire({
                title:`¡Has terminado el proceso!`,
                html: ``,
                icon: "success",
                confirmButtonText: 'Continuar'
            }).then(()=>{
                this.navigateToDashboard();
            });
        }else {
            Swal.fire({
                title: '¡Aún no ha subido imágenes!',
                text: "¿Desea salir de todas maneras? Las imágenes podrán ser modificadas luego.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'No',
                cancelButtonText: 'Sí',
                reverseButtons: true
            }).then((result:any)=>{
                if (result.isConfirmed){
                    Swal.close();
                }else{
                    this.navigateToDashboard();
                }
            })
        }

    }

    navigateToDashboard(){
        this.router.navigate(['/']);
    }

}
