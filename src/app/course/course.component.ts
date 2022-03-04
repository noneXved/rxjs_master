import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, fromEvent, map, Observable, startWith, switchMap } from 'rxjs';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { debug, RxJsLoggingLevel, setRxJsLoggingLevel } from '../common/debug';

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
    this.course = createHttpObservable(`/api/courses/1`).pipe(debug(RxJsLoggingLevel.INFO, 'course value '));

    setRxJsLoggingLevel(RxJsLoggingLevel.TRACE);
  }

  ngAfterViewInit(): void {
    this.lessons = fromEvent(this.input.nativeElement, 'keyup').pipe(
      map((event: any) => event.target.value),
      startWith(''),
      debug(RxJsLoggingLevel.TRACE, 'search '),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((search) => this.loadLessons(search)),
      debug(RxJsLoggingLevel.DEBUG, 'lesson value ')
    );
  }

  loadLessons(search = ''): Observable<Lesson[]> {
    return createHttpObservable(`/api/lessons?courseId=1&pageSize=100&filter=${search}`).pipe(
      map((res: any) => res['payload'])
    );
  }
}
