import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent implements OnInit, OnDestroy {
  constructor(private renderer: Renderer2,
    private router: Router) { }
  ngOnDestroy(): void {
    // Setzen Sie hier weitere Stile
    document.body.classList.remove('landingpage-body');
  }
  ngOnInit(): void {
    document.body.classList.add('landingpage-body');
    
    // Entfernen Sie hier weitere Stile
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


  sendToRegister(): void {
    window.scrollTo(0, 0);
    this.router.navigate(['/registration']);
  }
  sendToLogin(): void {
    window.scrollTo(0, 0);
    this.router.navigate(['/login']);
  }
}

