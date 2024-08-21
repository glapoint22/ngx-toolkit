import { Directive, ElementRef, forwardRef, HostListener, inject, input, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ColorType } from '../../../types/color.type';
import { CalendarComponent } from '../components/calendar/calendar.component';
import { DynamicComponentService } from '../../../services/dynamic-component/dynamic-component.service';
import { DynamicComponentRef } from '../../../models/dynamic-component-ref';

@Directive({
  selector: '[datePicker]',
  standalone: true,
  exportAs: 'datePicker',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerDirective),
    multi: true
  }]
})
export class DatePickerDirective implements ControlValueAccessor {
  public color = input<ColorType>('primary');
  private elementRef: ElementRef<HTMLInputElement> = inject(ElementRef<HTMLInputElement>);
  private renderer = inject(Renderer2);
  private dynamicComponentService = inject(DynamicComponentService);
  private removeWindowClickListener!: () => void;
  private removeElementRefClickListener!: () => void;
  private removeEscapeKeyListener!: () => void;
  private onChange!: (value: Date) => void;
  protected onTouched!: () => void;
  private isCalendarOpen: boolean = false;
  private dynamicComponentRef!: DynamicComponentRef<CalendarComponent>;


  public async toggleCalendar(): Promise<void> {
    if (this.isCalendarOpen) {
      this.closeCalendar();
      return;
    }

    const date = this.elementRef.nativeElement.value ? new Date(this.elementRef.nativeElement.value) : undefined;
    const calendar = await this.openCalendar();

    calendar.initialize(this.color(), date);
    calendar.onDateChange.subscribe((date: Date) => this.onDateChange(date));

    this.createListeners();
  }




  private async openCalendar(): Promise<CalendarComponent> {
    const { CalendarComponent } = await import('../components/calendar/calendar.component');

    this.dynamicComponentRef = this.dynamicComponentService.open(CalendarComponent, {
      connectedPositionOrigin: this.elementRef.nativeElement.parentElement!,
      conntectedPositions: [
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        }
      ]
    });

    this.isCalendarOpen = true;
    return this.dynamicComponentRef.componentInstance;
  }




  private closeCalendar(): void {
    this.dynamicComponentRef.close();
    this.removeListeners();
    this.isCalendarOpen = false;
  }




  private onDateChange(date: Date): void {
    this.elementRef.nativeElement.value = this.formatDate(date);
    if (this.onChange) this.onChange(date);
    this.closeCalendar();
  }




  private createListeners(): void {
    this.removeWindowClickListener = this.renderer.listen('window', 'click', () => this.closeCalendar());
    this.removeElementRefClickListener = this.renderer.listen(this.elementRef.nativeElement, 'click', (event: MouseEvent) => event.stopPropagation());
    this.removeEscapeKeyListener = this.renderer.listen('window', 'keydown.escape', () => this.closeCalendar());
  }




  private removeListeners(): void {
    this.removeWindowClickListener();
    this.removeElementRefClickListener();
    this.removeEscapeKeyListener();
  }




  private formatDate(value: any): string {
    const date = value instanceof Date ? value : new Date(value);

    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }




  @HostListener('blur')
  public onBlur(): void {
    if (this.elementRef.nativeElement.value === '' ||
      this.elementRef.nativeElement.value === null ||
      this.elementRef.nativeElement.value === undefined) return;

    this.elementRef.nativeElement.value = this.formatDate(this.elementRef.nativeElement.value);

    if (this.onChange) this.onChange(new Date(this.elementRef.nativeElement.value));
  }




  public writeValue(value: any): void {
    if (!value) return;

    this.elementRef.nativeElement.value = this.formatDate(value);
  }




  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }




  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}