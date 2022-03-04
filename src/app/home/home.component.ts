import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../model/course';
import { StoreService } from '../common/store.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  beginnerCourses: Observable<Course[]>;
  advancedCourses: Observable<Course[]>;

  constructor(private storeService: StoreService) {}
  ngOnInit(): void {
    const courses = this.storeService.courses;

    courses.subscribe();
    this.beginnerCourses = this.storeService.selectBeginnerCourses();
    this.advancedCourses = this.storeService.selectAdvancedCourses();
  }
}
