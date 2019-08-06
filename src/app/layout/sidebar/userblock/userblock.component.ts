import { User } from './../../../models/user.model';
import { Component, OnInit } from '@angular/core';

import { UserblockService } from './userblock.service';
import { UserService } from '../../../services/service.index';

@Component({
    selector: 'app-userblock',
    templateUrl: './userblock.component.html',
    styleUrls: ['./userblock.component.scss']
})
export class UserblockComponent implements OnInit {
    user: User;

    constructor(public userblockService: UserblockService, public _userService: UserService) {

        // this.user = {
        //     picture: 'assets/img/user/01.jpg'
        // };
        this.user = _userService.user;
        console.log(this.user);
        
    }

    ngOnInit() {
    }

    userBlockIsVisible() {
        return this.userblockService.getVisibility();
    }

}
