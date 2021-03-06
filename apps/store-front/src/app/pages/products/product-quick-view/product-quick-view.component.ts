import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CURRENCY_CODE, SideSheetComponent } from '@wfh/ui';
import { ProductQuickView } from '../products.interface';

@Component({
  selector: 'wfh-product-quick-view',
  template: `
    <wfh-side-sheet #sideSheetRef class="side-sheet">
      <ng-container *ngIf="this.product">
        <header class="relative">
          <section class="flex justify-center">
            <img
              [alt]="this.product.name"
              [src]="this.product.images[0]"
              style="max-height: 350px"
              class="aspect-square object-contain"
            />
          </section>
        </header>
        <div class="px-6">
          <h2 class="text-lg font-medium">{{ this.product.name }}</h2>
          <p class="text-gray-500 text-sm">
            {{ this.product.description }}
          </p>

          <section class="mt-4">
            <div class="flex text-2xl items-center">
              <p class="font-medium">{{ this.product.price | currency: this.currencyCode }}</p>
              <ng-container *ngIf="this.product.originalPrice">
                <p class="text-gray-500 text-base line-through ml-2">
                  {{ this.product.originalPrice | currency: this.currencyCode }}
                </p>
              </ng-container>
            </div>
            <ng-container *ngIf="this.product.originalPrice">
              <div class="">
                <p>
                  You will save
                  <strong class="text-green-600">{{
                    this.product.originalPrice - this.product.price | currency: this.currencyCode
                  }}</strong>
                  ({{ 29 }} <span class="text-xs">%</span>)
                </p>
              </div>
            </ng-container>
          </section>
        </div>
        <section class="mt-6 border-y border-gray-100 py-2">
          <ul class="grid grid-cols-4">
            <ng-container *ngFor="let promise of this.product.promises">
              <li class="flex flex-col items-center">
                <img [alt]="promise.label" [src]="'assets/images/' + promise.img" class="w-6 h-6" />
                <p class="text-center text-xs text-gray-600 mt-2">{{ promise.label }}</p>
              </li>
            </ng-container>
          </ul>
        </section>
        <section class="px-6 mt-6">
          <h3 class="font-medium text-md text-gray-500">Specifications</h3>
          <table class="w-full text-sm mt-2 ">
            <thead>
              <tr>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <ng-container *ngFor="let spec of this.product.specifications">
                <tr class="h-8">
                  <td>
                    <p class="font-medium">{{ spec.label }}</p>
                  </td>
                  <td>
                    <p>{{ spec.value }}</p>
                  </td>
                </tr>
              </ng-container>
            </tbody>
          </table>
        </section>
        <div class="pb-16"></div>
        <footer class="sticky w-full bottom-0 mt-4 p-6">
          <div class="w-full flex bg-white gap-2">
            <button class="flex-1" wfh (click)="this.addToCart.emit(product)">Add to Cart</button>
            <button class="flex-1" variant="outline" wfh>WishList</button>
          </div>
        </footer>
      </ng-container>
    </wfh-side-sheet>
  `,
})
export class ProductQuickViewComponent implements OnInit {
  @Input()
  product!: ProductQuickView | null;

  @Output()
  addToCart = new EventEmitter<ProductQuickView>();

  @ViewChild(SideSheetComponent)
  private readonly sideSheetRef!: SideSheetComponent;

  constructor(@Inject(CURRENCY_CODE) public readonly currencyCode: string) {}

  ngOnInit(): void {}

  open() {
    this.sideSheetRef?.open();
  }

  close() {
    this.sideSheetRef?.close();
  }
}
