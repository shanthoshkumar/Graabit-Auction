import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signingout',
  templateUrl: './signingout.component.html',
  styleUrls: ['./signingout.component.css']
})
export class SigningoutComponent implements OnInit {

  constructor(private route:Router) { }

  ngOnInit() {
    let meta = this;
    meta.route.navigate(['/home'])
  }

}
