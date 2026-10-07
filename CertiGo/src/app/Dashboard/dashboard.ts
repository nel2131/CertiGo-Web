import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements AfterViewInit {
  @ViewChild('lineChart') lineChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnutChart') doughnutChartRef!: ElementRef<HTMLCanvasElement>;

  statusOptions = ['All', 'Approved', 'Pending Review', 'Processing'];
  selectedStatus = 'All';
  statusOpen = false;

  toggleStatus() {
    this.statusOpen = !this.statusOpen;
  }

  selectStatus(s: string) {
    this.selectedStatus = s;
    this.statusOpen = false;
  }

  ngAfterViewInit() {
    new Chart(this.lineChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Monthly Requests',
            data: [0, 0, 0, 0, 0, 0, 0, 0],
            borderColor: '#34d399',
            backgroundColor: 'rgba(52, 211, 153, 0.15)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#34d399',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: 'rgba(226,242,235,0.7)' } } },
        scales: {
          x: { ticks: { color: 'rgba(226,242,235,0.5)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { beginAtZero: true, ticks: { color: 'rgba(226,242,235,0.5)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
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
            backgroundColor: ['rgba(255, 255, 255, 0.08)'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: { legend: { position: 'bottom', labels: { color: 'rgba(226,242,235,0.7)' } } },
      },
    });
  }
}
