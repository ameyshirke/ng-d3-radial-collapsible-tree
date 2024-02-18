import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsibleRadialTreeComponent } from './collapsible-radial-tree.component';

describe('CollapsibleRadialTreeComponent', () => {
  let component: CollapsibleRadialTreeComponent;
  let fixture: ComponentFixture<CollapsibleRadialTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollapsibleRadialTreeComponent]
    });
    fixture = TestBed.createComponent(CollapsibleRadialTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
