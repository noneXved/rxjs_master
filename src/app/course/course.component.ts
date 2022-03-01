import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {concat, debounceTime, distinctUntilChanged, fromEvent, map, Observable, startWith, switchMap} from 'rxjs';
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
     this.lessons = fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        startWith(''),
        // it waits a period of time in example 0,4sec to send data
        debounceTime(400),
        // it prevent duplicates
        distinctUntilChanged(),
        // TODO switchMap allows to cancel previous request to optimize
        // if we provide some data into input it will cancel previous requests to improve app
        switchMap((search:any) => this.loadLessons(search))
      )

  }

  loadLessons(search = ''): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=1&pageSize=100&filter=${search}`)
      .pipe(
        map((res: any) => res['payload'])
      );
  }
}
