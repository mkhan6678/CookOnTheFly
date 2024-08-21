import { catchError, throwError } from 'rxjs';
import { Component } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { CookOnTheFlyproxyService } from '../cook-on-the-flyproxy.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpErrorResponse } from "@angular/common/http";

interface Ingredient {
  id: number;
  name: string;
  selected: boolean;
}

interface IngredientCategory {
  [key: string]: Ingredient[];
}

@Component({
  selector: 'app-ingredients-list',
  templateUrl: './ingredients-list.component.html',
  styleUrls: ['./ingredients-list.component.css']
})
export class IngredientsListComponent {
  errorMessage: string = "";
  ingredients: IngredientCategory = {};
  originalIngredients: IngredientCategory = {};
  selectedIngredients: Ingredient[] = [];
  searchText: string = '';

  constructor(
    private route: ActivatedRoute,
    private recipe$: CookOnTheFlyproxyService,
    private location: LocationStrategy,
    private router: Router
  ) {
    this.recipe$.getAllIngredients().pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.errorMessage = error.status + ' Recipe not found.'; // Set custom error message
        } else if (error.status === 500) {
          console.error('Error fetching recipe:', error);
          this.errorMessage = error.status + " " + error.message;
        }
        return throwError(error); // Rethrow the error
      })
    ).subscribe((res: any) => {
      this.ingredients = res.reduce((acc: IngredientCategory, curr: { ingredientId: number, name: string, category: string }) => {
        if (!acc[curr.category]) {
          acc[curr.category] = [];
        }
        acc[curr.category].push({ id: curr.ingredientId, name: curr.name, selected: false });
        return acc;
      }, {});
      this.originalIngredients = JSON.parse(JSON.stringify(this.ingredients));
      console.log(this.ingredients);
    });
  }

  onIngredientToggle(ingredient: Ingredient) {
    ingredient.selected = !ingredient.selected;
    const index = this.selectedIngredients.findIndex(i => i.id === ingredient.id);
    if (index > -1) {
      this.selectedIngredients.splice(index, 1);
    } else {
      this.selectedIngredients.push(ingredient);
    }
  }

  onSearch() {
    if (this.searchText) {
      for (let category in this.ingredients) {

        this.ingredients[category] = this.originalIngredients[category].filter(ingredient =>
          ingredient.name.toLowerCase().includes(this.searchText.toLowerCase())
        );

      }
    } else {
      this.ingredients = JSON.parse(JSON.stringify(this.originalIngredients));
    }
  }

  onSubmit() {
    // Navigate to a new page with the selected ingredients as query parameters
    const ingredientIds = this.selectedIngredients.map(i => i.id).join(',');
    this.router.navigate(['/recipe'], { queryParams: { ingredients: ingredientIds } });
  }
}
