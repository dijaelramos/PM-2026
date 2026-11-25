"""Teste do robô: posta AGORA, uma vez só, a aula de hoje e o Short 1/3 de hoje, e termina.

Uso (na pasta do projeto ou dentro de canal/):
    python canal/robo_teste.py

Usa as mesmas funções do robo.py (mesmo Chrome, mesma visibilidade de config.json) e anota o que postar em
canal/.postados.json. Assim o robô principal, quando for ligado, não posta de novo o que o teste já postou.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import robo as R  # noqa: E402


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    tarefas = R.tarefas_do_dia(R.agora().date())
    escolhidas = [t for t in tarefas if t["tipo"] == "aula"][:1] + \
                 [t for t in tarefas if t["tipo"] == "short" and t["n"] == 1]
    if not escolhidas:
        print("Hoje não há material (fim de semana ou dia sem sessão): nada para testar.")
        return 1
    vis = R.visibilidade()
    for t in escolhidas:
        ja = R.registro().get(t["chave"])
        if ja:
            R.log(f"{t['nome']}: já postado antes ({ja.get('link')}); pulando")
            continue
        R.log(f"TESTE: postando {t['nome']} como {vis}")
        try:
            item = R.preparar(t)
            if not item:
                R.log("  nada para postar neste material")
                continue
            link = R.postar(*item[:3], vis, item[3])
        except Exception as erro:
            R.log(f"  ERRO: {erro}")
            R.log("  O teste parou aqui. Mande a mensagem acima e a foto de canal/saida/_erros/ para ajuste.")
            return 1
        R.registrar(t["chave"], link)
        R.log(f"  postado: {link}")
    R.log("Teste concluído. Confira em YouTube Studio > Conteúdo (aba Vídeos e aba Shorts).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
