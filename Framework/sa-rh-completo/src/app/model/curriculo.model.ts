export class Curriculo {
  constructor(
    public id: string,
    public usuarioId: number,
    public nome: string,
    public email: string,
    public telefone: string,
    public formacao: string,
    public experiencia: string,
    public habilidades: string,
    public linkedin: string,
    public resumo: string,
  ) {}

  toMap(): { [key: string]: any } {
    return {
      id: this.id,
      usuarioId: this.usuarioId,
      nome: this.nome,
      email: this.email,
      telefone: this.telefone,
      formacao: this.formacao,
      experiencia: this.experiencia,
      habilidades: this.habilidades,
      linkedin: this.linkedin,
      resumo: this.resumo,
    };
  }

  fromMap(map: any): Curriculo {
    return new Curriculo(
      String(map.id),
      map.usuarioId,
      map.nome,
      map.email,
      map.telefone,
      map.formacao,
      map.experiencia,
      map.habilidades,
      map.linkedin,
      map.resumo,
    );
  }
}
