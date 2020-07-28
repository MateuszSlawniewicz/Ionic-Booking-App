import {Injectable} from "@angular/core";
import {Booking} from "./booking.model";
import {BehaviorSubject} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {delay, take, tap} from "rxjs/operators";

@Injectable({providedIn: "root"})
export class BookingService {
    constructor(private authService: AuthService) {
    }

    private _bookings = new BehaviorSubject<Booking[]>([]);


    get bookings() {
        return this._bookings.asObservable();
    }

    addBooking(placeId: string, placeTitle: string,
               placeImage: string,
               firstName: string,
               lastName: string,
               guestNumber: number,
               dateFrom: Date,
               dateTo: Date) {

        const booking = new Booking(Math.random().toString(),
            placeId,
            this.authService.userId,
            placeTitle,
            placeImage,
            firstName,
            lastName,
            guestNumber,
            dateFrom,
            dateTo);

        return this._bookings.pipe(take(1),
            delay(1000),
            tap(bookings => {
                this._bookings.next(bookings.concat(booking));
            }))
    }

    cancelBooking(bookingId: string) {
        return this._bookings.pipe(take(1), delay(1000), tap(bookings => {
           const b = bookings.filter(booking => booking.id !== bookingId);
           this._bookings.next(b);
        }))

    }


}
