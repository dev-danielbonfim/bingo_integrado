@echo off
title Bingo Colégio Integrado - Modo Offline
color 1F
cls

echo.
echo  ================================================
echo   BINGO COLEGIO INTEGRADO - MODO OFFLINE
echo  ================================================
echo.
echo  Iniciando o servidor local, aguarde...
echo.

:: Verifica se o Node.js está instalado
where node >nul 2>&1
if %errorlevel% neq 0 (
    color 4F
    echo  [ERRO] Node.js nao encontrado!
    echo.
    echo  Para usar o modo offline, instale o Node.js em:
    echo  https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: Encontra o IP local do computador na rede Wi-Fi
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4" ^| findstr /v "127.0.0.1"') do (
    set IP=%%a
    goto :found_ip
)
:found_ip
set IP=%IP: =%

:: Navega para a pasta do backend e inicia o servidor em background
cd /d "%~dp0backend"
start "" /B cmd /c "npm start > ..\servidor_log.txt 2>&1"

:: Aguarda o servidor iniciar
echo  Carregando... (aguarde 5 segundos)
timeout /t 5 /nobreak >nul

:: Abre o navegador automaticamente
echo.
echo  ================================================
echo   SERVIDOR INICIADO COM SUCESSO!
echo  ================================================
echo.
echo  Abrindo o Bingo no navegador...
echo.
start "" "http://localhost:3000"

echo.
echo  ================================================
echo   ENDERECOS PARA OS PAIS E PROJETOR
echo  ================================================
echo.
echo  Neste computador:      http://localhost:3000
echo.
echo  Outros celulares/TVs:  http://%IP%:3000
echo.
echo  (Todos devem estar conectados ao mesmo Wi-Fi
echo   ou ao hotspot deste computador)
echo.
echo  ------------------------------------------------
echo   SENHA DO SORTEADOR: INTEGRADO2026
echo  ------------------------------------------------
echo.
echo  [Para encerrar o servidor, feche esta janela]
echo.
pause >nul
