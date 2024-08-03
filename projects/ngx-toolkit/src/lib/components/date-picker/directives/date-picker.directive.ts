import { Directive, ElementRef, forwardRef, HostListener, inject, input, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ColorType } from '../../../types/color.type';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CalendarComponent } from '../components/calendar/calendar.component';

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
  public calendarColor = input<ColorType>('primary');
  private overlayRef!: OverlayRef;
  private elementRef: ElementRef<HTMLInputElement> = inject(ElementRef<HTMLInputElement>);
  private overlay = inject(Overlay);
  private renderer = inject(Renderer2);
  private removeWindowClickListener!: () => void;
  private removeElementRefClickListener!: () => void;
  private removeEscapeKeyListener!: () => void;
  private onChange!: (value: Date) => void;
  protected onTouched!: () => void;


  public async toggleCalendar(): Promise<void> {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.closeCalendar();
      return;
    }

    const date = this.elementRef.nativeElement.value ? new Date(this.elementRef.nativeElement.value) : undefined;
    const calendar = await this.openCalendar();

    calendar.initialize(this.calendarColor(), date);
    calendar.onDateChange.subscribe((date: Date) => this.onDateChange(date));

    this.createListeners();
  }




  private async openCalendar(): Promise<CalendarComponent> {
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.elementRef.nativeElement.parentElement!)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        }
      ]);

    this.overlayRef = this.overlay.create({ positionStrategy });
    const calendarPortal = new ComponentPortal(CalendarComponent);
    const calendarRef = this.overlayRef.attach(calendarPortal);

    return calendarRef.instance;
  }




  private closeCalendar(): void {
    this.overlayRef.detach();
    this.removeListeners();
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




  ngOnDestroy(): void {
    this.overlayRef.dispose();
  }
}