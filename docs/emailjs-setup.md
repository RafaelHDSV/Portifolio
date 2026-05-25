# EmailJS — configuracao do formulario de contato

Passo a passo para ativar o envio de mensagens no portfolio.

## 1. Criar conta

1. Acesse [emailjs.com](https://www.emailjs.com/) e crie uma conta gratuita.
2. Confirme o e-mail.

## 2. Criar um Service

1. No painel, va em **Email Services** > **Add New Service**.
2. Escolha o provedor (Gmail e o mais comum para portfolio).
3. Conecte a conta que recebera as mensagens.
4. Copie o **Service ID** (ex.: `service_xxxxx`).

## 3. Criar um Template

1. Va em **Email Templates** > **Create New Template**.
2. Use variaveis compativeis com o formulario:

| Variavel no template | Campo do form |
|---------------------|---------------|
| `{{from_name}}`     | Nome          |
| `{{email}}`         | E-mail        |
| `{{message}}`       | Mensagem      |

3. Exemplo de corpo:

```
Nova mensagem do portfolio

Nome: {{from_name}}
E-mail: {{email}}

{{message}}
```

4. Copie o **Template ID** (ex.: `template_xxxxx`).

## 4. Public Key

1. Va em **Account** > **General**.
2. Copie a **Public Key**.

## 5. Variaveis de ambiente

Copie `.env.example` para `.env` e preencha:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxx
VITE_EMAILJS_PUBLIC_KEY=sua_public_key
```

## 6. Vercel (producao)

1. Project Settings > Environment Variables.
2. Adicione as tres variaveis `VITE_EMAILJS_*`.
3. Faca redeploy.

## 7. Testar

1. `yarn dev` (sem o `git pull` se estiver offline: use `vite` direto).
2. Abra **Contato** > **Enviar mensagem**.
3. Preencha e envie.
4. Verifique a caixa de entrada do e-mail configurado no Service.

## Troubleshooting

| Problema | Causa provavel |
|----------|----------------|
| Erro generico ao enviar | Variaveis `.env` vazias ou incorretas |
| Template invalido | Nome das variaveis no template diferente do codigo |
| Quota excedida | Plano gratuito EmailJS (200 envios/mes) |
| Gmail bloqueia | Verificar "apps menos seguros" ou usar SMTP |

## Referencia no codigo

- Formulario: `src/components/ContactForm/ContactForm.tsx`
- Variaveis: `src/utils/environment.ts`
