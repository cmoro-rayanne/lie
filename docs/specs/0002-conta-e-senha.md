# Spec 0002 — Minha conta e “esqueci minha senha”

## Objetivo

Quem usa o painel troca a própria senha, cadastra um e-mail de recuperação e, se esquecer a senha, recebe um
link por e-mail para escolher outra, sem depender do suporte. Continua valendo a spec 0001 (um acesso só).

## Decisões

- **Senha guardada no banco** (`admin_account`), como PBKDF2-SHA256 com sal aleatório. Enquanto ninguém definir
  uma senha, vale a do secret `ADMIN_PASSWORD` (senha inicial). Depois da primeira troca ou redefinição, o secret
  deixa de valer.
- **Sessão** continua em cookie assinado; a chave agora deriva da senha em vigor. Trocar ou redefinir a senha
  encerra as outras sessões; quem trocou pelo painel segue logado com um cookie novo.
- **Aba “Minha conta”**: nome, e-mail de recuperação e troca de senha. Esses dados valem na hora e não passam por
  rascunho/publicação.
- **Mudar o e-mail de recuperação exige a senha atual**: é o e-mail que permite redefinir a senha, então uma sessão
  esquecida aberta não basta para tomar a conta.
- **Senha nova**: de 10 a 200 caracteres, com letras e números.
- **Esqueci minha senha**: a resposta é a mesma exista ou não o e-mail (não revela qual é o cadastrado). O link
  vale 30 minutos, uma vez só; pedir outro invalida o anterior. O token vai no fragmento do endereço
  (`/admin/#redefinir=<token>`), que não chega ao servidor nem aos logs, e o banco guarda só o SHA-256 dele.
- **Limite por IP em 15 minutos**: 5 pedidos de link, 8 links inválidos, 8 senhas atuais erradas (além dos 8 erros
  de login da spec 0001).
- **Envio pelo e-mail da hospedagem (HostGator), por SMTP**, com a biblioteca `worker-mailer` (TCP direto do
  Worker; exige `nodejs_compat`). Sem os secrets de SMTP, o painel avisa em “Minha conta” que a recuperação está
  desligada.

## Design

- `worker/password.ts`: hash, conferência e regra da senha; token aleatório e SHA-256.
- `worker/account.ts`: `AccountService` (`credential`, `view`, `updateProfile`, `changePassword`, `requestReset`,
  `resetPassword`) sobre as portas `AccountRepo` e `Mailer`.
- `worker/smtp.ts`: `SmtpMailer` (porta 465 com TLS direto; outras com STARTTLS).
- `worker/d1-repo.ts`: `D1AccountRepo`. Migration `migrations/0002_conta.sql`: `admin_account`, `password_resets`.
- Rotas novas: públicas `POST /api/forgot` e `POST /api/reset`; com sessão `GET|PUT /api/account` e
  `PUT /api/account/password`.
- Painel: telas “Esqueci minha senha” e “Escolha uma senha nova” fora do login; aba “Minha conta” dentro.

## Fora desta entrega

- Vários usuários, verificação do e-mail de recuperação por código, autenticação em dois fatores.
- E-mail em HTML (vai só em texto).

## Critérios de aceite

- [x] Antes de qualquer troca, entra a senha do secret; depois, só a senha guardada.
- [x] Trocar a senha exige a atual; senha fraca é recusada com a regra violada.
- [x] Sessão aberta antes da troca deixa de valer.
- [x] Mudar o e-mail de recuperação sem a senha atual (ou com ela errada) é recusado; mudar só o nome não pede senha.
- [x] O link só é enviado para o e-mail cadastrado; a resposta é igual nos dois casos.
- [x] Link usado, vencido, inventado ou substituído por um pedido mais novo não redefine a senha.
- [x] O token não é guardado em texto e sai do endereço assim que a tela abre.
- [ ] Envio real pelo servidor da HostGator (depende dos secrets de SMTP em produção).
