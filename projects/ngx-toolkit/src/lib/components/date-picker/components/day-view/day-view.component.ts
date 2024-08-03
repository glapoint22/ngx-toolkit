import { CommonModule } from '@angular/common';
import { Component, input, OnChanges, output, OutputEmitterRef } from '@angular/core';

@Component({
  selector: 'day-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './day-view.component.html',
  styleUrl: './day-view.component.scss'
})
export class DayViewComponent implements OnChanges {
  public date = input.required<Date>();
  public selectedDate = input<Date | undefined>();
  public onDateSelect: OutputEmitterRef<Date> = output<Date>();
  protected dates: Array<Date> = [];
  protected currentDisplayedMonth!: number;


  public ngOnChanges(): void {
    this.generateDays();
  }




  private generateDays(): void {
    const date = this.date();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)

    const daysInCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const daysInPreviousMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

    const daysFromPrevMonth = firstDayOfWeek;
    const totalDays = 6 * 7; // 6 rows and 7 columns
    const daysFromNextMonth = totalDays - (daysFromPrevMonth + daysInCurrentMonth);

    this.dates = [];
    this.currentDisplayedMonth = date.getMonth();

    // Dates from the previous month
    this.setPreviousMonthDates(daysFromPrevMonth, daysInPreviousMonth, date);

    // Dates from the current month
    this.setCurrentMonthDates(daysInCurrentMonth, date);

    // Dates from the next month
    this.setNextMonthDates(daysFromNextMonth, date);
  }




  private setPreviousMonthDates(daysFromPrevMonth: number, daysInPreviousMonth: number, currentDate: Date): void {
    for (let i = daysFromPrevMonth; i > 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, daysInPreviousMonth - i + 1);

      this.dates.push(date);
    }
  }




  private setCurrentMonthDates(daysInCurrentMonth: number, currentDate: Date): void {
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);

      this.dates.push(date);
    }
  }




  private setNextMonthDates(daysFromNextMonth: number, currentDate: Date): void {
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);

      this.dates.push(date);
    }
  }




  protected isCurrentDisplayedMonth(date: Date): boolean {
    return date.getMonth() !== this.currentDisplayedMonth;
  }




  protected isCurrentDay(date: Date): boolean {
    const todaysDate = new Date();

    return date.getDate() === todaysDate.getDate() &&
      date.getMonth() === todaysDate.getMonth() &&
      date.getFullYear() === todaysDate.getFullYear();
  }




  protected isSelectedDate(date?: Date): boolean {
    return date?.getDate() === this.selectedDate()?.getDate() &&
      date?.getMonth() === this.selectedDate()?.getMonth() &&
      date?.getFullYear() === this.selectedDate()?.getFullYear();
  }



  
  protected onCalendarDayClick(date: Date): void {
    this.onDateSelect.emit(date);
  }
}