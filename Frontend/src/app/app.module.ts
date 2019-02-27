import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import {MatTableModule} from '@angular/material/table';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ContactusComponent } from './contactus/contactus.component';
import { HowitworksComponent } from './howitworks/howitworks.component';
import { TermsComponent } from './terms/terms.component';
import { SignupComponent } from './signup/signup.component';
import { CreateAuctionComponent } from './create-auction/create-auction.component';
import { ChangeownerComponent } from './changeowner/changeowner.component';
import { SendcreditsComponent } from './sendcredits/sendcredits.component';
import { SetresultComponent } from './setresult/setresult.component';
import { MydealsComponent } from './mydeals/mydeals.component';
import { SigningoutComponent } from './signingout/signingout.component';
import { RegistrationdetailsComponent } from './registrationdetails/registrationdetails.component';
import { ClosedComponent } from './closed/closed.component';
import { UpcomingComponent } from './upcoming/upcoming.component';
import { LiveComponent } from './live/live.component';
import { MydealsproductComponent } from './mydealsproduct/mydealsproduct.component';
import { MyexpireddealsComponent } from './myexpireddeals/myexpireddeals.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactusComponent,
    SignupComponent,
    HowitworksComponent,
    TermsComponent,
    SignupComponent,
    CreateAuctionComponent,
    ChangeownerComponent,
    SendcreditsComponent,
    SetresultComponent,
    MydealsComponent,
    SigningoutComponent,
    RegistrationdetailsComponent,
    ClosedComponent,
    UpcomingComponent,
    LiveComponent,
    MydealsproductComponent,
    MyexpireddealsComponent
  ],
  imports: [
    BrowserModule,
    Ng4LoadingSpinnerModule,
    AppRoutingModule,
    HttpClientModule,
    MatTableModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
