import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {CurrentUserService} from '../../shared/services/current-user';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate() {
    return true;
  }
}
