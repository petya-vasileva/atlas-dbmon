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
import {JAN} from '../month-constants';
import {DlDateTimePickerNumberModule} from '../../dl-date-time-picker.module';

@Component({

  template: '<dl-date-time-picker startView="hour"></dl-date-time-picker>'
})
class HourStartViewComponent {
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent<number>;
}

@Component({

  template: '<dl-date-time-picker startView="hour" [(ngModel)]="selectedDate"></dl-date-time-picker>'
})
class HourStartViewWithNgModelComponent {
  selectedDate = new Date(2018, JAN, 26, 15, 53, 27).getTime();
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent<number>;
}


describe('DlDateTimePickerComponent startView=hour', () => {

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [
        FormsModule,
        DlDateTimePickerNumberModule
      ],
      declarations: [
        HourStartViewComponent,
        HourStartViewWithNgModelComponent,
      ]
    })
      .compileComponents();
  }));

  describe('default behavior ', () => {
    let component: HourStartViewComponent;
    let fixture: ComponentFixture<HourStartViewComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(HourStartViewComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        nativeElement = debugElement.nativeElement;
      });
    }));

    it('should start with hour-view', () => {
      const hourView = fixture.debugElement.query(By.css('.dl-abdtp-hour-view'));
      expect(hourView).toBeTruthy();
    });

    it('should contain 0 .dl-abdtp-col-label elements', () => {
      const labelElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-col-label'));
      expect(labelElements.length).toBe(0);
    });

    it('should contain 24 .dl-abdtp-hour elements', () => {
      const hourElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-hour'));
      expect(hourElements.length).toBe(24);
    });

    it('should contain 1 .dl-abdtp-now element for the current hour', () => {
      const currentElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-now'));
      expect(currentElements.length).toBe(1);
      expect(currentElements[0].nativeElement.textContent.trim()).toBe(moment().startOf('hour').format('LT'));
      expect(currentElements[0].nativeElement.classList).toContain(moment().startOf('hour').valueOf().toString());
    });

    it('should NOT contain an .dl-abdtp-now element in the previous day', () => {
      // click on the left button to move to the previous hour
      debugElement.query(By.css('.dl-abdtp-left-button')).nativeElement.click();
      fixture.detectChanges();

      const currentElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-now'));
      expect(currentElements.length).toBe(0);
    });

    it('should NOT contain an .dl-abdtp-now element in the next day', () => {
      // click on the left button to move to the previous hour
      debugElement.query(By.css('.dl-abdtp-right-button')).nativeElement.click();
      fixture.detectChanges();

      const currentElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-now'));
      expect(currentElements.length).toBe(0);
    });

    it('should contain 1 .dl-abdtp-active element for the current hour', () => {
      const currentElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-active'));
      expect(currentElements.length).toBe(1);
      expect(currentElements[0].nativeElement.textContent.trim()).toBe(moment().startOf('hour').format('LT'));
      expect(currentElements[0].nativeElement.classList).toContain(moment().startOf('hour').valueOf().toString());
    });

    it('should contain 1 [tabindex=1] element', () => {
      const tabIndexElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-hour[tabindex="0"]'));
      expect(tabIndexElements.length).toBe(1);
    });

    it('should contain 1 .dl-abdtp-selected element for the current value', () => {
      component.picker.value = moment().startOf('hour').valueOf();
      fixture.detectChanges();

      // Bug: The value change is not detected until there is some user interaction
      // **ONlY** when there is no ngModel binding on the component.
      // I think it is related to https://github.com/angular/angular/issues/10816
      const activeElement = debugElement.query(By.css('.dl-abdtp-active')).nativeElement;
      activeElement.focus();
      dispatchKeyboardEvent(activeElement, 'keydown', HOME);
      fixture.detectChanges();

      const currentElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-selected'));
      expect(currentElements.length).toBe(1);
      expect(currentElements[0].nativeElement.textContent.trim()).toBe(moment().startOf('hour').format('LT'));
      expect(currentElements[0].nativeElement.classList).toContain(moment().startOf('hour').valueOf().toString());
    });
  });

  describe('ngModel=2018-01-26T15:53:27Z', () => {
    let component: HourStartViewWithNgModelComponent;
    let fixture: ComponentFixture<HourStartViewWithNgModelComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(HourStartViewWithNgModelComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        nativeElement = debugElement.nativeElement;
      });
    }));

    it('should contain .dl-abdtp-view-label element with "2018"', () => {
      const viewLabel = fixture.debugElement.query(By.css('.dl-abdtp-view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('Jan 26, 2018');
    });

    it('should contain 24 .dl-abdtp-hour elements with start of hour utc time as class and role of gridcell', () => {

      const expectedClass = new Array(24)
        .fill(0)
        .map((value, index) => new Date(2018, JAN, 26, index).getTime());

      const hourElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-hour'));
      expect(hourElements.length).toBe(24);

      hourElements.forEach((hourElement, index) => {
        const key = expectedClass[index];
        const ariaLabel = moment(key).format('LLL');
        expect(hourElement.nativeElement.classList).toContain(key.toString(10));
        expect(hourElement.attributes['role']).toBe('gridcell', index);
        expect(hourElement.attributes['aria-label']).toBe(ariaLabel, index);
      });
    });

    it('.dl-abdtp-left-button should contain a title', () => {
      const leftButton = fixture.debugElement.query(By.css('.dl-abdtp-left-button'));
      expect(leftButton.attributes['title']).toBe('Go to Jan 25, 2018');
    });

    it('.dl-abdtp-left-button should contain aria-label', () => {
      const leftButton = fixture.debugElement.query(By.css('.dl-abdtp-left-button'));
      expect(leftButton.attributes['aria-label']).toBe('Go to Jan 25, 2018');
    });

    it('should have a class for previous month value on .dl-abdtp-left-button ', () => {
      const leftButton = fixture.debugElement.query(By.css('.dl-abdtp-left-button'));
      expect(leftButton.nativeElement.classList).toContain(new Date(2018, JAN, 25).getTime().toString());
    });

    it('should switch to previous month value after clicking .dl-abdtp-left-button', () => {
      const leftButton = fixture.debugElement.query(By.css('.dl-abdtp-left-button'));
      leftButton.nativeElement.click();
      fixture.detectChanges();

      const viewLabel = fixture.debugElement.query(By.css('.dl-abdtp-view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('Jan 25, 2018');

      const hourElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-hour'));
      expect(hourElements[0].nativeElement.textContent.trim()).toBe('12:00 AM');
      expect(hourElements[0].nativeElement.classList).toContain(new Date(2018, JAN, 25).getTime().toString());
    });

    it('.dl-abdtp-right-button should contain a title', () => {
      const leftButton = fixture.debugElement.query(By.css('.dl-abdtp-right-button'));
      expect(leftButton.attributes['title']).toBe('Go to Jan 27, 2018');
    });

    it('.dl-abdtp-right-button should contain aria-label', () => {
      const leftButton = fixture.debugElement.query(By.css('.dl-abdtp-right-button'));
      expect(leftButton.attributes['aria-label']).toBe('Go to Jan 27, 2018');
    });

    it('should have a class for previous month value on .dl-abdtp-right-button ', () => {
      const leftButton = fixture.debugElement.query(By.css('.dl-abdtp-right-button'));
      expect(leftButton.nativeElement.classList).toContain(new Date(2018, JAN, 27).getTime().toString());
    });

    it('should switch to next month value after clicking .dl-abdtp-right-button', () => {
      const rightButton = fixture.debugElement.query(By.css('.dl-abdtp-right-button'));
      rightButton.nativeElement.click();
      fixture.detectChanges();

      const viewLabel = fixture.debugElement.query(By.css('.dl-abdtp-view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('Jan 27, 2018');

      const hourElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-hour'));
      expect(hourElements[0].nativeElement.textContent.trim()).toBe('12:00 AM');
      expect(hourElements[0].nativeElement.classList).toContain(new Date(2018, JAN, 27).getTime().toString());
    });

    it('.dl-abdtp-up-button should contain a title', () => {
      const leftButton = fixture.debugElement.query(By.css('.dl-abdtp-up-button'));
      expect(leftButton.attributes['title']).toBe('Go to Jan 2018');
    });

    it('.dl-abdtp-up-button should contain aria-label', () => {
      const leftButton = fixture.debugElement.query(By.css('.dl-abdtp-up-button'));
      expect(leftButton.attributes['aria-label']).toBe('Go to Jan 2018');
    });

    it('should switch to day view after clicking .dl-abdtp-up-button', () => {
      const upButton = fixture.debugElement.query(By.css('.dl-abdtp-up-button'));
      upButton.nativeElement.click();
      fixture.detectChanges();

      const viewLabel = fixture.debugElement.query(By.css('.dl-abdtp-view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('Jan 2018');

      const monthView = fixture.debugElement.query(By.css('.dl-abdtp-day-view'));
      expect(monthView).toBeTruthy();
    });

    it('should not emit a change event when clicking .dl-abdtp-hour', () => {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      const hourElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-hour'));
      hourElements[0].nativeElement.click();
      fixture.detectChanges();

      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('should change to .dl-abdtp-minute-view when selecting .dl-abdtp-hour', () => {
      const hourElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-hour'));
      hourElements[14].nativeElement.click(); //  2:00 PM
      fixture.detectChanges();

      const hourView = fixture.debugElement.query(By.css('.dl-abdtp-hour-view'));
      expect(hourView).toBeFalsy();

      const minuteView = fixture.debugElement.query(By.css('.dl-abdtp-minute-view'));
      expect(minuteView).toBeTruthy();
    });

    it('should have one .dl-abdtp-active element', () => {
      const activeElements = fixture.debugElement.queryAll(By.css('.dl-abdtp-active'));
      expect(activeElements.length).toBe(1);
    });

    it('should change .dl-abdtp-active element on right arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('3:00 PM');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(newActiveElement.nativeElement.textContent).toBe('4:00 PM');
    });

    it('should change to next day when last .dl-abdtp-hour is .dl-abdtp-active element and pressing on right arrow', () => {
      (component.picker as any)._model.activeDate = new Date(2018, JAN, 26, 23).getTime();
      fixture.detectChanges();

      dispatchKeyboardEvent(fixture.debugElement.query(By.css('.dl-abdtp-active')).nativeElement, 'keydown', RIGHT_ARROW); // 2018
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('12:00 AM');

      const viewLabel = fixture.debugElement.query(By.css('.dl-abdtp-view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('Jan 27, 2018');
    });

    it('should change .dl-abdtp-active element on left arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('3:00 PM');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', LEFT_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(newActiveElement.nativeElement.textContent).toBe('2:00 PM');
    });

    it('should change to previous day when first .dl-abdtp-hour is .dl-abdtp-active element and pressing on left arrow', () => {
      (component.picker as any)._model.activeDate = new Date(2018, JAN, 26).getTime();
      fixture.detectChanges();

      dispatchKeyboardEvent(fixture.debugElement.query(By.css('.dl-abdtp-active')).nativeElement, 'keydown', LEFT_ARROW); // 2019
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('11:00 PM');

      const viewLabel = fixture.debugElement.query(By.css('.dl-abdtp-view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('Jan 25, 2018');
    });

    it('should change .dl-abdtp-active element on up arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('3:00 PM');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', UP_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(newActiveElement.nativeElement.textContent).toBe('11:00 AM');
    });

    it('should change to previous day when first .dl-abdtp-hour is .dl-abdtp-active element and pressing on up arrow', () => {
      (component.picker as any)._model.activeDate = new Date(2018, JAN, 26).getTime();
      fixture.detectChanges();

      dispatchKeyboardEvent(fixture.debugElement.query(By.css('.dl-abdtp-active')).nativeElement, 'keydown', UP_ARROW); // 2019
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('8:00 PM');

      const viewLabel = fixture.debugElement.query(By.css('.dl-abdtp-view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('Jan 25, 2018');
    });

    it('should change .dl-abdtp-active element on down arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('3:00 PM');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', DOWN_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(newActiveElement.nativeElement.textContent).toBe('7:00 PM');
    });

    it('should change .dl-abdtp-active element on page-up (fn+up-arrow)', () => {
      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('3:00 PM');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', PAGE_UP);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(newActiveElement.nativeElement.textContent).toBe('3:00 PM');

      const viewLabel = fixture.debugElement.query(By.css('.dl-abdtp-view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('Jan 25, 2018');
    });

    it('should change .dl-abdtp-active element on page-down (fn+down-arrow)', () => {
      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('3:00 PM');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', PAGE_DOWN);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(newActiveElement.nativeElement.textContent).toBe('3:00 PM');

      const viewLabel = fixture.debugElement.query(By.css('.dl-abdtp-view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('Jan 27, 2018');
    });

    it('should change .dl-abdtp-active element to first .dl-abdtp-hour on HOME', () => {
      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('3:00 PM');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', HOME);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(newActiveElement.nativeElement.textContent).toBe('12:00 AM');
    });

    it('should change .dl-abdtp-active element to last .dl-abdtp-hour on END', () => {
      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('3:00 PM');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', END);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(newActiveElement.nativeElement.textContent).toBe('11:00 PM');
    });

    it('should do nothing when hitting non-supported key', () => {
      fixture.detectChanges();

      let activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('3:00 PM');

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', 65); // A
      fixture.detectChanges();

      activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));
      expect(activeElement.nativeElement.textContent).toBe('3:00 PM');
    });

    it('should change to .dl-abdtp-minute-view when hitting ENTER', () => {
      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', ENTER, 'enter');
      fixture.detectChanges();

      const hourView = fixture.debugElement.query(By.css('.dl-abdtp-hour-view'));
      expect(hourView).toBeFalsy();

      const minuteView = fixture.debugElement.query(By.css('.dl-abdtp-minute-view'));
      expect(minuteView).toBeTruthy();
    });

    it('should change to .dl-abdtp-minute-view when hitting SPACE', () => {
      const activeElement = fixture.debugElement.query(By.css('.dl-abdtp-active'));

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', SPACE, 'space');
      fixture.detectChanges();

      const hourView = fixture.debugElement.query(By.css('.dl-abdtp-hour-view'));
      expect(hourView).toBeFalsy();

      const minuteView = fixture.debugElement.query(By.css('.dl-abdtp-minute-view'));
      expect(minuteView).toBeTruthy();
    });
  });
});
