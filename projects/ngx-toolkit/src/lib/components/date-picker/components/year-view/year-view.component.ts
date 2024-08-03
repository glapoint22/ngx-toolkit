import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output, OutputEmitterRef } from '@angular/core';

@Component({
  selector: 'year-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './year-view.component.html',
  styleUrl: './year-view.component.scss'
})
export class YearViewComponent implements OnInit {
  public selectedYear = input.required<number>();
  public onYearSelect: OutputEmitterRef<number> = output<number>();
  protected years: Array<number> = [];
  private startYear: number = 0;
  private readonly itemsPerPage: number = 16;

  
  public ngOnInit(): void {
    this.calculateStartYear();
    this.generateYears();
  }




  private calculateStartYear(): void {
    this.startYear = Math.floor(this.selectedYear() / this.itemsPerPage) * this.itemsPerPage;
  }




  private generateYears(): void {
    this.years = Array.from({ length: this.itemsPerPage }, (_, i) => this.startYear + i);
  }




  protected previousPage(): void {
    this.startYear -= this.itemsPerPage;
    this.generateYears();
  }




  protected nextPage(): void {
    this.startYear += this.itemsPerPage;
    this.generateYears();
  }




  protected isSelectedYear(year: number): boolean {
    return year === this.selectedYear();
  }




  protected isCurrentYear(year: number): boolean {
    const todaysDate = new Date();

    return year === todaysDate.getFullYear();
  }




  protected onYearClick(year: number): void {
    this.onYearSelect.emit(year);
  }
}