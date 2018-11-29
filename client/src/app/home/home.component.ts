import { Component, OnInit } from '@angular/core';
import { CognitoAuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  event: any = null;

  constructor(public auth: CognitoAuthService, private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.httpClient.get(`${environment.apiGateway.invokeUrl}/event`)
      .subscribe((result) => {
        this.event = result;
      });
  }
}
