import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-grafica-compra",
  templateUrl: "./grafica-compra.component.html",
  styleUrls: ["./grafica-compra.component.scss"],
})
export class GraficaCompraComponent implements OnInit {
  @Input() chartData: any[] = [];
  chartLabels = ["Total Compra ($)"];
  chartLegend = true;
  chartPlugins = [];

  chartOptions = {
    responsive: true,
    title: {
      display: false,
      //text: "Título de la Gráfica",
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            callback: function (value, index, values) {
              // Formatear el valor como moneda
              return "$" + value.toFixed(2);
            },
          },
        },
      ],
    },
  };

  constructor() {}

  ngOnInit(): void {}
}
