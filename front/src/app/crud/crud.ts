// ...existing code...
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiPessoas } from '../servico/api-pessoas';
import { MatButtonModule } from '@angular/material/button';
import { Pessoa } from '../modelo/Pessoa';
import { MatTableModule } from '@angular/material/table';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    ReactiveFormsModule
  ],
  templateUrl: './crud.html',
  styleUrls: ['./crud.css']
})
export class Crud implements OnInit {

  // Visibilidade dos botões
  btnCadastrar: boolean = true;

  // Colunas da tabela
  colunas: string[] = ['id', 'nome', 'cidade', 'selecionar'];

  // Vetor para armazenar as pessoas
  vetor: Pessoa[] = [];

  // Objeto - Formulário Reativo
  formularioPessoa = new FormGroup({
    id     : new FormControl(),
    nome   : new FormControl(),
    cidade : new FormControl()
  });

  // Construtor
  constructor(private servico: ApiPessoas) { }

  // ngOnInit - Executa este método após o componente ser montado
  ngOnInit(): void {
    this.listar();
  }

  // Método para selecionar todas as pessoas da API
  listar(): void {
    this.servico.listar().subscribe(pessoas => this.vetor = pessoas);
  }

  // Método para cadastrar pessoas
  cadastrar(): void {
    let obj = { ...this.formularioPessoa.value };
    delete obj.id;
    this.servico.cadastrar(obj).subscribe(pessoa => this.vetor = [...this.vetor, pessoa]);
    this.formularioPessoa.reset();
  }

  // MÃ©todo para selecionar uma pessoa específica
selecionarPessoa(id:string):void{
  this.servico.selecionarPessoa(id).subscribe(pessoa => {
    
    // Disponibiliza um objeto com as características: id, nome e cidade para o nosso formulÃ¡rio reativo
    this.formularioPessoa.patchValue(pessoa);

    // Visibilidade dos botões
    this.btnCadastrar = false;
  });
}

// Método para cancelar as ações de alteração e remoção
cancelar():void{
  this.formularioPessoa.reset();
  this.btnCadastrar = true;


}

// MÃ©todo para alterar dados
alterar():void{
  this.servico.alterar(this.formularioPessoa.value)
  .subscribe(pessoa => {

    // Obter o Ã­ndice da pessoa alterada no vetor
    const indicePessoaAlterada = this.vetor.findIndex(obj => obj.id === pessoa.id);

    // Atualizar valor do vetor
    this.vetor[indicePessoaAlterada] = pessoa;

    // ForÃ§ar a atualizaÃ§Ã£o do vetor (para exibir corretamente na tabela)
    this.vetor = [...this.vetor];

    // Visibilidade dos botÃµes e limpeza dos campos
    this.cancelar();
  });
}
// MÃ©todo para remover pessoas
remover():void{
  this.servico.remover(this.formularioPessoa.value.id)
  .subscribe(pessoa => {

    // Obter o Ã­ndice da pessoa removida no vetor
    const indicePessoaRemovida = this.vetor.findIndex(obj => obj.id === pessoa.id);

    // Efetuar a remoÃ§Ã£o no vetor
    this.vetor.splice(indicePessoaRemovida, 1);

    // ForÃ§ar a atualizaÃ§Ã£o do vetor (para exibir corretamente na tabela)
    this.vetor = [...this.vetor];

    // Visibilidade dos botÃµes e limpeza dos campos
    this.cancelar();
  });
}

}