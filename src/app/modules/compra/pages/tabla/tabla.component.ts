import { Component, Input, OnInit } from '@angular/core';
import { ICompra } from '../../interfaces/compra.interface';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss']
})
export class TablaComponent implements OnInit {
  @Input() compras!: ICompra[];
  @Input() queryString!: string;
  @Input() items!: number;
  p: any;

  constructor() { }

  ngOnInit(): void {
  }

}
