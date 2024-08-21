
//Http Client for communication and browser modules/services for presentation
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

//Components imported for the app, our created components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { IngredientsListComponent } from './ingredients-list/ingredients-list.component';
import { RecipeSearchResultsComponent } from './recipe-search-results/recipe-search-results.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contact-us/contact-us.component'
import { CookOnTheFlyproxyService } from './cook-on-the-flyproxy.service';

//Pipes
import { FilterPipe } from './filter.pipe';

//Material view modules for UI
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {
  MatCard, MatCardContent,
  MatCardHeader,
  MatCardImage, MatCardLgImage,
  MatCardMdImage,
  MatCardTitle,
  MatCardXlImage,
} from "@angular/material/card";
import {MatList, MatListItem, MatListOption} from "@angular/material/list";
import {MatDrawer} from "@angular/material/sidenav";
import {MatCarouselModule} from "material2-carousel";
import {CarouselModule} from 'ngx-bootstrap/carousel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatGridList} from "@angular/material/grid-list";
import { RecipeCreatedByUserComponent } from './recipe-created-by-user/recipe-created-by-user.component';
import { RecipeSavedByUserComponent } from './recipe-saved-by-user/recipe-saved-by-user.component';
import {AuthenticationService} from "./authentication.service";


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    IngredientsListComponent,
    RecipeSearchResultsComponent,
    RecipeDetailsComponent,
    PrivacyPolicyComponent,
    AboutComponent,
    ContactUsComponent,
    FilterPipe,
    RecipeCreatedByUserComponent,
    RecipeSavedByUserComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatCard,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatList,
    MatListItem,
    MatDrawer,
    MatCardMdImage,
    MatCardXlImage,
    MatCardImage,
    CarouselModule.forRoot(),
    MatCardContent,
    MatCardLgImage,
    MatCarouselModule,
    MatGridList,
    MatListOption,
    MatTableModule,
    MatSortModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],

  providers: [CookOnTheFlyproxyService, AuthenticationService, provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
