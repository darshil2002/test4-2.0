import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { InventoryComponent } from 'app/modules/admin/apps/ecommerce/inventory/inventory.component';
import { InventoryListComponent } from 'app/modules/admin/apps/ecommerce/inventory/list/inventory.component';
import { ecommerceRoutes } from 'app/modules/admin/apps/ecommerce/ecommerce.routing';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
@NgModule({
    declarations: [
        InventoryComponent,
        InventoryListComponent
    ],
    imports     : [
        RouterModule.forChild(ecommerceRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSortModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule,
        SharedModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgMultiSelectDropDownModule.forRoot()
    ]
})
export class ECommerceModule
{
}
