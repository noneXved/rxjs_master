import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Course } from '../model/course';
import { createHttpObservable } from './util';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private subject = new BehaviorSubject<Course[]>([]);

  courses: Observable<Course[]> = this.subject.asObservable();

  init() {
    const http$: Observable<Course[]> = createHttpObservable('/api/courses');

    http$
      .pipe(
        tap(() => console.log('The request was executed')),
        map((res: any) => Object.values(res['payload']))
      )
      .subscribe((courses: any) => this.subject.next(courses));
  }

  selectBeginnerCourses() {
    return this.filterByCategory('BEGINNER');
  }

  selectAdvancedCourses() {
    return this.filterByCategory('ADVANCED');
  }

  filterByCategory(category: string) {
    return this.courses.pipe(map((courses: any) => courses.filter((course) => course.category == category)));
  }
}
