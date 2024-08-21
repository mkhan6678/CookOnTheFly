import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CookOnTheFlyproxyService} from "../cook-on-the-flyproxy.service";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthenticationService} from "../authentication.service";

@Component({
  selector: 'app-recipe-created-by-user',
  templateUrl: './recipe-created-by-user.component.html',
  styleUrl: './recipe-created-by-user.component.css'
})
export class RecipeCreatedByUserComponent implements OnInit {
  userRecipes: any[] = [];
  errorMessage: string = '';
  pageTitle: string = 'Recipes Created By User';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService$: CookOnTheFlyproxyService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    // Log to check if component initialization is happening
    console.log('Recipe Created By User Component Initialized');
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        console.log('User logged in');
      } else {
        console.log('User not logged in');
      }
    });

    // Subscribe to route query params to get the userId
    this.route.queryParams.subscribe(params => {
      // Log the route params to check if 'userId' is present
      console.log('Route Params:', params);

      // Extract the 'userId' parameter
      //const userId = params['id'];

      // Check if userIdParam is present
      // if (userId) {
      //   // Log the userIdParam to ensure it is correct
      //   console.log('User ID:', userId);

        // Call the service method to fetch recipes based on userId
        this.recipeService$.getRecipeCreatedByUserId().subscribe(
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
      // } else {
      //   this.errorMessage = 'User ID not provided.';
      // }
    });
  }

  onSubmit(recipeId: String) {
    // Navigate to a new route and pass the recipe ID as a parameter
    this.router.navigate(['recipe', recipeId]);
  }
}
