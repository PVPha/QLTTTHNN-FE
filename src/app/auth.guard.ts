import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log('canActivate', route, state);
    const token = this.authService.getToken();
    if (token) {
      return true;
    }
    // if (state.url.includes('view-salary')) {
    //   console.error('Bạn không thể vào phòng bí mật này !');
    //   return false;
    // }
    // console.log('Đã kiểm duyệt và cho vào !');
    // return false;
    // return this.router.navigate(['/login']);

    this.router.navigate(['/login']);
    return false;
    //return true;
  }
}
