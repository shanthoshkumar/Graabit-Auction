import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactusComponent } from './contactus/contactus.component';
import { HowitworksComponent } from './howitworks/howitworks.component';
import { TermsComponent } from './terms/terms.component';
import { SignupComponent } from './signup/signup.component';
import { ChangeownerComponent } from './changeowner/changeowner.component';
import { CreateAuctionComponent } from './create-auction/create-auction.component';
import { SetresultComponent } from './setresult/setresult.component';
import { SendcreditsComponent } from './sendcredits/sendcredits.component';
import { MydealsComponent } from './mydeals/mydeals.component';
import { SignupLoginGuard } from './guard/signup-login.guard';
import { MydealsGuard } from './guard/mydeals.guard';
import { OwnerGuard } from './guard/owner.guard';
import { SigningoutComponent } from './signingout/signingout.component';
import { RegistrationdetailsComponent } from './registrationdetails/registrationdetails.component';
import { MyexpireddealsComponent } from './myexpireddeals/myexpireddeals.component';
const routes: Routes = [
  {
    path:'home',
    component:HomeComponent,
    children:  [{
      path:'**',
      redirectTo:'home'
    }]
  },
  {
    path:'signup',
    component:SignupComponent,
    canActivate:[SignupLoginGuard]
  }, 
  {
    path:'contactus',
    component:ContactusComponent,
    children:  [{
      path:'**',
      redirectTo:'home'
    }]
  },
  {
    path:'howitworks',
    component:HowitworksComponent,
    children:  [{
      path:'**',
      redirectTo:'home'
    }]
  },
  {
    path:'terms',
    component:TermsComponent,
    children:  [{
      path:'**',
      redirectTo:'home'
    }]
  },
  {
    path:'changeowner',
    component:ChangeownerComponent,
    canActivate:[OwnerGuard]
  },
  {
    path:'createAuction',
    component:CreateAuctionComponent,
    canActivate:[OwnerGuard]
  },
  {
    path:'sendcredits',
    component:SendcreditsComponent,
    canActivate:[OwnerGuard]
  },
  {
    path:'setresult',
    component:SetresultComponent,
    canActivate:[OwnerGuard]
  },
  {
    path:'regdetails',
    component:RegistrationdetailsComponent,
    canActivate:[OwnerGuard]
  },
  {
    path:'mydeals',
    component:MydealsComponent,
    children:[{
      path:'myexpdeals',
      component:MyexpireddealsComponent,
      canActivateChild:[MydealsGuard]
    }],
    canActivate:[MydealsGuard],
  },
  {
    path:'signingout',
    component:SigningoutComponent
  },
  {
    path:'',
    redirectTo:'home',
    pathMatch:'full'
  },
  {
    path:'**',
    redirectTo:'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
