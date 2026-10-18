import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import Chart from 'chart.js/auto';
import { AdminSession } from '../core/admin-session';

type CalendarView = 'day' | 'month' | 'year';

interface CalendarDay {
  date: Date;
  day: number;
  inMonth: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements AfterViewInit {
  @ViewChild('lineChart') lineChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnutChart') doughnutChartRef!: ElementRef<HTMLCanvasElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  readonly session = inject(AdminSession);

  /** First + last initial, or a single letter when only one name is set. */
  get initials(): string {
    return this.session.initials();
  }

  statusOptions = ['All', 'Approved', 'Pending Review', 'Processing'];
  selectedStatus = 'All';
  statusOpen = false;

  rangeOptions = ['Last 7 Days', 'Last 14 Days', 'Last 21 Days', 'Last 30 Days'];
  selectedRange = 'Last 30 Days';
  rangeOpen = false;

  zoneOptions = ['All Zones', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 5', 'Zone 8'];
  selectedZone = 'All Zones';
  zoneOpen = false;

  /* ---------------- Date range calendar ---------------- */
  readonly weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  readonly monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  readonly monthShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  calendarOpen = false;
  view: CalendarView = 'day';
  viewYear = 2026;
  viewMonth = 9; // October
  startDate: Date | null = new Date(2026, 9, 1);
  endDate: Date | null = new Date(2026, 9, 30);
  private readonly today = new Date();

  /* ---------------- Filters ---------------- */
  toggleStatus() {
    this.statusOpen = !this.statusOpen;
  }

  selectStatus(s: string) {
    this.selectedStatus = s;
    this.statusOpen = false;
  }

  toggleRange() {
    this.rangeOpen = !this.rangeOpen;
  }

  selectRange(r: string) {
    this.selectedRange = r;
    this.rangeOpen = false;
  }

  toggleZone() {
    this.zoneOpen = !this.zoneOpen;
  }

  selectZone(z: string) {
    this.selectedZone = z;
    this.zoneOpen = false;
  }

  /* ---------------- Calendar behaviour ---------------- */
  toggleCalendar() {
    this.calendarOpen = !this.calendarOpen;
    if (this.calendarOpen && this.startDate) {
      this.viewYear = this.startDate.getFullYear();
      this.viewMonth = this.startDate.getMonth();
    }
  }

  /** Header title switches between "October 2026", "2026" and "2016 - 2039". */
  get headerLabel(): string {
    if (this.view === 'day') return `${this.monthNames[this.viewMonth]} ${this.viewYear}`;
    if (this.view === 'month') return `${this.viewYear}`;
    return `${this.yearGrid[0]} - ${this.yearGrid[this.yearGrid.length - 1]}`;
  }

  /** Clicking the title steps down through day -> month -> year views. */
  cycleView() {
    this.view = this.view === 'day' ? 'month' : this.view === 'month' ? 'year' : 'day';
  }

  /** Arrows move by month / year / 24-year block depending on the active view. */
  shiftPeriod(direction: number) {
    if (this.view === 'day') {
      const next = new Date(this.viewYear, this.viewMonth + direction, 1);
      this.viewYear = next.getFullYear();
      this.viewMonth = next.getMonth();
    } else if (this.view === 'month') {
      this.viewYear += direction;
    } else {
      this.viewYear += direction * 24;
    }
  }

  get calendarDays(): CalendarDay[] {
    const first = new Date(this.viewYear, this.viewMonth, 1);
    const daysInMonth = new Date(this.viewYear, this.viewMonth + 1, 0).getDate();
    const total = Math.ceil((first.getDay() + daysInMonth) / 7) * 7;
    const start = new Date(this.viewYear, this.viewMonth, 1 - first.getDay());

    return Array.from({ length: total }, (_, i) => {
      const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      return { date, day: date.getDate(), inMonth: date.getMonth() === this.viewMonth };
    });
  }

  get yearGrid(): number[] {
    const first = this.viewYear - (this.viewYear % 24);
    return Array.from({ length: 24 }, (_, i) => first + i);
  }

  selectMonth(monthIndex: number) {
    this.viewMonth = monthIndex;
    this.view = 'day';
  }

  selectYear(year: number) {
    this.viewYear = year;
    this.view = 'month';
  }

  selectDay(date: Date) {
    const picked = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (!this.startDate || this.endDate || picked < this.startDate) {
      this.startDate = picked;
      this.endDate = null;
      return;
    }
    this.endDate = picked;
  }

  applyPreset(preset: 'today' | 'week' | 'month') {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (preset === 'today') {
      this.startDate = start;
      this.endDate = new Date(start);
    } else if (preset === 'week') {
      this.startDate = new Date(start);
      this.startDate.setDate(start.getDate() - 6);
      this.endDate = start;
    } else {
      this.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      this.endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    this.viewYear = this.startDate.getFullYear();
    this.viewMonth = this.startDate.getMonth();
    this.view = 'day';
  }

  applyRange() {
    if (!this.startDate) return;
    this.calendarOpen = false;
    // TODO: reload dashboard data for the selected range once the backend is connected.
  }

  get rangeComplete(): boolean {
    return this.startDate !== null && this.endDate !== null;
  }

  isSelected(date: Date): boolean {
    return this.isSameDay(date, this.startDate) || (this.endDate !== null && this.isSameDay(date, this.endDate));
  }

  isInRange(date: Date): boolean {
    if (!this.startDate || !this.endDate) return false;
    const time = date.getTime();
    return time > this.startDate.getTime() && time < this.endDate.getTime();
  }

  isToday(date: Date): boolean {
    return this.isSameDay(date, this.today);
  }

  get dateRangeLabel(): string {
    if (!this.startDate) return 'Select date range';
    const from = this.formatDate(this.startDate);
    if (!this.endDate) return from;
    return `${from} – ${this.formatDate(this.endDate)}`;
  }

  private formatDate(date: Date): string {
    return `${this.monthShort[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  private isSameDay(a: Date, b: Date | null): boolean {
    if (!b) return false;
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  exportCsv() {
    // Placeholder: wire up CSV generation once the backend is connected.
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    new Chart(this.lineChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Monthly Requests',
            data: [0, 0, 0, 0, 0, 0, 0, 0],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#8b5cf6',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: 'rgba(31,36,48,0.7)' } } },
        scales: {
          x: { ticks: { color: 'rgba(31,36,48,0.55)' }, grid: { color: 'rgba(15,23,42,0.06)' } },
          y: { beginAtZero: true, ticks: { color: 'rgba(31,36,48,0.55)' }, grid: { color: 'rgba(15,23,42,0.06)' } },
        },
      },
    });

    new Chart(this.doughnutChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['No data'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['rgba(139, 92, 246, 0.14)'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: { legend: { position: 'bottom', labels: { color: 'rgba(31,36,48,0.7)' } } },
      },
    });
  }
}
