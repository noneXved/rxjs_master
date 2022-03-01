import { Component, OnInit } from '@angular/core';
import {concat, interval, map, merge, of} from 'rxjs';

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


  }
}
