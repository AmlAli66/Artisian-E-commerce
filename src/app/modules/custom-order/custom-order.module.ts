import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomOrderWizardComponent } from '../../components/custom-order/custom-order-wizard.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CustomOrderWizardComponent
  ],
  exports: [
    CustomOrderWizardComponent
  ]
})
export class CustomOrderModule { } 