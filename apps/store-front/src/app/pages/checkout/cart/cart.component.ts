import { AfterViewInit, Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule, CheckboxModule, CreditCardModule, DiscountPipeModule } from '@wfh/ui';
import { IconModule } from '../../../shared/modules/icon.module';
import { CommonModule } from '@angular/common';
import { CartItemModule } from './cart-item.component';
import { CartSidebarModule } from './cart-sidebar.component';

@Component({
  selector: 'wfh-cart',
  template: `
    <section class="flex-1">
      <section class="cart__section">
        <header class="mb-4">
          <h2 class="text-xl font-bold text-gray-500">In Cart</h2>
        </header>
        <section class="grid xl:grid-cols-2 gap-4">
          <article class="">
            <header class="mb-4">
              <h3 class="text-base font-semibold">Desk</h3>
            </header>
            <div class="flex flex-col gap-2">
              <section class="">
                <wfh-cart-item [product]="product"></wfh-cart-item>
              </section>
            </div>
          </article>
          <article class="">
            <header class="mb-4">
              <h3 class="text-base font-semibold">Chair</h3>
            </header>
            <div class="flex flex-col gap-2">
              <section class="">
                <wfh-cart-item [product]="product"></wfh-cart-item>
              </section>
            </div>
          </article>
          <article class="">
            <header class="mb-4">
              <h3 class="text-base font-semibold">Monitor</h3>
            </header>
            <div class="flex flex-col gap-2">
              <section class="">
                <wfh-cart-item [product]="product"></wfh-cart-item>
              </section>
            </div>
          </article>
        </section>
      </section>
      <section class="cart__section" #address>
        <header class="mb-4">
          <h2 class="text-xl font-bold text-gray-500">Address</h2>
        </header>
        <div class="grid lg:grid-cols-2 gap-4">
          <article
            class="border text-gray-600 hover:shadow-lg hover:-translate-y-1 relative border-gray-200 p-4"
          >
            <div class="absolute top-2 right-2">
              <wfh-checkbox></wfh-checkbox>
            </div>
            <p class="font-semibold text-gray-800">Adithya Sreyaj</p>
            <p>A123, Stone Avenue, St Johns Church Road</p>
            <p>ABC Street</p>
            <p>Bangalore, Karnataka</p>
            <p class="font-semibold">560088</p>
          </article>
        </div>
      </section>
      <section class="cart__section" #payments>
        <header class="mb-4">
          <h2 class="text-xl font-bold text-gray-500">Payment</h2>
        </header>
        <div class="grid lg:grid-cols-3 gap-4">
          <ng-container *ngFor="let card of cards; index as i">
            <label
              [for]="'card=' + i"
              class="text-gray-600 relative hover:-translate-y-1 hover:shadow-lg cursor-pointer transition-all duration-200"
            >
              <div class="absolute top-2 right-2">
                <input type="radio" name="card" [id]="'card=' + i" />
              </div>
              <wfh-credit-card
                [attr.data-id]="i + 1"
                [number]="card.number"
                [expiry]="card.expiry"
                [name]="card.name"
              ></wfh-credit-card>
            </label>
          </ng-container>
        </div>
      </section>
    </section>
    <aside class="cart__sidebar">
      <header class="mb-4">
        <h2 class="text-xl font-bold text-gray-500">Summary</h2>
      </header>
      <wfh-cart-sidebar (clicked)="onClicked()" [state]="step"></wfh-cart-sidebar>
    </aside>
  `,
  styles: [
    // language=SCSS
    `
      :host {
        @apply flex flex-col items-start max-w-7xl mx-auto px-6 pb-10 gap-4;
        @apply md:flex-row;
      }

      .cart {
        &__sidebar {
          @apply sticky top-6;
          width: 350px;
        }

        &__section {
          @apply mb-8;
        }
      }
    `,
  ],
})
export class CartComponent implements AfterViewInit {
  product = {
    title: 'Helios Study Desk in Brown Colour',
    price: 4000,
    originalPrice: 7500,
    images: [
      'https://ii1.pepperfry.com/media/catalog/product/h/e/1100x1210/helios-study-desk-in-brown-colour-by-home-centre-helios-study-desk-in-brown-colour-by-home-centre-c1mgui.jpg',
    ],
  };

  cards = [
    {
      number: '4532641283337400',
      expiry: '12/23',
      name: 'Adithya Sreyaj',
    },
    {
      number: '3530111333300000',
      expiry: '12/23',
      name: 'Adithya Sreyaj',
    },
    {
      number: '5425233430109903',
      expiry: '12/23',
      name: 'Adithya Sreyaj',
    },
    {
      number: '60115564485789458',
      expiry: '12/23',
      name: 'Adithya Sreyaj',
    },
  ];

  step = 0;
  @ViewChild('address') address?: ElementRef;
  @ViewChild('payments') payments?: ElementRef;
  elementToNavigateTo!: Record<number, HTMLDivElement | undefined>;

  ngAfterViewInit() {
    this.elementToNavigateTo = {
      0: this.address?.nativeElement as HTMLDivElement,
      1: this.payments?.nativeElement as HTMLDivElement,
    };
  }

  onClicked() {
    if (this.step < 2) this.step++;
    const element = this.elementToNavigateTo[this.step];
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

@NgModule({
  declarations: [CartComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: CartComponent }]),
    ButtonModule,
    IconModule,
    DiscountPipeModule,
    CartItemModule,
    CartSidebarModule,
    CheckboxModule,
    CreditCardModule,
  ],
  exports: [CartComponent],
})
export class CartModule {}