import {Component, OnDestroy, OnInit} from '@angular/core';
import {Place} from "../../place.model";
import {ActivatedRoute} from "@angular/router";
import {PlacesService} from "../../places.service";
import {NavController} from "@ionic/angular";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-offer-bookings',
    templateUrl: './offer-bookings.page.html',
    styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit, OnDestroy {
    offer: Place;
    private placesSub: Subscription;

    constructor(private route: ActivatedRoute, private navCtrl: NavController, private placesService: PlacesService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (!paramMap.has('placeId')) {
                this.navCtrl.navigateBack('/places/tabs/offers')
                return
            }
            this.placesSub = this.placesService.getPlaceById(paramMap.get('placeId')).subscribe(place => {
                this.offer = place;
            })

        })
    }

    ngOnDestroy(): void {
        if (this.placesSub) {
            this.placesSub.unsubscribe();
        }
    }

}
