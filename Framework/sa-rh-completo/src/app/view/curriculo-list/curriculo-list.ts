import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CurriculoService } from '../../service/curriculo.service';
import { Curriculo } from '../../model/curriculo.model';

@Component({
  standalone: true,
  selector: 'app-curriculo-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './curriculo-list.html',
  styleUrl: './curriculo-list.scss',
})
export class CurriculoList implements OnInit {
  public curriculos: Curriculo[] = [];

  constructor(private curriculoService: CurriculoService) {}

  ngOnInit(): void {
    this.curriculoService.getCurriculos().subscribe((result) => {
      this.curriculos = result;
    });
  }

  deleteCurriculo(id: number): void {
    if (!confirm('Deseja excluir este currículo?')) {
      return;
    }

    this.curriculoService.deleteCurriculo(id).subscribe(() => {
      this.curriculos = this.curriculos.filter((item) => item.id !== id);
      alert('Currículo excluído com sucesso.');
    });
  }
}
