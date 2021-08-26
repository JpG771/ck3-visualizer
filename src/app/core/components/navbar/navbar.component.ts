import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Ck3Service } from '../../services/ck3.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {

  constructor(public ck3Service: Ck3Service) { }

  ngOnInit(): void {
  }

}
