import {catchError, Observable, throwError} from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { CookOnTheFlyproxyService } from '../cook-on-the-flyproxy.service';
import { ActivatedRoute, Params } from '@angular/router';
import {HttpErrorResponse} from "@angular/common/http";



@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.css'

})
export class RecipeDetailsComponent {
  recipeId: number;
  recipeDetails: any;
  recipeFeedback: any;
  recipeIngredients: any;
  errorMessage: string = "";

  /**
   * Constructor for the component
   * @param route route handle used to extract params
   * @param recipe$ handle for proxy service to be used to make calls to backend
   * @param location
   */
  constructor(private route: ActivatedRoute,
              private recipe$: CookOnTheFlyproxyService,
              private location: LocationStrategy)
  {

    //Get ID from the URL
    this.recipeId = route.snapshot.params['id']
    console.log(this.recipeId);

    //Make call to service to get the recipe details
    this.recipe$.getRecipeDetails(this.recipeId).pipe(catchError((error: HttpErrorResponse) => {
      //Handle errors returned by service
      if (error.status === 404) {
        this.errorMessage = 'Recipe not found.'; // Set custom error message
      }
      else if (error.status === 500)
      {
        this.errorMessage = error.status + " " + error.message;
        console.error('Error fetching recipe:', error);
      }
      return throwError(error); // Rethrow the error
    })).subscribe((res: any) => {
      //Assign returned values to show in HTML
      this.recipeDetails = res;
      this.recipeDetails.description = this.recipeDetails.description.split('\n');
      // this.recipeDetails.description = this.recipeDetails.description.replace(/\n/g, '<br>');
      console.log(this.recipeDetails);
    });

    //Make call to get recipe ingredients list and Feedback
    this.recipe$.getRecipeIngredientsAndFeedback(this.recipeId).pipe(catchError((error: HttpErrorResponse) => {
      if (error.status === 404)
      {
        this.errorMessage = error.status + ' Recipe not found.'; // Set custom error message
      }
      else if (error.status === 500)
      {
        console.error('Error fetching recipe:', error);
        this.errorMessage = error.status + " " + error.message;
      }
      return throwError(error); // Rethrow the error
    })).subscribe((res: any) => {
      this.recipeFeedback = res.feedback.feedbacks;
      this.recipeIngredients = res.ingredients;
      // this.recipeDetails.description = this.recipeDetails.description.replace(/\n/g, '<br>');
      console.log(this.recipeDetails);
    });
  }
    ngOnInit() {
    }
}
