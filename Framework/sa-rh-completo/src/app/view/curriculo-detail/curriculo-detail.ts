import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CurriculoService } from '../../service/curriculo.service';
import { Curriculo } from '../../model/curriculo.model';

@Component({
  standalone: true,
  selector: 'app-curriculo-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './curriculo-detail.html',
  styleUrl: './curriculo-detail.scss',
})
export class CurriculoDetail implements OnInit {
  public curriculo?: Curriculo;
  private usuarioIdLogado = 1;

  constructor(private curriculoService: CurriculoService) {}

  ngOnInit(): void {
    this.curriculoService.getCurriculoByUsuarioId(this.usuarioIdLogado).subscribe((result) => {
      this.curriculo = result.length ? result[0] : undefined;
    });
  }
}
