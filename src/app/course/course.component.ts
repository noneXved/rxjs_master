import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {debounceTime, distinctUntilChanged, fromEvent, map, Observable} from 'rxjs';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';
import { createHttpObservable } from '../common/util';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit, AfterViewInit {
  course: Observable<Course>;
  lessons: Observable<Lesson[]>;

  @ViewChild('searchInput', { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const courseId = this.route.snapshot.params['id'];

    // Usage route path into Observable
    this.course = createHttpObservable(`/api/courses/1`);

    this.lessons = createHttpObservable(`/api/lessons?courseId=1&pageSize=100`).pipe(map((res: any) => res['payload']));
  }

  ngAfterViewInit(): void {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        // it waits a period of time in example 0,4sec to send data
        debounceTime(400),
        // it prevent duplicates
        distinctUntilChanged()

      ).subscribe(console.log);
  }
}
