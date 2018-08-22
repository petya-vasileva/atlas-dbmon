/**
 * @license
 * Copyright 2013-present Dale Lotts All Rights Reserved.
 * http://www.dalelotts.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/dalelotts/angular-bootstrap-datetimepicker/blob/master/LICENSE
 */

import {DlDateTimePickerComponent} from '../../dl-date-time-picker.component';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import * as moment from 'moment';
import {
  dispatchKeyboardEvent,
  DOWN_ARROW,
  END,
  ENTER,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  SPACE,
  UP_ARROW
} from '../dispatch-events';
import {DEC, JAN} from '../month-constants';
import {DlDateTimePickerNumberModule} from '../../dl-date-time-picker.module';

@Component({
  template: '<dl-date-time-picker startView="month"></dl-date-time-picker>'
})
class MonthStartViewComponent {
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent<number>;
}

@Component({

  template: '<dl-date-time-picker startView="month" [(ngModel)]="selectedDate"></dl-date-time-picker>'
})
class MonthStartViewWithNgModelComponent {
  selectedDate = new Date(2017, DEC, 22).getTime();
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent<number>;
}

describe('DlDateTimePickerComponent startView=month', () => {

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [
        FormsModule,
        DlDateTimePickerNumberModule
      ],
      declarations: [
        MonthStartViewComponent,
        MonthStartViewWithNgModelComponent
      ]
    })
      .compileComponents();
  }));

  describe('default behavior ', () => {
    let component: MonthStartViewComponent;
    let fixture: ComponentFixture<MonthStartViewComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(MonthStartViewComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        nativeElement = debugElement.nativeElement;
      });
    }));

    it('should start with month-view', () => {
      const monthView = fixture.debugElement.query(By.css('.dl-abdtp-month-view'));
      expect(monthView).toBeTruthy();
    });

    it('should contain 0 .dl-abdtp-col-label elements', () => {
      const dayLabelElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-col-label'));
      expect(dayLabelElements.length).toBe(0);
    });

    it('should contain 12 .dl-abdtp-month elements', () => {
      const monthElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-month'));
      expect(monthElements.length).toBe(12);
    });

    it('should contain 1 .dl-abdtp-now element for the current month', () => {
      const currentElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-now'));
      expect(currentElements.length).toBe(1);
      expect(currentElements[0].nativeElement.textContent.trim()).toBe(moment().format('MMM'));
      expect(currentElements[0].nativeElement.classList).toContain(moment().startOf('month').valueOf().toString());
    });

    it('should NOT contain an .dl-abdtp-now element in the previous year', () => {
      // click on the left button to move to the previous hour
      debugElement.query(By.css('.dl-abdtp-left-button')).nativeElement.click();
      fixture.detectChanges();

      const currentElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-now'));
      expect(currentElements.length).toBe(0);
    });

    it('should NOT contain an .dl-abdtp-now element in the next year', () => {
      // click on the left button to move to the previous hour
      debugElement.query(By.css('.dl-abdtp-right-button')).nativeElement.click();
      fixture.detectChanges();

      const currentElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-now'));
      expect(currentElements.length).toBe(0);
    });

    it('should contain 1 [tabindex=1] element', () => {
      const tabIndexElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-month[tabindex="0"]'));
      expect(tabIndexElements.length).toBe(1);
    });

    it('should contain 1 .dl-abdtp-active element for the current month', () => {
      const currentElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-active'));
      expect(currentElements.length).toBe(1);
      expect(currentElements[0].nativeElement.textContent.trim()).toBe(moment().format('MMM'));
      expect(currentElements[0].nativeElement.classList).toContain(moment().startOf('month').valueOf().toString());
    });

    it('should contain 1 .dl-abdtp-selected element for the current month', () => {
      component.picker.value = moment().startOf('month').valueOf();
      fixture.detectChanges();

      // Bug: The value change is not detected until there is some user interaction
      // **ONlY** when there is no ngModel binding on the component.
      // I think it is related to https://github.com/angular/angular/issues/10816
      const activeElement = debugElement.query(By.css('.dl-abdtp-active')).nativeElement;
      activeElement.focus();
      dispatchKeyboardEvent(activeElement, 'keydown', HOME);
      fixture.detectChanges();

      const selectedElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-selected'));
      expect(selectedElements.length).toBe(1);
      expect(selectedElements[0].nativeElement.textContent.trim()).toBe(moment().format('MMM'));
      expect(selectedElements[0].nativeElement.classList).toContain(moment().startOf('month').valueOf().toString());
    });

  });

  describe('ngModel=2017-12-22', () => {
    let component: MonthStartViewWithNgModelComponent;
    let fixture: ComponentFixture<MonthStartViewWithNgModelComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(MonthStartViewWithNgModelComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        nativeElement = debugElement.nativeElement;
      });
    }));


    it('should contain .dl-abdtp-view-label element with "2017"', () => {
      const viewLabel = fixture.debugElement.query(By.css('.dl-abdtp-view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('2017');
    });

    it('should contain 12 .dl-abdtp-month elements with start of month utc time as class and role of gridcell', () => {

      const expectedClass = new Array(12)
        .fill(0)
        .map((value, index) => new Date(2017, JAN + index, 1).getTime());

      const monthElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-month'));
      expect(monthElements.length).toBe(12);

      monthElements.forEach((monthElement, index) => {
        const key = expectedClass[index];
        const ariaLabel = moment(key).format('MMM YYYY');
        expect(monthElement.nativeElement.classList).toContain(key.toString());
        expect(monthElement.attributes['role']).toBe('gridcell', index);
        expect(monthElement.attributes['aria-label']).toBe(ariaLabel, index);
      });
    });

    it('.dl-abdtp-left-button should contain a title', () => {
      const leftButton = fixture.debugElement.query(By.css('.dl-abdtp-left-button'));
      expect(leftButton.attributes['title']).toBe('Go to 2016');
    });

    it('.dl-abdtp-left-button should contain aria-label', () => {
      const leftButton = fixture.debugElement.query(By.css('.dl-abdtp-left-button'));
      expect(leftButton.attributes['aria-label']).toBe('Go to 2016');
    });

    it('should have a class for previous year value on .dl-abdtp-left-button ', () => {
      const leftButton = fixture.debugElement.query(By.css('.dl-abdtp-left-button'));
      expect(leftButton.nativeElement.classList).toContain(new Date(2016, JAN, 1).getTime().toString());
    });

    it('should switch to previous year value after clicking .dl-abdtp-left-button', () => {
      const leftButton = fixture.debugElement.query(By.css('.dl-abdtp-left-button'));
      leftButton.nativeElement.click();
      fixture.detectChanges();

      const viewLabel = fixture.debugElement.query(By.css('.dl-abdtp-view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('2016');

      const monthElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-month'));
      expect(monthElements[0].nativeElement.textContent.trim()).toBe('Jan');
      expect(monthElements[0].nativeElement.classList).toContain(new Date(2016, JAN, 1).getTime().toString());
    });

    it('.dl-abdtp-right-button should contain a title', () => {
      const leftButton = fixture.debugElement.query(By.css('.dl-abdtp-right-button'));
      expect(leftButton.attributes['title']).toBe('Go to 2018');
    });

    it('.dl-abdtp-right-button should contain aria-label', () => {
      const leftButton = fixture.debugElement.query(By.css('.dl-abdtp-right-button'));
      expect(leftButton.attributes['aria-label']).toBe('Go to 2018');
    });

    it('should have a class for next year value on .dl-abdtp-right-button ', () => {
      const rightButton = fixture.debugElement.query(By.css('.dl-abdtp-right-button'));
      expect(rightButton.nativeElement.classList).toContain(new Date(2018, JAN, 1).getTime().toString());
    });

    it('should switch to next year value after clicking .dl-abdtp-right-button', () => {
      const rightButton = fixture.debugElement.query(By.css('.dl-abdtp-right-button'));
      rightButton.nativeElement.click();
      fixture.detectChanges();

      const viewLabel = fixture.debugElement.query(By.css('.dl-abdtp-view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('2018');

      const monthElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-month'));
      expect(monthElements[0].nativeElement.textContent.trim()).toBe('Jan');
      expect(monthElements[0].nativeElement.classList).toContain(new Date(2018, JAN, 1).getTime().toString());
    });

    it('.dl-abdtp-up-button should contain a title', () => {
      const leftButton = fixture.debugElement.query(By.css('.dl-abdtp-up-button'));
      expect(leftButton.attributes['title']).toBe('Go to 2017');
    });

    it('.dl-abdtp-up-button should contain aria-label', () => {
      const leftButton = fixture.debugElement.query(By.css('.dl-abdtp-up-button'));
      expect(leftButton.attributes['aria-label']).toBe('Go to 2017');
    });

    it('should switch to year view after clicking .dl-abdtp-up-button', () => {
      const upButton = fixture.debugElement.query(By.css('.dl-abdtp-up-button'));
      upButton.nativeElement.click();
      fixture.detectChanges();

      const viewLabel = fixture.debugElement.query(By.css('.dl-abdtp-view-label'));
      expect(viewLabel.nativeElement.textContent).toBe('2010-2019');

      const yearView = fixture.debugElement.query(By.css('.dl-abdtp-year-view'));
      expect(yearView).toBeTruthy();
    });

    it('should not emit a change event when clicking .dl-abdtp-month', () => {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      const monthElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-month'));
      monthElements[9].nativeElement.click(); // OCT
      fixture.detectChanges();

      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('should change to .dl-abdtp-day-view when selecting .dl-abdtp-month', () => {
      const monthElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-month'));
      monthElements[0].nativeElement.click(); // 2009
      fixture.detectChanges();

      const monthView = fixture.debugElement.query(By.css('.dl-abdtp-month-view'));
      expect(monthView).toBeFalsy();

      const dayView = fixture.debugElement.query(By.css('.dl-abdtp-day-view'));
      expect(dayView).toBeTruthy();
    });

    it('should have one .dl-abdtp-active element', () => {
      const activeElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-active'));
      expect(activeElements.length).toBe(1);
    });

    it('should change .dl-abdtp-active element on right arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(newActiveElement.nativeElement.textContent).toBe('Jan');
    });

    it('should change to next year when last .dl-abdtp-month is .dl-abdtp-active element and pressing on right arrow', () => {
      (component.picker as any)._model.activeDate = new Date(2017, DEC, 1).getTime();
      fixture.detectChanges();

      dispatchKeyboardEvent(fixture.debugElement.query(By.css('.dl-abdtp-active')).nativeElement, 'keydown', RIGHT_ARROW); // 2018
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('Jan');

      const viewLabel = fixture.debugElement.query(By.css('.dl-abdtp-view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('2018');
    });

    it('should change .dl-abdtp-active element on left arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', LEFT_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(newActiveElement.nativeElement.textContent).toBe('Nov');
    });

    it('should change to previous year when first .dl-abdtp-month is .dl-abdtp-active element and pressing on left arrow', () => {
      (component.picker as any)._model.activeDate = new Date(2017, JAN, 1).getTime();
      fixture.detectChanges();

      dispatchKeyboardEvent(fixture.debugElement.query(By.css('.dl-abdtp-active')).nativeElement, 'keydown', LEFT_ARROW); // 2019
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');

      const viewLabel = fixture.debugElement.query(By.css('.dl-abdtp-view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('2016');
    });

    it('should change .dl-abdtp-active element on up arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', UP_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(newActiveElement.nativeElement.textContent).toBe('Aug');
    });

    it('should change to previous year when first .dl-abdtp-month is .dl-abdtp-active element and pressing on up arrow', () => {
      (component.picker as any)._model.activeDate = new Date(2017, JAN, 1).getTime();
      fixture.detectChanges();

      dispatchKeyboardEvent(fixture.debugElement.query(By.css('.dl-abdtp-active')).nativeElement, 'keydown', UP_ARROW); // 2019
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('Sep');

      const viewLabel = fixture.debugElement.query(By.css('.dl-abdtp-view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('2016');
    });

    it('should change .dl-abdtp-active element on down arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', DOWN_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(newActiveElement.nativeElement.textContent).toBe('Apr');
    });

    it('should change .dl-abdtp-active element on page-up (fn+up-arrow)', () => {
      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', PAGE_UP);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(newActiveElement.nativeElement.textContent).toBe('Dec');

      const viewLabel = fixture.debugElement.query(By.css('.dl-abdtp-view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('2016');
    });

    it('should change .dl-abdtp-active element on page-down (fn+down-arrow)', () => {
      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', PAGE_DOWN);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(newActiveElement.nativeElement.textContent).toBe('Dec');

      const viewLabel = fixture.debugElement.query(By.css('.dl-abdtp-view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('2018');
    });

    it('should change .dl-abdtp-active element to first .dl-abdtp-month on HOME', () => {
      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', HOME);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(newActiveElement.nativeElement.textContent).toBe('Jan');
    });

    it('should change .dl-abdtp-active element to last .dl-abdtp-month on END', () => {
      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', END);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(newActiveElement.nativeElement.textContent).toBe('Dec');
    });

    it('should do nothing when hitting non-supported key', () => {
      (component.picker as any)._model.activeDate = new Date(2017, DEC, 1).getTime();
      fixture.detectChanges();

      let activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', 65); // A
      fixture.detectChanges();

      activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');
    });

    it('should change to .dl-abdtp-day-view when hitting ENTER', () => {
      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', ENTER, 'enter');
      fixture.detectChanges();

      const monthView = fixture.debugElement.query(By.css('.dl-abdtp-month-view'));
      expect(monthView).toBeFalsy();

      const dayView = fixture.debugElement.query(By.css('.dl-abdtp-day-view'));
      expect(dayView).toBeTruthy();
    });

    it('should change to .dl-abdtp-day-view when hitting SPACE', () => {
      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', SPACE, 'space');
      fixture.detectChanges();

      const monthView = fixture.debugElement.query(By.css('.dl-abdtp-month-view'));
      expect(monthView).toBeFalsy();

      const dayView = fixture.debugElement.query(By.css('.dl-abdtp-day-view'));
      expect(dayView).toBeTruthy();
    });
  });
});
