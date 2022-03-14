import {ComponentFixture, TestBed} from '@angular/core/testing';

import {JobsApplicationsComponent} from './jobs-applications.component';

describe('JobsApplicationsComponent', () => {
  let component: JobsApplicationsComponent;
  let fixture: ComponentFixture<JobsApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobsApplicationsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
