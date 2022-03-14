import {ComponentFixture, TestBed} from '@angular/core/testing';

import {JobsPostedComponent} from './jobs-posted.component';

describe('JobsOwnComponent', () => {
  let component: JobsPostedComponent;
  let fixture: ComponentFixture<JobsPostedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobsPostedComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsPostedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
