import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CookOnTheFlyproxyService} from "../cook-on-the-flyproxy.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-recipe-saved-by-user',
  templateUrl: './recipe-saved-by-user.component.html',
  styleUrl: './recipe-saved-by-user.component.css'
})
export class RecipeSavedByUserComponent implements OnInit {
  userRecipes: any[] = [];
  errorMessage: string = '';
  pageTitle: string = 'Recipes Saved By User';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService$: CookOnTheFlyproxyService
  ) {}

  ngOnInit() {
    // Log to check if component initialization is happening
    console.log('Recipe Saved By User Component Initialized');

    // Subscribe to route query params to get the userId
    this.route.queryParams.subscribe(params => {
      // Log the route params to check if 'userId' is present
      // console.log('Route Params:', params);

      // Extract the 'userId' parameter
      // const userId = params['id'];

      // Check if userIdParam is present
       // Log the userIdParam to ensure it's correct
      this.recipeService$.getRecipesSavedByUserId().subscribe(
        (res: any) => {
          // Assign the retrieved recipes to userRecipes
          this.userRecipes = res;
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
    });
  }

  onSubmit(recipeId: String) {
    // Navigate to a new route and pass the recipe ID as a parameter
    this.router.navigate(['/recipe', recipeId]);
  }
}
