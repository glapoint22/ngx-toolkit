import { CommonModule } from '@angular/common';
import { Component, input, output, OutputEmitterRef } from '@angular/core';

@Component({
  selector: 'month-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './month-view.component.html',
  styleUrl: './month-view.component.scss'
})
export class MonthViewComponent {
  public selectedMonth = input.required<number>();
  public selectedYear = input.required<number>();
  protected months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public onMonthSelect: OutputEmitterRef<number> = output<number>();

  
  protected isSelectedMonth(month: number): boolean {
    return month === this.selectedMonth();
  }




  protected isCurrentMonth(month: number): boolean {
    const todaysDate = new Date();

    return month === todaysDate.getMonth() && this.selectedYear() === todaysDate.getFullYear();
  }



  
  protected onMonthClick(month: number): void {
    this.onMonthSelect.emit(month);
  }
}