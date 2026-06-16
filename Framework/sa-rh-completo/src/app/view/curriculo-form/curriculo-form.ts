import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CurriculoService } from '../../service/curriculo.service';
import { Curriculo } from '../../model/curriculo.model';

@Component({
  standalone: true,
  selector: 'app-curriculo-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './curriculo-form.html',
  styleUrl: './curriculo-form.scss',
})
export class CurriculoForm implements OnInit {
  public form!: FormGroup;
  public isEditMode = false;
  public pageTitle = 'Cadastrar Currículo';
  private currentUserId = 1;
  private curriculoId?: string;

  constructor(
    private fb: FormBuilder,
    private curriculoService: CurriculoService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      formacao: ['', Validators.required],
      experiencia: ['', Validators.required],
      habilidades: ['', Validators.required],
      linkedin: ['', Validators.required],
      resumo: [''],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.pageTitle = 'Editar Currículo';
      this.curriculoId = id;
      this.loadCurriculo(this.curriculoId);
    }
  }

  private loadCurriculo(id: string): void {
    this.curriculoService.getCurriculoById(id).subscribe((curriculo) => {
      this.form.patchValue({
        nome: curriculo.nome,
        email: curriculo.email,
        telefone: curriculo.telefone,
        formacao: curriculo.formacao,
        experiencia: curriculo.experiencia,
        habilidades: curriculo.habilidades,
        linkedin: curriculo.linkedin,
        resumo: curriculo.resumo,
      });
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const curriculo = new Curriculo(
      this.curriculoId ?? '',
      this.currentUserId,
      this.form.value.nome,
      this.form.value.email,
      this.form.value.telefone,
      this.form.value.formacao,
      this.form.value.experiencia,
      this.form.value.habilidades,
      this.form.value.linkedin,
      this.form.value.resumo,
    );

    if (this.isEditMode && this.curriculoId) {
      this.curriculoService.putCurriculo(curriculo).subscribe(() => {
        alert('Currículo atualizado com sucesso.');
        this.router.navigate(['/meu-curriculo']);
      });
    } else {
      this.curriculoService.postCurriculo(curriculo).subscribe(() => {
        alert('Currículo cadastrado com sucesso.');
        this.router.navigate(['/meu-curriculo']);
      });
    }
  }

  get field() {
    return this.form.controls;
  }
}
