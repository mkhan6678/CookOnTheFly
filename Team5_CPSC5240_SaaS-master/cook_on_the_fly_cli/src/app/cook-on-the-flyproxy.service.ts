import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CookOnTheFlyproxyService {

  //host URL for express server
  hostUrl:string = "https://cookonthefly.azurewebsites.net/";

  //host URL for testing
  // hostUrl: string = "http://localhost:8080/";

  constructor(private httpClient: HttpClient) { }

  /**
   * Get a single recipe by ID
   * @param id Recipe ID
   */
  getRecipeDetails(id: number) {
    return this.httpClient.get(this.hostUrl + 'api/recipe/' + id);
  }

  /**
   * Get the ingredients details and feedback for a single recipe
   * @param id Recipe ID
   */
  getRecipeIngredientsAndFeedback(id:number) {
    return this.httpClient.get(this.hostUrl + 'api/recipe/' + id + '/feedbackandingredients')
  }

  /**
   * Get all ingredients list to show in the search by ingredients page
   */
  getAllIngredients(){
    console.log("queryParams",this.hostUrl + 'ingredient/')
    return this.httpClient.get(this.hostUrl + 'api/ingredient/');
  }

  /**
   * Get a single recipe based on input list of Ingredients. Recipe ingredients must be a subset of the input ingredients
   * @param ingredients List of ingredients IDs to search by
   */
  getRecipeBasedOnIngredients(ingredients: number[]) {
    const queryParams = ingredients.join(','); // Construct the query string with ingredients
    console.log("queryParams",queryParams)
    return this.httpClient.get(this.hostUrl + 'api/recipe?ingredients=' + queryParams);
  }

  /**
   * Get all recipes in DB to show on all recipes page
   */
  getAllRecipes() {
    console.log("Get all recipes");
    return this.httpClient.get(this.hostUrl + 'api/recipe/');
  }

  /**
   * Get recipes in DB created by the user id
   */
  getRecipeCreatedByUserId() {
    console.log("Get recipes created by the user");
    return this.httpClient.get(this.hostUrl + 'api/created-recipe')
  }

  /**
   * Get recipes in DB saved by the user id
   */
  getRecipesSavedByUserId() {
    console.log("Get recipes saved by the user");
    return this.httpClient.get(this.hostUrl + 'api/saved-recipe');
  }



  ngOnInit() {
  }
}
