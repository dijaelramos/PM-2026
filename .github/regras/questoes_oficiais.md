# Roteiro — busca e uso de questões oficiais

Complementa a seção 3 de `.github/copilot-instructions.md`. Leia este arquivo antes de procurar questões oficiais, montar listas ou simulados.

## Ordem de busca

1. **Prova de Soldado PMPE 2023** (Instituto AOCP), **só depois do Simulado 1** (veja a reserva nas regras comuns): `Editais/2023/indice_questoes_2023.md` (índice por tópico do edital de 2026, com gabarito definitivo) e `Editais/2023/2023 - PMPE - Prova Soldado.md` (texto das questões).
2. **Banco de provas local** (`Banco_de_Provas/`): procure o tópico em `Banco_de_Provas/indice_por_topico.md`. A ordem de preferência é:
   - outras provas de PM da AOCP: **PMPE 2023 – 2º Tenente** (mesmo concurso de 2023, liberada para treino), PMGO 2022 e PMES 2022;
   - provas da AOCP de outras áreas (`AOCP/Outras_Areas/`: SEJUS-CE, PC-ES, TRT-1, ITEP-RN, UFPB, Câmara de Maringá, EBSERH, DESENBAHIA);
   - outras bancas (FGV/PMSP 2022, CEV-UECE/PMCE 2025).
   Prefira nível médio (PMPE 2023 – 2º Tenente, PMGO 2022, PC-ES 2019 e EBSERH 2017 eram de nível superior). Avise o estudante quando a questão tiver 4 alternativas (SEJUS-CE 2017) ou cobrar versão de programa diferente da do edital (Windows 7, Office 2010/2016).
3. **Se o banco local não tiver questão oficial do tópico, não vá para a Web por padrão** (a ferramenta `web` só abre páginas, não pesquisa, e o site da AOCP bloqueia acesso automatizado):
   - diga quantas questões oficiais existem no banco para o tópico (pode ser zero) e de quais provas;
   - ofereça, nesta ordem: (a) as questões autorais prontas de `Banco_de_Provas/Questoes_Autorais/`; (b) criar uma questão autoral nova, seguindo `.github/regras/questao_autoral_lei.md` quando o tema for lei;
   - só procure provas na Web se o estudante pedir (veja `.github/regras/busca_web.md`).

## Ao apresentar uma questão oficial

- Informe banca, concurso, cargo, estado, ano, número da questão e link ou página do caderno. Avise quando a questão for de outra banca ou de outro concurso, e confira se a legislação cobrada mudou até 29/09/2026 (o índice de 2023 já marca a questão 60).
- Mantenha os destaques `<u>…</u>` e nunca altere, adapte nem complete o texto.
- **Transcrição:** para estudo pessoal, transcreva no chat as questões dos cadernos do repositório, citando a fonte. Para provas de fora, transcreva só as que estiver usando e dê o link.

## Gabaritos no banco

| Situação | Provas | Como apresentar |
|---|---|---|
| Definitivo ou pós-recursos | PMPE 2023 Soldado (reservado), PMPE 2023 Tenente, PMGO 2022, FGV/PMSP 2022 e as 8 da AOCP de outras áreas | "gabarito oficial definitivo" |
| **Preliminar** | **PMES 2022** e **PMCE 2025** | "gabarito preliminar, sujeito a alteração" — nunca como oficial |
| Questão anulada | marcada como `anulada` nos índices | diga que foi anulada; num simulado, conte como acerto (item 19.10 do edital) |

Se faltar gabarito, apresente sua resolução identificada como **análise do tutor**, nunca como gabarito oficial.

## Registro de busca (questões vindas de fora do repositório)

Para cada item candidato, registre banca, concurso, cargo, estado, ano, número, tópico, página, link do caderno, link do gabarito definitivo, tipo/cor/versão do caderno, retificações e recursos conferidos, e a situação (`confirmada`, `gabarito pendente`, `anulada` ou `descartada`, com o motivo). Ao final, informe quantos itens localizou, conferiu, confirmou e descartou. Não descreva a busca como exaustiva se não foi.
