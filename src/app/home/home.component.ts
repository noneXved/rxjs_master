import { Component, OnInit } from '@angular/core';
import { createHttpObservable } from '../common/util';
import { map, Observable, shareReplay, tap } from 'rxjs';
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
