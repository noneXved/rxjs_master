import { Component, OnInit } from '@angular/core';
import {fromEvent, noop, Observable, timer} from "rxjs";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
     const interval = timer(3000, 1000)

    const stopWatch = interval.subscribe(val => console.log("stream 1:" + val))

    setTimeout(() => {
        stopWatch.unsubscribe()
      }, 5000
    );

    const click = fromEvent(document, 'click');

    click.subscribe(
      evt => console.log(evt),

      err => console.log(err),

      () => console.log("completed")
    );

    // TODO HERE CREATED OWN OBSERVABLE
    const http$ = Observable.create(observer => {
        fetch('/api/courses').then(response => {
          return response.json();
        }).then(body => {
          observer.next(body);

          observer.complete();
        }).catch(err => {
          observer.error(err);
        })
    })

    http$.subscribe(
      courses => console.log(courses),
      noop,
      () => console.log('completed')

    );
  }

}
