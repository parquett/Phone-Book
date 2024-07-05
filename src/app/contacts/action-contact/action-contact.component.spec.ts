import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionContactComponent } from './action-contact.component';

describe('ActionContactComponent', () => {
  let component: ActionContactComponent;
  let fixture: ComponentFixture<ActionContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionContactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
