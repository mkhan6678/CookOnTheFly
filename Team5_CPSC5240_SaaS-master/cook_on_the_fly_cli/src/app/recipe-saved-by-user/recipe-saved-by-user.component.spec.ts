import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeSavedByUserComponent } from './recipe-saved-by-user.component';

describe('RecipeSavedByUserComponent', () => {
  let component: RecipeSavedByUserComponent;
  let fixture: ComponentFixture<RecipeSavedByUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeSavedByUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecipeSavedByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
