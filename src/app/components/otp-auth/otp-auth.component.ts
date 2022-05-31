import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigService } from "../../service/app.config.service";
import { AppConfig } from "../../api/appconfig";
import { Subscription } from "rxjs";
import { Constants } from "../../common/constants";
import { HttpClient, HttpParams } from "@angular/common/http";
import {ActivatedRoute, Params } from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";

@Component({
    selector: 'app-otp-auth',
    templateUrl: './otp-auth.component.html',
    styles:[`
    :host ::ng-deep .p-toast{
        margin-top: 5.70em;
        z-index:99999;
    }

  `], providers: [MessageService]
})
export class OtpAuthComponent implements OnInit, OnDestroy {

    config: AppConfig;
    subscription: Subscription;
    private readonly url:string = Constants.apiURL;
    private jwtOtp:string;
    private idUser:string;
    fg: FormGroup;
    constructor( private configService: ConfigService,
                 private http: HttpClient,
                 private route: ActivatedRoute,
                 private fb: FormBuilder,
                 private serviceMessage: MessageService) {
        this.createForm();
        this.url += "activationOTP";
        this.jwtOtp = '';
        this.route.queryParams.subscribe(params => this.idUser = params.id);
    }

    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });

        let param:HttpParams = new HttpParams();
        param = param.append('idUser', this.idUser);
        console.log(param )
        this.http.get(this.url, { params : param, observe: 'response' }).subscribe((resp:any)=>{

            this.jwtOtp = resp.body['activationOTP'];
            console.log(this.jwtOtp);
        });
    }

    ngOnDestroy(): void {
        if(this.subscription){
            this.subscription.unsubscribe();
        }
    }

    send(){
        if (this.fg.valid){

        }else{
            this.showErrorViaToast();
        }

    }

    createForm(){
        this.fg = this.fb.group({
            otp: [
                '',
                [
                    Validators.minLength(6),
                    Validators.maxLength(6),
                    Validators.required,
                    Validators.pattern('[0-9]')
                ]
            ]
        })
    }

    get otpInvalid(){
        return this.fg.get('otp').invalid && this.fg.get('otp').touched
    }

    showErrorViaToast() {
        this.serviceMessage.add({ key: 'tst', severity: 'error', summary: 'Ha ocurrido un error', detail: 'El código no es válido' });
    }

}
