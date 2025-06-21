export type LogItem = {
  id: string; // pode ser um UUID ou timestamp
  produto: string;
  acao: 'Adicionado' | 'Removido' | 'Excluído';
  data: string; // ISO string ou formatada
};
