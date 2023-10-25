import { Component, Input, OnInit } from '@angular/core';
import { IVale } from '../../interfaces/vale.interface';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss']
})
export class TablaComponent implements OnInit {

  @Input() vales!: IVale[];
  @Input() items!: number;
  @Input() queryString!: string;
  p: any;

  constructor() { }

  ngOnInit(): void {
  }

}
