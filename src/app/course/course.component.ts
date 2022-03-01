import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {concat, debounceTime, distinctUntilChanged, fromEvent, map, Observable, switchMap} from 'rxjs';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';
import { createHttpObservable } from '../common/util';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit, AfterViewInit {
  courseId: string;
  course: Observable<Course>;
  lessons: Observable<Lesson[]>;

  @ViewChild('searchInput', { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];

    // Usage route path into Observable
    this.course = createHttpObservable(`/api/courses/1`);

  }

  ngAfterViewInit(): void {
     const searchLessons = fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        // it waits a period of time in example 0,4sec to send data
        debounceTime(400),
        // it prevent duplicates
        distinctUntilChanged(),
        // TODO switchMap allows to cancel previous request to optimize
        // if we provide some data into input it will cancel previous requests to improve app
        switchMap((search:any) => this.loadLessons(search))
      )

    const initialLessons = this.loadLessons();

    this.lessons = concat(initialLessons, searchLessons);
  }

  loadLessons(search = ''): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=1&pageSize=100&filter=${search}`)
      .pipe(
        map((res: any) => res['payload'])
      );
  }
}
