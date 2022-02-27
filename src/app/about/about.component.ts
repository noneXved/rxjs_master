import {Component, OnInit} from '@angular/core';
import {map, noop} from "rxjs";
import {createHttpObservable} from "../common/util";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    const http$ = createHttpObservable('/api/courses');

    const courses = http$.pipe(
      map((res: any) => Object.values(res['payload'])
      ));

    // map
    courses.subscribe(
      courses => console.log(courses),
      noop,
      () => console.log('completed')
    );

    http$.subscribe(
      courses => console.log(courses),
      noop,
      () => console.log('completed')
    );

  }


}
