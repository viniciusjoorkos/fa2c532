# 🚀 Deploy RZ Trader Studio na VPS — Guia Completo

> **Cenário:** VPS Linux com um projeto Next.js já rodando + Nginx + domínio existente apontando.
> Vamos adicionar o projeto Vite (RZ Trader Studio) em um segundo domínio configurado na Hostinger.

---

## 📋 Pré-requisitos

- VPS com Ubuntu 20.04+ (ou Debian)
- Nginx já instalado e funcionando
- Node.js instalado (mínimo v20 — se não tiver, veremos abaixo)
- Git instalado
- Projeto no GitHub
- Domínio registrado na Hostinger apontando para o IP da VPS

---

## PARTE 1 — Configurar DNS na Hostinger

### 1.1 Apontar o domínio para sua VPS

1. Acesse [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Vá em **Domínios → Gerenciar → DNS / Zona DNS**
3. Localize o registro **Tipo A** do domínio raiz (`@`) e altere o valor para o **IP da sua VPS**
4. Faça o mesmo para o subdomínio `www`:

```
Tipo   Nome   Valor (IP da VPS)    TTL
A      @      SEU.IP.DA.VPS        3600
A      www    SEU.IP.DA.VPS        3600
```

> ⚠️ Propagação de DNS pode levar até 24h mas geralmente leva minutos.

Verifique a propagação com:
```bash
dig seudominio.com +short
# Deve retornar o IP da VPS
```

---

## PARTE 2 — Configurar o Projeto na VPS

### 2.1 Conectar na VPS via SSH

```bash
ssh root@SEU.IP.DA.VPS
# ou
ssh usuario@SEU.IP.DA.VPS
```

### 2.2 Verificar/Instalar Node.js v20+

```bash
node -v
# Se for menor que 20, instale:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v  # confirmar v20+
npm -v
```

### 2.3 Instalar PM2 (processo persistente)

```bash
npm install -g pm2
pm2 -v
```

### 2.4 Clonar o Repositório do GitHub

```bash
# Escolha um diretório organizado para seus projetos
cd /var/www
git clone https://github.com/SEU_USUARIO/SEU_REPO.git rz-trader-studio
cd rz-trader-studio
```

> Se o repositório for **privado**, use SSH ou Personal Access Token:
> ```bash
> git clone https://SEU_TOKEN@github.com/SEU_USUARIO/SEU_REPO.git rz-trader-studio
> ```

### 2.5 Criar o arquivo .env na VPS

```bash
cd /var/www/rz-trader-studio
nano .env
```

Coloque o conteúdo:
```env
VITE_SUPABASE_URL=https://ltxkawmjclhzwfxzrtfj.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=ltxkawmjclhzwfxzrtfj
```

Salvar: `Ctrl+O → Enter → Ctrl+X`

### 2.6 Instalar dependências e fazer o Build

```bash
cd /var/www/rz-trader-studio
npm install
npm run build
```

> O comando `npm run build` vai gerar a pasta `dist/` com os arquivos estáticos.
> **Importante:** projetos Vite geram arquivos estáticos — não precisam de processo Node rodando continuamente. O Nginx serve diretamente.

Confirme que a pasta `dist/` foi criada:
```bash
ls dist/
# index.html  assets/
```

---

## PARTE 3 — Configurar Nginx para o Segundo Domínio

### 3.1 Entender a estrutura do Nginx

Os arquivos de configuração ficam em:
- `/etc/nginx/sites-available/` — configurações disponíveis
- `/etc/nginx/sites-enabled/` — links para as ativas (symlinks)

Seu projeto Next.js já tem um arquivo lá. Vamos criar um **novo** para o RZ Trader Studio **sem tocar no existente**.

### 3.2 Verificar o projeto Next.js existente (não mexa)

```bash
ls /etc/nginx/sites-enabled/
# Você verá algo como: default, seuoutrosite.com, nextjs-app, etc.
cat /etc/nginx/sites-enabled/NOME_DO_ARQUIVO_EXISTENTE
# Apenas para visualizar — não edite
```

### 3.3 Criar o arquivo de configuração para o Vite

```bash
sudo nano /etc/nginx/sites-available/rz-trader-studio
```

Cole o conteúdo abaixo (substituindo `seudominio.com` pelo seu domínio real):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name seudominio.com www.seudominio.com;

    root /var/www/rz-trader-studio/dist;
    index index.html;

    # Compressão gzip para performance
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/x-javascript application/xml application/json image/svg+xml;

    # Cache para assets estáticos (imagens, js, css)
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # SPA fallback — essencial para React Router funcionar
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Segurança básica
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
```

Salvar: `Ctrl+O → Enter → Ctrl+X`

### 3.4 Ativar o site (criar symlink)

```bash
sudo ln -s /etc/nginx/sites-available/rz-trader-studio /etc/nginx/sites-enabled/rz-trader-studio
```

### 3.5 Testar a configuração do Nginx

```bash
sudo nginx -t
# Resultado esperado:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

> ⚠️ Se der erro, revise o arquivo criado. O erro mais comum é esquecer o `;` no final das linhas.

### 3.6 Recarregar o Nginx

```bash
sudo systemctl reload nginx
# NÃO use restart — reload aplica as novas configs sem derrubar o projeto Next.js
```

---

## PARTE 4 — SSL com Let's Encrypt (HTTPS)

### 4.1 Instalar o Certbot

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

### 4.2 Gerar o certificado SSL

```bash
sudo certbot --nginx -d seudominio.com -d www.seudominio.com
```

O Certbot vai:
1. Perguntar seu e-mail (para avisos de renovação)
2. Pedir para aceitar os termos — `Y`
3. Perguntar se quer redirecionar HTTP → HTTPS — escolha **2 (Redirect)**
4. Configurar o SSL automaticamente no arquivo Nginx

### 4.3 Verificar renovação automática

```bash
sudo certbot renew --dry-run
# Deve retornar "Congratulations, all simulated renewals succeeded"
```

### 4.4 Verificar o cron de renovação

```bash
sudo systemctl status certbot.timer
# Deve estar active (running)
```

---

## PARTE 5 — Testar o Deploy

```bash
# Verificar se o Nginx está rodando
sudo systemctl status nginx

# Ver os logs em tempo real (útil para debug)
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

Acesse no navegador:
- `https://seudominio.com` → deve abrir o RZ Trader Studio
- `https://seuoutrodominio.com` → deve continuar funcionando (Next.js intacto)

---

## PARTE 6 — Atualizar o projeto (deploy contínuo)

Quando você fizer um push no GitHub e quiser atualizar a VPS:

```bash
cd /var/www/rz-trader-studio
git pull origin main
npm install           # só se mudou package.json
npm run build         # regerar o dist/
# Não precisa reiniciar Nginx — ele já serve o dist/ diretamente
```

### 6.1 Script de deploy automático (opcional)

Crie um script para facilitar:

```bash
nano /var/www/rz-trader-studio/deploy.sh
```

```bash
#!/bin/bash
echo "🚀 Iniciando deploy RZ Trader Studio..."
cd /var/www/rz-trader-studio
git pull origin main
npm install --silent
npm run build
echo "✅ Deploy concluído!"
```

```bash
chmod +x /var/www/rz-trader-studio/deploy.sh
# Para usar: ./deploy.sh
```

---

## PARTE 7 — Estrutura final da VPS

```
/var/www/
├── projeto-nextjs/           ← projeto existente (não mexeu)
│   └── ...
└── rz-trader-studio/         ← novo projeto
    ├── dist/                 ← arquivos servidos pelo Nginx
    ├── src/
    ├── .env
    └── deploy.sh

/etc/nginx/
├── sites-available/
│   ├── seuoutrosite.com      ← existente (não mexeu)
│   └── rz-trader-studio      ← novo
└── sites-enabled/
    ├── seuoutrosite.com → ../sites-available/seuoutrosite.com
    └── rz-trader-studio → ../sites-available/rz-trader-studio
```

---

## ❓ Problemas Comuns

### Página em branco ou 404 nas rotas internas

O `try_files $uri $uri/ /index.html;` garante que o React Router funcione. Se ainda der 404, verifique se essa linha está no arquivo Nginx.

### Nginx não recarrega após mudança

```bash
sudo nginx -t            # verificar sintaxe
sudo systemctl reload nginx
```

### Erro de permissão na pasta dist/

```bash
sudo chown -R www-data:www-data /var/www/rz-trader-studio/dist
sudo chmod -R 755 /var/www/rz-trader-studio/dist
```

### Certbot falha — DNS ainda não propagou

Aguarde a propagação e tente novamente:
```bash
dig seudominio.com +short   # deve mostrar o IP da VPS
sudo certbot --nginx -d seudominio.com -d www.seudominio.com
```

### Ver qual porta o Next.js usa (não conflitar)

```bash
sudo netstat -tlnp | grep node
# ou
sudo ss -tlnp | grep node
```

O Nginx faz proxy para o Next.js — o RZ Trader Studio é servido diretamente como estático, então não há conflito de porta.

---

## ✅ Checklist Final

- [ ] DNS na Hostinger apontando para IP da VPS
- [ ] Node.js v20+ instalado
- [ ] Repositório clonado em `/var/www/rz-trader-studio`
- [ ] `.env` criado com as variáveis do Supabase
- [ ] `npm run build` gerou a pasta `dist/`
- [ ] Arquivo Nginx criado em `sites-available/`
- [ ] Symlink criado em `sites-enabled/`
- [ ] `nginx -t` passou sem erros
- [ ] `systemctl reload nginx` executado
- [ ] Certbot gerou SSL com sucesso
- [ ] Site acessível via `https://seudominio.com`
- [ ] Projeto Next.js existente continua funcionando
