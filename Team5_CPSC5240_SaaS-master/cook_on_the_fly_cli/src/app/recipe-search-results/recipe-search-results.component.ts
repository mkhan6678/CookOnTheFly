import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookOnTheFlyproxyService } from '../cook-on-the-flyproxy.service';
import { HttpErrorResponse } from "@angular/common/http";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-recipe-search-results',
  templateUrl: './recipe-search-results.component.html',
  styleUrls: ['./recipe-search-results.component.css']
})
export class RecipeSearchResultsComponent implements OnInit {
  recipeIngredients: any[] = [];
  errorMessage: string = '';
  searchText: string = '';
  allRecipes: any[] = [];
  showSearchBar: boolean = false;
  pageTitle: string = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService$: CookOnTheFlyproxyService
  ) {}

  ngOnInit() {
    // Log to check if component initialization is happening
    console.log('Recipe Search Results Component Initialized');

    // Subscribe to route query params to get the query
    this.route.queryParams.subscribe(params => {
      // Log the route params to check if 'ingredients' is present
      console.log('Route Params:', params);

      // Extract the 'ingredients' parameter
      const ingredientsParam = params['ingredients'];

      // Check if ingredientsParam is present
      if (ingredientsParam) {
        // Log the ingredientsParam to ensure it's correct
        console.log('Ingredients:', ingredientsParam);
        this.pageTitle = "Search Results";

        // Split the ingredientsParam string into an array of numbers
        const ingredients = ingredientsParam.split(',').map(Number);

        // Call the service method to fetch recipes based on ingredients
        this.recipeService$.getRecipeBasedOnIngredients(ingredients).subscribe(
          (res: any) => {
            // Assign the retrieved recipes to recipeIngredients
            this.recipeIngredients = res;
          },
          (error: HttpErrorResponse) => {
            if (error.status === 404) {
              this.errorMessage = 'Recipes not found.';
            } else if (error.status === 500) {
              console.error('Error fetching recipes:', error);
              this.errorMessage = 'Server Error: ' + error.message;
            }
          }
        );
      }
      else
      {

        this.showSearchBar = true;
        //Call to get all recipes
        this.recipeService$.getAllRecipes().subscribe(
          (res: any) => {
            // Assign the retrieved recipes to recipeIngredients and allRecipes
            this.recipeIngredients = res;
            this.allRecipes = res;
            this.pageTitle = 'All Recipes';
          },
          (error: HttpErrorResponse) => {
            if (error.status === 404) {
              this.errorMessage = 'Recipes not found.';
            } else if (error.status === 500) {
              console.error('Error fetching recipes:', error);
              this.errorMessage = 'Server Error: ' + error.message;
            }
          }
        );
      }
    });
  }

  onSubmit(recipeId: number) {
    // Navigate to a new route and pass the recipe ID as a parameter
    this.router.navigate(['/recipe', recipeId]);
  }

  onSearch() {
    if (this.searchText) {
      this.recipeIngredients = this.allRecipes.filter(recipe =>
        recipe.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      // If searchText is empty, assign allRecipes to recipeIngredients
      this.recipeIngredients = [...this.allRecipes];
    }
  }
}
