import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelHeaderActionsComponent } from './panel-header-actions.component';

describe('PanelHeaderActionsComponent', () => {
  let component: PanelHeaderActionsComponent;
  let fixture: ComponentFixture<PanelHeaderActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelHeaderActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelHeaderActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
