import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
    isLogin = false;

    constructor(private authService: AuthService, private router: Router) {
    }

    ngOnInit() {
    }

    onLogin() {
        this.authService.login();
        this.router.navigateByUrl('/places/tabs/discover')
    }

    onSubmit(f: NgForm) {
        if (!f.valid) {
            return;
        }
        const email = f.value.email;
        const password = f.value.password;
        console.log(email, password);
        if (this.isLogin) {
            // send a req to login servers
        } else {
            //send a req to signup servers
        }


    }

    onSwitchAuthMode() {
        this.isLogin = !this.isLogin;

    }
}
