import { Component, OnInit } from '@angular/core';
import {concat, interval, map, merge, of} from 'rxjs';
import {createHttpObservable} from "../common/util";

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {

    // concat
    const source1 = of(1, 2, 3);
    const source2 = of(4, 5, 6);

    const resultConcat = concat(source1, source2);

    resultConcat.subscribe(console.log);

    // merge
    const interval1 = interval(1000);
    const interval2 = interval1.pipe(map(value => value * 10))

    const resultMerge = merge(interval1, interval2);
    console.log(resultMerge)

    // unsubscribe - if stream is never ending, unsubscribe automatically ends it
    const intervalUnsub = interval(1000);
    const sub = intervalUnsub.subscribe(console.log)

    setTimeout(() => sub.unsubscribe(), 5000)


    const http = createHttpObservable('/api/courses');

    const subscribe = http.subscribe(console.log)

    setTimeout(() => subscribe.unsubscribe(), 0)
  }
}
