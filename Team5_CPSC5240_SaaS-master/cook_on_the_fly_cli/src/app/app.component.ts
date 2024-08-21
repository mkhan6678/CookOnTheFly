import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'cook_on_the_fly_cli';
  isLoggedIn = false;
  sidebarVisible = true;
  username = '';
  email = '';
  userId = ''

  constructor(private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
        if (isLoggedIn) {
          console.log('User logged in');
          this.authService.getUserInfo().subscribe(userInfo => {
            this.username = userInfo.username;
            this.email = userInfo.email;
            this.userId = userInfo.id;
          });

        } else {
          console.log('User not logged in');
          this.username = '';
          this.email = '';
          this.userId = '';
        }
        this.isLoggedIn = isLoggedIn;
      }
    );
  }
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

}
