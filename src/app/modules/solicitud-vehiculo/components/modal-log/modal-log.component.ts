import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ILogSoliVe} from "../../interfaces/data.interface";

@Component({
  selector: 'app-modal-log',
  templateUrl: './modal-log.component.html',
  styleUrls: ['./modal-log.component.scss']
})
export class ModalLogComponent implements OnInit {

  alerts = [
    {
      id: 1,
      type: "info",
      message:
        "Estos son los diferentes moviemientos que ha tenido la solicitud.",
      show: false,
    },
  ];

  @Input() log!: ILogSoliVe[];
  p: any; // paginacion

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  siMuestraAlertas() {
    return this.alerts.every((alert) => alert.show);
  }
  restaurarAlerts() {
    this.alerts.forEach((alert) => {
      alert.show = true;
    });
  }
  CambiarAlert(alert) {
    alert.show = !alert.show;
  }
  calcularNumeroCorrelativo(index: number): number {
    if (typeof this.p === 'number') {
      return (this.p - 1) * 10 + index + 1;
    } else {
      return index + 1; // Si no es numérico, solo regresamos el índice + 1
    }
  }

}
