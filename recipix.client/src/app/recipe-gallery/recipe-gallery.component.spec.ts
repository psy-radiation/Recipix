import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeGalleryComponent } from './recipe-gallery.component';

describe('RecipeGalleryComponent', () => {
  let component: RecipeGalleryComponent;
  let fixture: ComponentFixture<RecipeGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
