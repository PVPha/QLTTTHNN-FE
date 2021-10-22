import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addTKB',
  templateUrl: './addTKB.component.html',
  styleUrls: ['./addTKB.component.css']
})
export class AddTKBComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

}
