@echo off
rem Liga o robo do canal em qualquer computador com Windows 10/11.
rem   - confere o Python (instala o 3.12 pelo winget, se faltar);
rem   - o robo instala sozinho os pacotes que faltarem e atualiza uma vez por semana;
rem   - quando o codigo do robo for atualizado (git pull), ele reinicia sozinho.
rem Uso: duplo clique neste arquivo, ou no terminal:  canal\iniciar_robo.bat   (ou com --login, --testar, --simular)
chcp 65001 >nul
setlocal
pushd "%~dp0"

rem Ordem: o "python" normal; depois 3.12, 3.13 e 3.11 pelo py (evita o 3.13t experimental, sem pacotes prontos)
set "PY="
python --version >nul 2>nul && set "PY=python"
if not defined PY py -3.12 --version >nul 2>nul && set "PY=py -3.12"
if not defined PY py -3.13 --version >nul 2>nul && set "PY=py -3.13"
if not defined PY py -3.11 --version >nul 2>nul && set "PY=py -3.11"
if not defined PY (
  echo Python nao encontrado. Instalando o Python 3.12 pelo winget...
  winget install -e --id Python.Python.3.12 --accept-source-agreements --accept-package-agreements
  echo.
  echo Python instalado. Feche esta janela e abra de novo o iniciar_robo.bat.
  pause
  exit /b 1
)
echo Usando: %PY%

:loop
%PY% robo.py %*
if %errorlevel%==3 (
  echo Robo atualizado: reiniciando...
  goto loop
)
popd
pause
