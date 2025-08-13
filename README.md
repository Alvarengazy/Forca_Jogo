<div align="center">

# Jogo da Forca ⚡ Neo

Um remake moderno, acessível e estiloso do clássico jogo da forca – sem enforcamento, com foco em UX positiva, efeitos visuais e acessibilidade real.

[![Status](https://img.shields.io/badge/status-active-success?style=flat-square)](#)  
[![Feito com](https://img.shields.io/badge/feito_com-HTML5%20|%20CSS3%20|%20JS-blue?style=flat-square)](#)  
[![Acessível](https://img.shields.io/badge/acessibilidade-WAI--ARIA-green?style=flat-square)](#)  
[![License](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)](#licenca)

<br>

<img width="2527" height="1067" alt="Image" src="https://github.com/user-attachments/assets/6f294959-946d-459d-a283-5a155c60f7fe" />
<br>
<sub>(adicione capturas reais em /docs para valor extra)</sub>

</div>

## 🎮 Link do Jogo
 - https://alvarengazy.github.io/Forca_Jogo/

## ✨ Principais Recursos

- 🎯 Categorias dinâmicas carregadas de `words.json` (fácil expandir)
- 🎹 Teclado virtual + suporte total a teclado físico
- ❤️ Sistema de saúde (8 erros) com animações de corações
- 🌓 Tema claro/escuro com transições suaves + gradiente animado
- 🔊 Web Audio + efeitos sonoros + síntese de fala (mutável)
- 🗣️ Live regions & feedback falado (acessibilidade real)
- 🎉 Partículas, confete em vitória / derrota e pulsos interativos
- 🧩 Diálogos nativos (`<dialog>`) para pausa e resultado (fallback incluso)
- ♿ Navegável 100% via teclado (skip link, foco visível, ARIA)
- 🧪 Código modular simples pronto para evoluir em componentes

## 🚀 Demo Local
Clone e sirva estático (qualquer servidor). Exemplos:

### PowerShell (Windows)
```powershell
git clone <URL_DO_SEU_REPO>.git
cd Jogo_Forca
python -m http.server 5500
# Abra em: http://localhost:5500/index.html
```

### Node (npx serve)
```bash
npx serve .
```

### Extensão VS Code
Use “Live Server” ou similar e abra `index.html`.

## 🗂️ Estrutura
```
index.html     # Estrutura principal (telas + dialogs)
style.css      # Estilos, temas, animações e responsivo
script.js      # Lógica do jogo, acessibilidade, efeitos
words.json     # Base de dados de categorias e palavras
README.md      # Este arquivo
docs/          # (Opcional) screenshots / assets para o GitHub
```

## ⚙️ Configurações Rápidas
| O que | Onde | Como |
|-------|------|------|
| Nº máximo de erros | `script.js` | `state.maxWrong = 8` |
| Adicionar categoria | `words.json` | Nova chave + array |
| Desativar fala | UI (ícone mute) | Botão 🔊 / 🔇 |
| Alterar tema inicial | `index.html` | adicionar `data-theme="light"` no `<html>` |

## 🛠️ Personalização
- Cores: edite variáveis em `:root` e `[data-theme="light"]` no `style.css`.
- Palavras: expanda `words.json` (UTF-8, pode ter acentos; script normaliza internamente).
- Sons: substitua a função `playTone` por samples reais se quiser.
- Acessibilidade: ajuste mensagens da função `speak`.

## ♿ Acessibilidade (Checklist)
| Item | Implementado |
|------|--------------|
| Skip link | ✅ |
| Navegação só teclado | ✅ |
| Indicadores de foco visíveis | ✅ |
| ARIA live region para status | ✅ |
| Ícones com texto/aria label | ✅ |
| Suporte a `Esc` (pausa/fechar) | ✅ |
| Speech Synthesis opcional | ✅ |

## 🔐 Privacidade
Sem coleta de dados. Todo processamento é local no navegador.

## 🧭 Roadmap (Ideias Futuras)
- [ ] Ranking local (LocalStorage)
- [ ] Modo contra o tempo ⏱️
- [ ] Multiplayer simples (turnos em mesma tela)
- [ ] Exportar estatísticas JSON
- [ ] Suporte PWA (instalável offline)

## 🤝 Contribuindo
1. Faça um fork
2. Crie um branch: `git checkout -b feat/minha-ideia`
3. Commit: `git commit -m "feat: adiciona ..."`
4. Push: `git push origin feat/minha-ideia`
5. Abra um Pull Request

Sugestões, issues e melhorias são muito bem-vindas.

## 🧪 Qualidade / Boas Práticas
- Sem dependências externas obrigatórias
- Uso de variáveis CSS para fácil theming
- Funções JS coesas e curtas
- Fallback para browsers sem `<dialog>`

## 💡 Dicas de Extensão
- Adicione uma categoria “Mistério” que sorteia de todas as demais.
- Inclua sons de vitória/derrota com arquivos `.mp3` / `.wav`.
- Adapte para mobile fullscreen com PWA + ícone.

## 📜 Licença
Alvarengazy

---
<div align="center">
Feito com ❤️, criatividade e JavaScript. Divirta-se!<br>
Se curtir ⭐ marque o repositório.
</div>


