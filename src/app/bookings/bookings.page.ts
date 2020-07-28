import {Component, OnDestroy, OnInit} from '@angular/core';
import {BookingService} from "./booking.service";
import {Booking} from "./booking.model";
import {IonItemSliding, LoadingController} from "@ionic/angular";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-bookings',
    templateUrl: './bookings.page.html',
    styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
    loadedBookings: Booking[];
    private bookingSub: Subscription;

    constructor(private bookingService: BookingService, private loadingController: LoadingController) {
    }

    ngOnInit() {
        this.bookingSub = this.bookingService.bookings.subscribe(bookings => this.loadedBookings = bookings);
    }

    onCancelBooking(id: string, itemSliding: IonItemSliding) {
        itemSliding.close();
        this.loadingController.create({message: 'Canceling your reservation...'})
            .then(loadingElement => {
                loadingElement.present();
                this.bookingSub = this.bookingService.cancelBooking(id).subscribe(()=>{loadingElement.dismiss();})
                ;
            })


    }

    ngOnDestroy(): void {
        if (this.bookingSub) {
            this.bookingSub.unsubscribe();
        }
    }
}
