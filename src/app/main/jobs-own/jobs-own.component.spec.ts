import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsOwnComponent } from './jobs-own.component';

describe('JobsOwnComponent', () => {
  let component: JobsOwnComponent;
  let fixture: ComponentFixture<JobsOwnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobsOwnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsOwnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
