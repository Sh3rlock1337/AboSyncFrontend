import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-impressum',
  standalone: true,
  imports: [],
  templateUrl: './impressum.component.html',
  styleUrl: './impressum.component.scss'
})
export class ImpressumComponent implements OnInit{

  constructor(private renderer: Renderer2,
    private router: Router) { }



  ngOnInit(): void {
        
  }


  impressum(): void {
    window.scrollTo(0, 0);
    this.router.navigate(['/impressum'])
  }
  datenschutz(): void {
    window.scrollTo(0, 0);
    this.router.navigate(['/datenschutz'])
  }
  agb(): void {
    window.scrollTo(0, 0);
    this.router.navigate(['/agb'])
  }
  sendToLandingPage(): void {
    window.scrollTo(0, 0);
    this.router.navigate([''])
  }

  sendToRegister(): void {
    this.router.navigate(['/registration']);
  }
  sendToLogin(): void {
    this.router.navigate(['/login']);
  }
}
