import { Component, OnInit } from '@angular/core';
import {createHttpObservable} from "../common/util";
import {map, noop} from "rxjs";
import {Course} from "../model/course";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  beginnerCourses: Course[] = [];

  advancedCourses: Course[] = [];

  constructor() { }

  ngOnInit(): void {

    const http$ = createHttpObservable('/api/courses');

    const courses = http$.pipe(
      map((res: any) => Object.values(res['payload'])
      ));

    // map
    courses.subscribe(
      courses => {
        this.beginnerCourses = courses.filter(course => course.category == "BEGINNER")
        this.advancedCourses = courses.filter(course => course.category == "ADVANCED")
      },
      noop,
      () => console.log('completed')
    );

  }

}
