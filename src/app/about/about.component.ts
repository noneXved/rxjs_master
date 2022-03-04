import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Behavior subject must always take parameter and
    const subject = new BehaviorSubject(0);
    // BehaviorSubject - is running naturally like we put 0 so our early sub get: 0 1 2 3 and late sub get: 3 - last value
    // AsyncSubject - always waiting for all observables to retrieve LAST VALUE fore early: 3 and last sub: 3
    // ReplaySubject - repeat all observables for subscribed values for early sub: 1 2 3 & late sub: 1 2 3
    const observable = subject.asObservable();
    observable.subscribe((val) => console.log('early sub: ' + val));

    subject.next(1);
    subject.next(2);
    subject.next(3);

    // it prevents to emit value in late sub cause it ends the SUBJECT
    subject.complete();

    setTimeout(() => {
      // without subject.complete() it returns last value because we use BehaviorSubject()
      // in common Subject we don't get value here
      observable.subscribe((val) => console.log('late sub: ' + val));
    });
  }
}
