import {Injectable} from '@angular/core';
import {Place} from "./place.model";
import {AuthService} from "../auth/auth.service";
import {BehaviorSubject} from "rxjs";
import {delay, map, take, tap} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class PlacesService {


    constructor(private authService: AuthService) {
    }

    private _places = new BehaviorSubject<Place[]>([new Place('p1', "Warsaw Hotel",
        'In the center of Warsaw',
        'https://r-cf.bstatic.com/images/hotel/max1024x768/209/209608803.jpg', 200,
        new Date('2019-01-01'), new Date('2020-02-02'), 'abc'),
        new Place('p2', 'Gdansk Bungalow',
            'small bungalow near sea',
            'https://www.wyspa.pl/sites/default/files/public/styles/article_modal_window_img/public/images/firmy/pod_lasem_domki/08.jpg?itok=hZmfOWYV', 250,
            new Date('2019-01-01'), new Date('2021-02-02'), 'abc'),
        new Place('p3', 'Wisla camping',
            'camping in forest',
            'https://q-cf.bstatic.com/images/hotel/max1024x768/236/236069306.jpg', 80,
            new Date('2019-01-01'), new Date('2021-02-01'), 'asd')]);


    get places() {
        return this._places.asObservable();
    }

    getPlaceById(placeId: string) {
        return this.places.pipe(take(1), map(places => {
            return {...places.find(p => p.id === placeId)};
        }))
    }


    addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
        return this.places.pipe(take(1), delay(1000), tap(places => {
            this._places.next(places.concat(
                new Place(Math.random().toString(),
                    title,
                    description,
                    'https://q-cf.bstatic.com/images/hotel/max1024x768/236/236069306.jpg',
                    price,
                    dateFrom,
                    dateTo,
                    this.authService.userId)))
            ;
        }));

    }

    editPlace(id: string, title: string, description: string) {
        return this.places.pipe(take(1), delay(1000), tap(places => {
            const placeToUpdateIndex = places.findIndex(pl => pl.id === id);
            const placeToUpdate = places[placeToUpdateIndex];
            places[placeToUpdateIndex] = new Place(placeToUpdate.id, title, description, placeToUpdate.imageUrl, placeToUpdate.price, placeToUpdate.availableFrom, placeToUpdate.availableTo, placeToUpdate.userId);
            this._places.next(places);
        }));

    }
}
