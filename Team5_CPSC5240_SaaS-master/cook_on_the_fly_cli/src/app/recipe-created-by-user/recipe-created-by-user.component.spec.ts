import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCreatedByUserComponent } from './recipe-created-by-user.component';

describe('RecipeCreatedByUserComponent', () => {
  let component: RecipeCreatedByUserComponent;
  let fixture: ComponentFixture<RecipeCreatedByUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeCreatedByUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecipeCreatedByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
