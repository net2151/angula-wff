import { AfterViewInit, Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule, CheckboxModule, CreditCardModule, DiscountPipeModule } from '@wfh/ui';
import { IconModule } from '../../../shared/modules/icon.module';
import { CommonModule } from '@angular/common';
import { CartItemModule } from './cart-item.component';
import { CartSidebarModule } from './cart-sidebar.component';
import {
  catchError,
  filter,
  map,
  merge,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs';
import { CartService, LoaderService, OrderService, UserService } from '@wfh/store-front/service';
import { AddressResponse } from '@wfh/api-interfaces';
import { AuthService } from '@auth0/auth0-angular';
import { HotToastService } from '@ngneat/hot-toast';
import { AddressModalComponent } from '../../../shared/components/address-modal.component';
import { DialogService } from '@ngneat/dialog';

@Component({
  selector: 'wfh-cart',
  template: `
    <ng-container *ngIf="this.items$ | async as items">
      <ng-container *ngIf="items.length > 0; else emptyCart">
        <section class="flex-1">
          <header class="mb-4">
            <h2 class="text-xl font-bold text-gray-500">In Cart</h2>
          </header>
          <section class="cart__section">
            <section class="grid xl:grid-cols-2 gap-4">
              <article class="" *ngFor="let item of items">
                <wfh-cart-item [product]="item" (delete)="this.onDelete(item)"></wfh-cart-item>
              </article>
            </section>
          </section>
          <ng-container *ngIf="this.auth.isAuthenticated$ | async; else login">
            <section class="cart__section" #address>
              <header class="mb-4">
                <h2 class="text-xl font-bold text-gray-500">Address</h2>
              </header>
              <ul class="grid lg:grid-cols-2 gap-4">
                <li
                  (click)="this.addNewAddress()"
                  style="min-height: 150px;"
                  class="border grid place-items-center cursor-pointer text-gray-600 relative border-gray-200 hover:bg-gray-100 hover:ring-2 hover:ring-primary p-4 rounded-md"
                >
                  <div class="flex gap-2 items-center">
                    <rmx-icon name="add-line"></rmx-icon>
                    <p>Add New</p>
                  </div>
                </li>
                <ng-container *ngFor="let address of this.addresses$ | async">
                  <li
                    (click)="step = 1; this.addressSelected = address._id"
                    class="border cursor-pointer text-gray-600 hover:shadow-lg hover:-translate-y-1 relative border-gray-200 p-4 rounded-md"
                  >
                    <div class="absolute top-2 right-2">
                      <wfh-checkbox [checked]="this.addressSelected === address._id"></wfh-checkbox>
                    </div>
                    <p>{{ address?.apartment }}, {{ address?.street }}</p>
                    <p>{{ address?.city }}</p>
                    <p>{{ address?.state }}, {{ address?.country }}</p>
                    <p class="font-semibold">{{ address?.zip }}</p>
                    <p>{{ address?.phone }}</p>
                  </li>
                </ng-container>
              </ul>
            </section>
            <section class="cart__section" #payments *ngIf="step > 0">
              <header class="mb-4">
                <h2 class="text-xl font-bold text-gray-500">Payment</h2>
              </header>
              <div class="grid lg:grid-cols-3 gap-4">
                <ng-container *ngFor="let card of this.cards$ | async; index as i">
                  <label
                    (click)="step = 2"
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
          </ng-container>
          <ng-template #login>
            <section class="flex flex-col items-center py-4">
              <img src="assets/images/girl-cart.svg" alt="SHopping" class="h-60" />
              <p class="mb-4 text-md">
                Please login or signup to continue.<br />
                <span class="text-gray-500 text-sm"> You will need to choose/add an address.</span>
              </p>

              <button wfh (click)="this.auth.loginWithPopup()">Login or Signup</button>
            </section>
          </ng-template>
        </section>
        <aside class="cart__sidebar">
          <header class="mb-4">
            <h2 class="text-xl font-bold text-gray-500">Summary</h2>
          </header>
          <wfh-cart-sidebar
            (clicked)="this.onClicked()"
            [state]="this.step"
            [priceBreakdown]="this.priceBreakdown$ | async"
          ></wfh-cart-sidebar>
        </aside>
      </ng-container>
    </ng-container>

    <ng-template #emptyCart>
      <section class="flex flex-col items-center w-full h-full">
        <img src="assets/images/girl-shopping.svg" alt="Shopping" [style.height.px]="500" />
        <p class="mb-4 text-lg text-center font-semibold">
          Your cart is empty.<br />
          <span class="text-gray-500 text-sm">
            Find your favorite products and add them to your cart.</span
          >
        </p>

        <button wfh routerLink="/products">Browser Products</button>
      </section>
    </ng-template>
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
  readonly cards$ = this.auth.user$.pipe(
    filter((user) => !!user),
    map((user) => [
      {
        number: '4532641283337400',
        expiry: '12/23',
        name: `${user?.given_name} ${user?.family_name}`,
      },
      {
        number: '3530111333300000',
        expiry: '12/23',
        name: `${user?.given_name} ${user?.family_name}`,
      },
      {
        number: '5425233430109903',
        expiry: '12/23',
        name: `${user?.given_name} ${user?.family_name}`,
      },
      {
        number: '60115564485789458',
        expiry: '12/23',
        name: `${user?.given_name} ${user?.family_name}`,
      },
    ])
  );

  step = 0;
  elementToNavigateTo!: Record<number, HTMLDivElement | undefined>;
  addressSelected: string = '';
  readonly addresses$: Observable<AddressResponse[]>;
  readonly items$: Observable<any>;
  readonly priceBreakdown$: Observable<{
    breakdown: { label: string; value: number }[];
    total: number;
  }>;
  @ViewChild('address')
  private readonly address?: ElementRef;
  @ViewChild('payments')
  private readonly payments?: ElementRef;

  private readonly updateAddressSubject = new Subject<void>();

  constructor(
    private readonly cartService: CartService,
    private readonly userService: UserService,
    private readonly orderService: OrderService,
    public readonly auth: AuthService,
    private readonly router: Router,
    private readonly toast: HotToastService,
    private readonly dialog: DialogService,
    private readonly loader: LoaderService
  ) {
    this.cartService.refreshCart().subscribe();
    this.items$ = this.cartService.cartItems$.pipe(catchError(() => of([])));
    this.priceBreakdown$ = this.items$.pipe(
      map((items) => {
        let cartPriceTotal = 0;
        let cartOriginalPriceTotal = 0;

        items.forEach((item: any) => {
          cartPriceTotal += item.price;
          cartOriginalPriceTotal += item.originalPrice;
        });

        const discounts = cartOriginalPriceTotal - cartPriceTotal;
        const couponDiscount = cartPriceTotal * 0.01;
        const shipping = 299;
        const tax = cartPriceTotal * 0.05;
        const total = cartPriceTotal + shipping + tax - couponDiscount;
        return {
          breakdown: [
            {
              label: 'Cart Value',
              value: cartOriginalPriceTotal,
            },
            {
              label: 'Discount',
              value: discounts,
            },
            {
              label: 'Coupon Discount',
              value: couponDiscount,
            },
            {
              label: 'Shipping',
              value: 299,
            },
            {
              label: 'Tax/VAT',
              value: tax,
            },
          ],
          total,
        };
      })
    );
    this.addresses$ = merge(
      this.auth.isAuthenticated$,
      this.updateAddressSubject.asObservable().pipe(startWith(true))
    ).pipe(
      tap(() => {
        this.loader.show();
      }),
      switchMap(() => this.userService.getAddresses()),
      tap((addresses) => {
        if (addresses.length) {
          this.addressSelected = addresses[0]._id;
          this.step = 1;
        }
      }),
      tap(() => {
        this.loader.hide();
      }),
      catchError((err) => {
        this.toast.error('Failed to load address.');
        return of([]);
      })
    );
  }

  ngAfterViewInit() {
    this.elementToNavigateTo = {
      0: this.address?.nativeElement as HTMLDivElement,
      1: this.payments?.nativeElement as HTMLDivElement,
    };
  }

  addNewAddress(isEdit = false, address: AddressResponse | null = null) {
    const ref = this.dialog.open(AddressModalComponent, {
      data: {
        isEditMode: isEdit,
        address: address,
      },
    });
    ref.afterClosed$.pipe(filter((updated) => !!updated)).subscribe((updated) => {
      if (updated) {
        this.updateAddressSubject.next();
      }
    });
  }

  onClicked() {
    if (this.step < 2) {
      if ((this.step = 1)) {
        if (this.addressSelected !== '') {
          this.step++;
        }
      } else {
        this.step++;
      }
    }
    const element = this.elementToNavigateTo[this.step];
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (this.step === 2) {
      this.items$
        .pipe(
          take(1),
          map((items) =>
            items.map((item: any) => ({
              id: item._id,
              name: item.name,
              description: item.description,
              price: item.price,
            }))
          ),
          withLatestFrom(this.priceBreakdown$),
          switchMap(([items, breakdown]) =>
            this.orderService.order(items, this.addressSelected, breakdown.breakdown)
          )
        )
        .subscribe(() => {
          this.toast.success('Order placed successfully');
          this.cartService.reset();
          this.router.navigate(['/orders']);
        });
    }
  }

  onDelete(item: any) {
    this.cartService.remove(item);
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
