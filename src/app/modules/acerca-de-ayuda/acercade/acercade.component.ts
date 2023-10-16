import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-acercade',
  templateUrl: './acercade.component.html',
  styleUrls: ['./acercade.component.scss']
})
export class AcercadeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.addEventListener('resize', () => {
      const contenedores = document.querySelectorAll('.img') as NodeListOf<HTMLElement>;
    
      contenedores.forEach(contenedor => {
        if (window.innerWidth <= 768) {
          contenedor.classList.add('order-lg-2', 'mb-3', 'mb-lg-0');
        } else {
          contenedor.classList.remove('order-lg-2', 'mb-3', 'mb-lg-0');
        }
      });
    });
    
  }
}
