import { Component, OnInit } from '@angular/core';
import { createHttpObservable } from '../common/util';
import {catchError, finalize, map, Observable, of, shareReplay, tap, throwError} from 'rxjs';
import { Course } from '../model/course';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  beginnerCourses: Observable<Course[]>;
  advancedCourses: Observable<Course[]>;

  ngOnInit(): void {
    const http$: Observable<Course[]> = createHttpObservable('/api/courses');

    const courses = http$.pipe(
      // catching error at the begging prevent to realize rest request
      // shareReplay() shares result between many calls - optimization
      catchError(error => {
          console.log("Error occured", error)

          return throwError(error);
        }
      ),
      finalize(() =>
        console.log("aaa")
      ),
      tap(() => console.log('The request was executed')),
      map((res: any) => Object.values(res['payload'])),
      shareReplay()
    );

    courses.subscribe();
    this.beginnerCourses = courses.pipe(
      map((courses: any) => courses.filter((course) => course.category == 'BEGINNER'))
    );
    this.advancedCourses = courses.pipe(
      map((courses: any) => courses.filter((course) => course.category == 'ADVANCED'))
    );
  }
}
