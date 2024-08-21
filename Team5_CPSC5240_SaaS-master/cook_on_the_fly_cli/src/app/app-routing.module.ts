import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { IngredientsListComponent} from './ingredients-list/ingredients-list.component';
import {RecipeDetailsComponent} from "./recipe-details/recipe-details.component";
import {RecipeSearchResultsComponent} from "./recipe-search-results/recipe-search-results.component";
import {PrivacyPolicyComponent} from "./privacy-policy/privacy-policy.component";
import {AboutComponent} from "./about/about.component";
import {ContactUsComponent} from "./contact-us/contact-us.component";
import {RecipeCreatedByUserComponent} from "./recipe-created-by-user/recipe-created-by-user.component";
import {RecipeSavedByUserComponent} from "./recipe-saved-by-user/recipe-saved-by-user.component";

//Routes to our app pages
const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'ingredients', component: IngredientsListComponent},
  {path: 'recipe/:id', component: RecipeDetailsComponent},
  {path: 'recipe', component: RecipeSearchResultsComponent},
  {path: 'privacy-policy', component: PrivacyPolicyComponent},
  {path: 'about', component: AboutComponent},
  {path: 'contact-us', component: ContactUsComponent},

  {path: 'created-recipe', component: RecipeCreatedByUserComponent},
  {path: 'saved-recipe', component: RecipeSavedByUserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
