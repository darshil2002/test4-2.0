import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, pluck, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, InventoryTag, InventoryVendor } from 'app/modules/admin/apps/ecommerce/inventory/inventory.types';
import { InventoryService } from 'app/modules/admin/apps/ecommerce/inventory/inventory.service';
import { Config, DataToSend, Root } from '../../../buildingInterface';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

// dropdown imports 


@Component({
    selector       : 'inventory-list',
    templateUrl    : './inventory.component.html',
    styles         : [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 112px auto 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px 112px auto 112px 96px 96px 72px;
                }
            }
        `
    ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations
})
export class InventoryListComponent implements OnInit, AfterViewInit, OnDestroy
{

    /* edit data form data */

    editData:DataToSend={
        BuildingNo: 0,
        /* BuildingNo: 0, */
        BuildingName: '',
        Description: '',
        Date_constructed: '',
        Architect: '',
        Contractor: '',
        Construction_Cost: 0,
        Renovation_History:'',
        Campus: 'ecc7a770-1d53-4f6f-8507-03eca95dc4bf',
        Zone: 'south',
        wing: '3',
        IsActive: false,
        BuildingImage: 'image.hrf'
        }

    /* npms .....  */

    dropdownList = [];
    selectedItems = [];
    dropdownSettings:IDropdownSettings 
    dropdownList2 = [];
    selectedItems2 = [];
    dropdownSettings2:IDropdownSettings 
    /* picker:any;
    matDatepicker:any; */
    selectedItem: { name: string, campusId: string }
    newArray:[];
    /* newArray:any=[{name:'darsh',campusId:'xyz'},{name:'rahul',campusId:'u'}] */
    zonesTemp:any=[];
    wingTemp:any[]=[];
    darshilAllData:Config[]=[]
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    products$: Observable<InventoryProduct[]>;

    brands: InventoryBrand[];
    categories: InventoryCategory[];
    filteredTags: InventoryTag[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: InventoryPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedProduct: InventoryProduct | null = null;
    selectedProductForm: UntypedFormGroup;
    tags: InventoryTag[];
    tagsEditMode: boolean = false;
    vendors: InventoryVendor[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    shareDataId:any;

/* DataToBeSent:DataToSend={
BuildingNo: 0,
BuildingName: '',
Description: '',
Date_constructed: '',
Architect: '',
Contractor: '',
Construction_Cost: 0,
Renovation_History:'',
Campus: 'ecc7a770-1d53-4f6f-8507-03eca95dc4bf',
Zone: '',
wing: '',
IsActive: false,
BuildingImage: ''
} */
    /* dsfjskd */
    

    /* my data darshil  */


    test4allData:any;
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _inventoryService: InventoryService,
    
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.getAllApiData()
    
        this.dropdownList = [
      /* { item_id: '04cd0a96-dfb6-47b3-af90-11c49b1c51f9', item_text: 'Aquarious' },
      { item_id: 'cd204cc9-dac7-4724-b08c-cfdfbda02969', item_text: 'Aries' }, */
   
    ];
    this.selectedItems = [
      /* { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' } */
    ];
    this.dropdownSettings= {
      singleSelection: true,
      idField: 'wingId',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };


    /* for second dropdown  */


    this.dropdownList2 = [
      /* { item_id: '04cd0a96-dfb6-47b3-af90-11c49b1c51f9', item_text: 'Aquarious' },
      { item_id: 'cd204cc9-dac7-4724-b08c-cfdfbda02969', item_text: 'Aries' }, */
   
    ];
    this.selectedItems2 = [
      /* { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' } */
    ];

    /* campusId,name */
    this.dropdownSettings2= {
      singleSelection: true,
      idField: 'campusId',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };


        /* this._inventoryService.getDataDarshil().pipe(pluck('configs')).subscribe(res=>{
            console.log(res);
            this.darshilAllData=res;
        })

        this._inventoryService.getCampusDarshil().pipe(pluck('zones')).subscribe(res=>{
            console.log('all data of campus ...',res);
            this.zonesTemp=res;
            const newArray = this.zonesTemp.map(({ name, campusId }) => ({ name, campusId }));
            console.log(newArray);
        }) */

        /*  */
     
        // Create the selected product form
        this.selectedProductForm = this._formBuilder.group({
            id               : [''],
            category         : [''],
            name             : ['', [Validators.required]],
            description      : [''],
            tags             : [[]],
            sku              : [''],
            barcode          : [''],
            brand            : [''],
            vendor           : [''],
            stock            : [''],
            reserved         : [''],
            cost             : [''],
            basePrice        : [''],
            taxPercent       : [''],
            price            : [''],
            weight           : [''],
            thumbnail        : [''],
            images           : [[]],
            currentImageIndex: [0], // Image index that is currently being viewed
            active           : [false]
        });

        // Get the brands
        this._inventoryService.brands$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((brands: InventoryBrand[]) => {

                // Update the brands
                this.brands = brands;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the categories
        this._inventoryService.categories$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((categories: InventoryCategory[]) => {

                // Update the categories
                this.categories = categories;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the pagination
        this._inventoryService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: InventoryPagination) => {

                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the products
        this.products$ = this._inventoryService.products$;

        // Get the tags
        this._inventoryService.tags$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tags: InventoryTag[]) => {

                // Update the tags
                this.tags = tags;
                this.filteredTags = tags;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the vendors
        this._inventoryService.vendors$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((vendors: InventoryVendor[]) => {

                // Update the vendors
                this.vendors = vendors;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._inventoryService.getProducts(0, 10, 'name', 'asc', query);
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
    }
    onItemSelect(item: any) {
    /* console.log(item); */
    console.log('wind id ...',item.item_id)
    this._inventoryService.DataToBeSent.wing=item.item_id
    this._inventoryService.dataForEdit.wing=item.item_id

  }
  onSelectAll(items: any) {
    console.log(items);
  }

    onItemSelect2(item: any) {
    /* console.log(item); */
    console.log('dropdown 2...',item.campusId)
    /* this._inventoryService.DataToBeSent.wing=item.item_id */
    this._inventoryService.DataToBeSent.Campus=item.campusId;
    this._inventoryService.dataForEdit.Campus=item.campusId;

  }
  onSelectAll2(items: any) {
    console.log(items);
  }



  getAllApiData(){
        this._inventoryService.getCampusDarshil().pipe(pluck('zones')).subscribe(res=>{
            /* console.log('all data of campus ...',res); */
            /* here  */
            this.zonesTemp=res;
            const newArray = this.zonesTemp.map(({ campusId,name }) => ({  campusId,name }));
             this.dropdownList2 = this.zonesTemp.map(({ campusId,name }) => ({  campusId,name }));
            console.log('my campus',newArray);
        })
        this._inventoryService.getDataDarshil().pipe(pluck('configs')).subscribe(res=>{
            console.log(res);
            this.darshilAllData=res;
        })

        this._inventoryService.getWingDataD().pipe(pluck('wings')).subscribe(res=>{
            /* console.log('wings.. data ...',res) */
this.zonesTemp=res
            this.dropdownList= this.zonesTemp.map(({ wingId,name }) => ({  wingId,name }));
console.log(this.dropdownList)
           
        })
        /* here2  */

    }

    myFormData(data:any){
           /* debugger; */
           console.log(data.date)
           /* console.log('my datasdkhfkjsfhds',data) */
           this._inventoryService
            .AddConfigData(data).subscribe(res=>{
                console.log('Response' + res)
            })
            /* .subscribe(); */
    }
    editFromData(data:any){
        console.log('my edit data',data)
        this._inventoryService.dataForEdit.Architect=data.architect;
     this._inventoryService.dataForEdit.BuildingName=data.buildingName;
      this._inventoryService.dataForEdit.BuildingNo= data.buildingNo;
        this._inventoryService.dataForEdit.Contractor=data.contractor;
        this._inventoryService.dataForEdit.Date_constructed=data.date;
        this._inventoryService.dataForEdit.Construction_Cost=data.cost;
        this._inventoryService.dataForEdit.Renovation_History=data.renovation_History;
      

        this._inventoryService.editConfigData().subscribe(res=>{
            console.log(res)
        })
    }
    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        if ( this._sort && this._paginator )
        {
            // Set the initial sort
            this._sort.sort({
                id          : 'name',
                start       : 'asc',
                disableClear: true
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._inventoryService.getProducts(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle product details
     *
     * @param productId
     */

    /* BuildingNo: 0,
        BuildingName: '',
        Description: '',
        Date_constructed: '',
        Architect: '',
        Contractor: '',
        Construction_Cost: 0,
        Renovation_History:'',
        Campus: 'ecc7a770-1d53-4f6f-8507-03eca95dc4bf',
        Zone: '',
        wing: '',
        IsActive: false,
        BuildingImage: '' */


    toggleDetails(productId: string): void
    {
        console.log(productId);
        this._inventoryService.dUniqueId=productId;
        const filteredArray = this.darshilAllData.filter(obj => obj.uniqueId === productId);
        console.log('filtored Array',filteredArray)
        this.shareDataId=productId;
        this.editData.Architect=filteredArray[0].architect;
        this.editData.BuildingName=filteredArray[0].buildingName;
        /* this.editData.BuildingNo=+filteredArray[0].buildingNo; */
        this.editData.BuildingNo=+filteredArray[0].buildingNo;
        this.editData.Construction_Cost=+filteredArray[0].construction_Cost;
        this.editData.Contractor=filteredArray[0].contractor;
        this.editData.Description=filteredArray[0].description;
        this.editData.Renovation_History=filteredArray[0].renovation_History;
        this.editData.Date_constructed=filteredArray[0].date_constructed;
        
       


        // If the product is already selected...
        if ( this.selectedProduct && this.selectedProduct.id === productId )
        {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the product by id
        this._inventoryService.getProductById(productId)
            .subscribe((product) => {

                // Set the selected product
                this.selectedProduct = product;

                // Fill the form
                this.selectedProductForm.patchValue(product);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    updateConfig(data: any, id: string) {
        /* data.Floors = []; */
        data.EntityJson = [];
        data.BuildingImage = '';
        this._inventoryService.updateData(data.value, id).subscribe((res) => {
            console.log(res);
        });
    }

    /**
     * Close the details
     */
    closeDetails(): void
    {
        this.selectedProduct = null;
    }

    /**
     * Cycle through images of selected product
     */
    cycleImages(forward: boolean = true): void
    {
        // Get the image count and current image index
        const count = this.selectedProductForm.get('images').value.length;
        const currentIndex = this.selectedProductForm.get('currentImageIndex').value;

        // Calculate the next and previous index
        const nextIndex = currentIndex + 1 === count ? 0 : currentIndex + 1;
        const prevIndex = currentIndex - 1 < 0 ? count - 1 : currentIndex - 1;

        // If cycling forward...
        if ( forward )
        {
            this.selectedProductForm.get('currentImageIndex').setValue(nextIndex);
        }
        // If cycling backwards...
        else
        {
            this.selectedProductForm.get('currentImageIndex').setValue(prevIndex);
        }
    }

    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void
    {
        this.tagsEditMode = !this.tagsEditMode;
    }

    /**
     * Filter tags
     *
     * @param event
     */
    filterTags(event): void
    {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredTags = this.tags.filter(tag => tag.title.toLowerCase().includes(value));
    }

    /**
     * Filter tags input key down event
     *
     * @param event
     */
    filterTagsInputKeyDown(event): void
    {
        // Return if the pressed key is not 'Enter'
        if ( event.key !== 'Enter' )
        {
            return;
        }

        // If there is no tag available...
        if ( this.filteredTags.length === 0 )
        {
            // Create the tag
            this.createTag(event.target.value);

            // Clear the input
            event.target.value = '';

            // Return
            return;
        }

        // If there is a tag...
        const tag = this.filteredTags[0];
        const isTagApplied = this.selectedProduct.tags.find(id => id === tag.id);

        // If the found tag is already applied to the product...
        if ( isTagApplied )
        {
            // Remove the tag from the product
            this.removeTagFromProduct(tag);
        }
        else
        {
            // Otherwise add the tag to the product
            this.addTagToProduct(tag);
        }
    }

    /**
     * Create a new tag
     *
     * @param title
     */
    createTag(title: string): void
    {
        const tag = {
            title
        };

        // Create tag on the server
        this._inventoryService.createTag(tag)
            .subscribe((response) => {

                // Add the tag to the product
                this.addTagToProduct(response);
            });
    }

    /**
     * Update the tag title
     *
     * @param tag
     * @param event
     */
    updateTagTitle(tag: InventoryTag, event): void
    {
        // Update the title on the tag
        tag.title = event.target.value;

        // Update the tag on the server
        this._inventoryService.updateTag(tag.id, tag)
            .pipe(debounceTime(300))
            .subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Delete the tag
     *
     * @param tag
     */
    deleteTag(tag: InventoryTag): void
    {
        // Delete the tag from the server
        this._inventoryService.deleteTag(tag.id).subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add tag to the product
     *
     * @param tag
     */
    addTagToProduct(tag: InventoryTag): void
    {
        // Add the tag
        this.selectedProduct.tags.unshift(tag.id);

        // Update the selected product form
        this.selectedProductForm.get('tags').patchValue(this.selectedProduct.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove tag from the product
     *
     * @param tag
     */
    removeTagFromProduct(tag: InventoryTag): void
    {
        // Remove the tag
        this.selectedProduct.tags.splice(this.selectedProduct.tags.findIndex(item => item === tag.id), 1);

        // Update the selected product form
        this.selectedProductForm.get('tags').patchValue(this.selectedProduct.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle product tag
     *
     * @param tag
     * @param change
     */
    toggleProductTag(tag: InventoryTag, change: MatCheckboxChange): void
    {
        if ( change.checked )
        {
            this.addTagToProduct(tag);
        }
        else
        {
            this.removeTagFromProduct(tag);
        }
    }

    /**
     * Should the create tag button be visible
     *
     * @param inputValue
     */
    shouldShowCreateTagButton(inputValue: string): boolean
    {
        return !!!(inputValue === '' || this.tags.findIndex(tag => tag.title.toLowerCase() === inputValue.toLowerCase()) > -1);
    }

    /**
     * Create product
     */
    createProduct(): void
    {
        // Create the product
        console.log('asdfjlkdsjflkjdsfdsjfl')


        /* this._inventoryService.createProduct().subscribe((newProduct) => {

            // Go to new product
            this.selectedProduct = newProduct;

            // Fill the form
            this.selectedProductForm.patchValue(newProduct);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }); */
    }

    /**
     * Update the selected product using the form data
     */
    updateSelectedProduct(): void
    {
        // Get the product object
        const product = this.selectedProductForm.getRawValue();

        // Remove the currentImageIndex field
        delete product.currentImageIndex;

        // Update the product on the server
        this._inventoryService.updateProduct(product.id, product).subscribe(() => {

            // Show a success message
            this.showFlashMessage('success');
        });
    }

    /**
     * Delete the selected product using the form data
     */
    deleteSelectedProduct(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete product',
            message: 'Are you sure you want to remove this product? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {

                // Get the product object
                const product = this.selectedProductForm.getRawValue();

                // Delete the product on the server
                this._inventoryService.deleteProduct(product.id).subscribe(() => {

                    // Close the details
                    this.closeDetails();
                });
            }
        });
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void
    {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {

            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
