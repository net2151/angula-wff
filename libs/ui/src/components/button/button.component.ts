import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input, NgModule } from '@angular/core';

@Component({
  selector: 'button[wfh]',
  template: ` <ng-content></ng-content> `,
  styles: [
    `
      :host {
        @apply px-5 text-base font-medium outline-none rounded-lg;
        @apply transition duration-150 ease-in-out;
        @apply hover:ring-2 ring-offset-1 hover:ring-primary;
        @apply focus:ring-2 focus:ring-primary;
      }

      :host-context(.base) {
        @apply h-10;
      }

      :host-context(.icon) {
        @apply flex items-center justify-center;
      }

      :host-context(.xsmall) {
        @apply p-1 text-xs font-medium;
      }

      :host-context(.small) {
        @apply px-2 py-2 text-sm font-medium;
      }

      :host-context(.primary) {
        @apply bg-primary text-white;
        @apply hover:bg-primary-dark;
      }

      :host-context(.secondary) {
        @apply bg-secondary text-white;
      }

      :host-context(.neutral) {
        @apply bg-gray-100 hover:bg-gray-200 hover:text-primary;
      }

      :host-context(.outline) {
        @apply hover:bg-gray-100 outline-none border border-gray-200 hover:text-primary;
      }

      :host-context(.icon.small) {
        @apply h-12 w-12;
      }

      :host-context(.icon.xsmall) {
        @apply h-8 w-8;
      }

      :host:disabled {
        @apply bg-gray-300 cursor-not-allowed text-gray-400 opacity-50 hover:bg-gray-300 focus:ring-0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input()
  class = '';

  @Input()
  variant = 'primary';

  @Input()
  size = 'base';

  @HostBinding('class')
  get buttonClasses() {
    const baseClasses = new Set(['button', this.variant ?? 'primary', this.size]);
    this.class.split(' ').forEach((c) => baseClasses.add(c));
    return Array.from(baseClasses).join(' ');
  }
}

@NgModule({
  declarations: [ButtonComponent],
  imports: [CommonModule],
  exports: [ButtonComponent],
})
export class ButtonModule {}
