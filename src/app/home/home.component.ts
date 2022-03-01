import { Component, OnInit } from '@angular/core';
import { createHttpObservable } from '../common/util';
import { catchError, map, Observable, of, shareReplay, tap } from 'rxjs';
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
      tap(() => console.log('The request was executed')),
      map((res: any) => Object.values(res['payload'])),
      shareReplay(),
      catchError(() =>
        of([
          {
            id: 0,
            description: 'RxJs In Practice Course',
            iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png',
            courseListIcon: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
            longDescription: 'Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples',
            category: 'BEGINNER',
            lessonsCount: 10,
          },
        ])
      )
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
