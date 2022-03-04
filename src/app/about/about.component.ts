import { Component, OnInit } from '@angular/core';
import {concat, interval, map, merge, of, Subject} from 'rxjs';
import {createHttpObservable} from "../common/util";

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const subject = new Subject()
    const observable = subject.asObservable();
    observable.subscribe(console.log);

    subject.next(1)
    subject.next(2)
    subject.next(3)
    subject.complete()
  }
}
