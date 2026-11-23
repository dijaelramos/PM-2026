# Relatórios do app

O app **PMPE Ouvir** grava aqui o desempenho do estudante quando ele toca em **Meus dados → Enviar relatório**:

- `AAAA-MM-DD.md`: o relatório do dia (um por dia; enviar de novo no mesmo dia substitui);
- `ultimo.md`: cópia do mais recente, que é o que o [Orquestrador](../.github/agents/orquestrador-estudos-pmpe.agent.md) lê primeiro.

O conteúdo é gerado pelo app: desempenho por disciplina e por item do edital, respostas de cada material do dia, simulados, redações e atividade. O Orquestrador usa esses dados para corrigir as respostas e atualizar o [perfil](../Perfil_do_Estudante.md), sempre com a confirmação do estudante.

**Configuração (uma vez, no celular):** em Meus dados → "Ligar ao GitHub", cole um *token* de acesso do GitHub com permissão só de escrita no conteúdo deste repositório (*fine-grained token*, repositório `PM-2026`, permissão **Contents: Read and write**). O token fica só no celular. O repositório é público: o relatório também fica público, como o perfil.
