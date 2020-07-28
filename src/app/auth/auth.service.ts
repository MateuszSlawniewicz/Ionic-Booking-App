import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _userIsAuthenticated = false;
    private _userId = 'abc';

    constructor() {
    }

    login() {
        this._userIsAuthenticated = true;
    }

    get userId() {
        return this._userId;
    }

    logout() {
        this._userIsAuthenticated = false;
    }

    isUserAuthenticated() {
        return this._userIsAuthenticated;
    }
}
