import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course } from '../model/course';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import {concatMap, exhaustMap, filter, fromEvent, mergeMap} from 'rxjs';
import { fromPromise } from 'rxjs-compat/observable/fromPromise';

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.scss'],
})
export class CourseDialogComponent implements AfterViewInit, OnInit {
  form: FormGroup;

  course: Course;

  @ViewChild('saveButton', { static: true }) saveButton: ElementRef;

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngOnInit() {
    // TODO DEBUG FORM
    this.form.valueChanges.subscribe(console.log);

    // concatMap
    // takes valueChanges
    // -> creating new observables
    // -> subscribing
    // -> concatenating them
    this.form.valueChanges
      .pipe(
        filter(() => this.form.valid),
        concatMap((changes) => this.saveCourse(changes))
      )
      .subscribe();
  }

  ngAfterViewInit() {
    // exhaustMap
    // it ignores events until last one is not completed

    fromEvent(this.saveButton.nativeElement, 'click')
      .pipe(
        exhaustMap(() => this.saveCourse(this.form.value)))
      .subscribe();
  }

  saveCourse(changes) {
    return fromPromise(
      fetch(`/api/courses/${this.course.id}`, {
        method: 'PUT',
        body: JSON.stringify(changes),
        headers: {
          'content-type': 'application/json',
        },
      })
    );
  }

  // save() {
  //   this.store.saveCourse(this.course.id, this.form.value)
  //     .subscribe(
  //       () => this.close(),
  //       err => console.log("Error saving course", err)
  //     );
  // }

  close() {
    this.dialogRef.close();
  }

  save() {}
}
