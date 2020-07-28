import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PlacesService} from "../../places.service";
import {LoadingController, NavController} from "@ionic/angular";
import {Place} from "../../place.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-edit-offer',
    templateUrl: './edit-offer.page.html',
    styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
    place: Place;
    form: FormGroup;
    private placesSub: Subscription;

    constructor(private activatedRoute: ActivatedRoute,
                private placesService: PlacesService,
                private navCtrl: NavController,
                private loadingController: LoadingController,
                private router: Router) {
    }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(paramMap => {
            if (!paramMap.has('placeId')) {
                this.navCtrl.navigateBack('/places/tabs/offers');
                return;
            }
            this.placesSub = this.placesService.getPlaceById(paramMap.get('placeId')).subscribe(placeFromService => {
                this.place = placeFromService;
            })
            this.form = new FormGroup({
                title: new FormControl(this.place.title,
                    {
                        updateOn: 'blur',
                        validators: [Validators.required]
                    }
                ),
                description: new FormControl(this.place.description,
                    {
                        updateOn: 'blur',
                        validators: [Validators.required, Validators.maxLength(180)]
                    }
                )
            })

        })

    }

    onEditOffer() {
        if (!this.form.valid) {
            return;
        }
        this.loadingController.create({
            message: 'Editing place..'
        }).then(loadingElement => {
            loadingElement.present();
        });

        this.placesSub = this.placesService.editPlace(this.place.id, this.form.value.title, this.form.value.description).subscribe(() => {
            this.loadingController.dismiss();
            this.form.reset();
            this.router.navigateByUrl('places/tabs/offers');
        });

    }

    ngOnDestroy(): void {
        if (this.placesSub) {
            this.placesSub.unsubscribe();
        }
    }
}
