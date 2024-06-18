import { Component, OnInit, SimpleChanges, ViewChild, viewChild } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { ClientInfoComponent } from '../components/client-info/client-info.component';
import { InstallationSiteComponent } from '../components/installation-site/installation-site.component';
import { MatIconModule } from '@angular/material/icon';
import { SupplierInfoComponent } from '../components/supplier-info/supplier-info.component';
import { ProductInfoComponent } from '../components/product-info/product-info.component';
import { ActivatedRoute } from '@angular/router';
import { AdditionalInfoComponent } from '../components/additional-info/additional-info.component';

@Component({
  selector: 'app-system-modify',
  templateUrl: './system-modify.component.html',
  styleUrl: './system-modify.component.scss',
  standalone: true,
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ClientInfoComponent,
    InstallationSiteComponent,
    MatIconModule,
    SupplierInfoComponent,
    ProductInfoComponent,
    AdditionalInfoComponent,
  ],
})
export class SystemModifyComponent {

  isValid: boolean = true;
  incomplete: boolean = true;
  systemName: string = '';

  @ViewChild('client') obj_client!: ClientInfoComponent;
  @ViewChild('installationSite') obj_installationSite!: InstallationSiteComponent;
  @ViewChild('supplier') obj_supplier!: SupplierInfoComponent;
  @ViewChild('product') obj_product!: ProductInfoComponent;

  clientFormGroup!: FormGroup;
  installationSiteFormGroup!: FormGroup;
  supplierInfoFormGroup!: FormGroup;
  productInfoFormGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.systemName = params['name'];
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.clientFormGroup = this.obj_client.clientFormGroup;
    this.installationSiteFormGroup = this.obj_installationSite.installationSiteForm;
    this.supplierInfoFormGroup = this.obj_supplier.supplierFormGroup;
    this.productInfoFormGroup = this.obj_product.productFormGroup;
  }
}
