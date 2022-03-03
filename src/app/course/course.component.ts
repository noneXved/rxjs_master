import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, map, Observable, startWith, throttleTime } from 'rxjs';
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
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        startWith(''),
        // debounceTime(500) -> call function if user doesn't take action for 0.5sec
        // throttleTime(500) -> call function in every 0.5 sec
        throttleTime(500)
        // it prevent duplicates
      )
      .subscribe(console.log);
  }

  loadLessons(search = ''): Observable<Lesson[]> {
    return createHttpObservable(`/api/lessons?courseId=1&pageSize=100&filter=${search}`).pipe(
      map((res: any) => res['payload'])
    );
  }
}
