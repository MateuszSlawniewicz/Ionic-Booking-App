import {Component, Input, OnInit} from '@angular/core';
import {Place} from "../../places/place.model";
import {ModalController} from "@ionic/angular";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-create-booking',
    templateUrl: './create-booking.component.html',
    styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
    @Input() selectedPlace: Place;
    @Input() selectedMode: 'select' | 'random'
    form: FormGroup;
    startDate = null;
    endDate = null;

    constructor(private modalController: ModalController) {
    }

    ngOnInit() {
        const availableFrom = new Date(this.selectedPlace.availableFrom);
        const availableTo = new Date(this.selectedPlace.availableTo);
        if (this.selectedMode === 'random') {
            this.startDate = new Date(
                availableFrom.getTime() +
                Math.random() *
                (availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - availableFrom.getTime())).toISOString();

            this.endDate = new Date(new Date(this.startDate).getTime()
                + Math.random() *
                (availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime())).toISOString();
        }


        this.form = new FormGroup({
            name: new FormControl(null,
                {
                    updateOn: 'blur',
                    validators: [Validators.required]
                }
            ),
            surname: new FormControl(null,
                {
                    updateOn: 'blur',
                    validators: [Validators.required]
                }
            ),
            guests: new FormControl(2,
                {
                    updateOn: 'blur',
                    validators: [Validators.required]
                }
            ),
            dateFrom: new FormControl(this.startDate, {
                updateOn: 'blur',
                validators: [Validators.required]
            }),
            dateTo: new FormControl(this.endDate, {
                updateOn: 'blur',
                validators: [Validators.required]
            })
        })


    }

    datesValid() {
        const startDate = this.form.value.dateFrom;
        const endDate = this.form.value.dateTo;
        return endDate > startDate;
    }

    onBookPlace() {
        if (!this.form.valid || !this.datesValid()) {
            return;
        }
        this.modalController.dismiss({
            bookingData: {
                firstName: this.form.value.firstName,
                surname: this.form.value.surname,
                guests: this.form.value.guests,
                dateFrom: this.form.value.dateFrom,
                dateTo: this.form.value.dateTo
            }
        }, 'confirm');
    }

    onCancel() {
        this.modalController.dismiss(null, 'cancel');
    }


}
