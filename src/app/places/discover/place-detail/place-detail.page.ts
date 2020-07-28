import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionSheetController, LoadingController, ModalController, NavController} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";
import {PlacesService} from "../../places.service";
import {Place} from "../../place.model";
import {CreateBookingComponent} from "../../../bookings/create-booking/create-booking.component";
import {Subscription} from "rxjs";
import {BookingService} from "../../../bookings/booking.service";
import {AuthService} from "../../../auth/auth.service";

@Component({
    selector: 'app-place-detail',
    templateUrl: './place-detail.page.html',
    styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
    place: Place;
    isBookable = false;
    private placesSub: Subscription;

    constructor(private navCtrl: NavController,
                private route: ActivatedRoute,
                private placesService: PlacesService,
                private modalController: ModalController,
                private actionSheetController: ActionSheetController,
                private bookingService: BookingService,
                private loadingController: LoadingController,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (!paramMap.has('placeId')) {
                this.navCtrl.navigateBack('/places/tabs/offers');
                return;
            }
            this.placesSub = this.placesService.getPlaceById(paramMap.get('placeId')).subscribe(placeFromService => {
                this.place = placeFromService;
                this.isBookable = placeFromService.userId != this.authService.userId;
            });
        })

    }

    onBookPlace() {
        this.actionSheetController.create({
            header: 'Choose an Action',
            buttons: [
                {
                    text: 'Select Date',
                    handler: () => {
                        this.openBookingModal('select');
                    }
                }, {
                    text: 'Random Date',
                    handler: () => {
                        this.openBookingModal('random');
                    }
                },
                {
                    text: 'Cancel',
                    role: 'destructive'
                }
            ]

        }).then(actionSheetElement => actionSheetElement.present());


    }

    openBookingModal(mode: 'select' | 'random') {
        this.modalController
            .create({
                component: CreateBookingComponent,
                componentProps: {selectedPlace: this.place, selectedMode: mode}
            })
            .then(modal => {
                    modal.present();
                    return modal.onDidDismiss()
                }
            ).then(result => {
            this.loadingController.create({message: 'Booking place...'}).then(loadingElement => {
                loadingElement.present();
                this.bookingService.addBooking(this.place.id,
                    this.place.title,
                    this.place.description,
                    result.data.bookingData.firstName,
                    result.data.bookingData.surname,
                    result.data.bookingData.guests,
                    result.data.bookingData.dateFrom,
                    result.data.bookingData.dateTo).subscribe(() => {
                    loadingElement.dismiss();
                })
            });

        });
    }

    ngOnDestroy(): void {
        if (this.placesSub) {
            this.placesSub.unsubscribe();
        }
    }


}
