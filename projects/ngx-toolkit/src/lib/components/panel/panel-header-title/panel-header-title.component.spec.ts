import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelHeaderTitleComponent } from './panel-header-title.component';

describe('PanelHeaderTitleComponent', () => {
  let component: PanelHeaderTitleComponent;
  let fixture: ComponentFixture<PanelHeaderTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelHeaderTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelHeaderTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
