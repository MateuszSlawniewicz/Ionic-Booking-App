import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PlacesService} from "../../places.service";
import {Router} from "@angular/router";
import {LoadingController} from "@ionic/angular";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-new-offer',
    templateUrl: './new-offer.page.html',
    styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit, OnDestroy {
    form: FormGroup;
    private placesSub: Subscription;

    constructor(private placesService: PlacesService, private router: Router, private loadingController: LoadingController) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(null,
                {
                    updateOn: 'blur',
                    validators: [Validators.required]
                }),
            description: new FormControl(null,
                {
                    updateOn: 'blur',
                    validators: [Validators.required, Validators.maxLength(180)]
                }),
            price: new FormControl(null,
                {
                    updateOn: 'blur',
                    validators: [Validators.required, Validators.min(1)]
                }),
            dateFrom: new FormControl(null,
                {
                    updateOn: 'blur',
                    validators: [Validators.required]
                }),
            dateTo: new FormControl(null,
                {
                    updateOn: 'blur',
                    validators: [Validators.required]
                }),
        })


    }

    onCreateOffer() {
        if (!this.form.valid) {
            return;
        }
        this.loadingController.create({
            message: 'Creating place..'
        }).then(loadingElement => {
            loadingElement.present();
        });

        this.placesSub = this.placesService.addPlace(this.form.value.title,
            this.form.value.description,
            this.form.value.price,
            this.form.value.dateFrom,
            this.form.value.dateTo).subscribe(() => {
            this.loadingController.dismiss();
            this.form.reset();
            this.router.navigateByUrl('places/tabs/offers')
        });

    }

    ngOnDestroy(): void {
        this.placesSub.unsubscribe();
    }
}
