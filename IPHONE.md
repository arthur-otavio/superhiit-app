# App SuperHIIT no iPhone (App Store)

O código já está pronto para iPhone. Falta só a parte da Apple, que precisa da sua conta.
Não precisa de Mac: o EAS (Expo) gera e envia o app pela nuvem.

## 1. Conta Apple Developer (uma vez)
1. Acesse https://developer.apple.com/programs/enroll e entre com seu Apple ID (precisa de verificação em duas etapas).
2. Escolha **Pessoa física** (mais rápido, aparece seu nome na loja) ou **Empresa** (precisa do número D-U-N-S do CNPJ, grátis, leva alguns dias).
3. Pague a anuidade (US$ 99). A aprovação costuma sair em 1 a 2 dias.

## 2. Criar o app no App Store Connect (uma vez)
1. https://appstoreconnect.apple.com › Apps › **+** › Novo app.
2. Plataforma iOS · Nome **SuperHIIT** · Idioma Português (Brasil) · Bundle ID **br.com.nexalyze.superhiit** · SKU `superhiit`.
3. Copie o **Apple ID** numérico do app (Informações do app) e coloque em `eas.json` no lugar de `PREENCHER_DEPOIS_DE_CRIAR_O_APP_NO_APP_STORE_CONNECT`.

## 3. Gerar e enviar (cada versão)
```bash
npm install
npx eas login
npx eas init                                   # só na primeira vez (cria o projectId)
npx eas build --platform ios --profile production
npx eas submit --platform ios --profile production
```
- No primeiro build o EAS pede o login da Apple e **cria sozinho** os certificados e a chave de notificações (APNs). Responda **Sim** para tudo.
- Para cada versão nova, aumente `ios.buildNumber` em `app.json` (1, 2, 3...).

## 4. Testar antes de publicar (TestFlight)
Depois do `eas submit`, o build aparece no App Store Connect › TestFlight em uns 15 minutos.
Adicione seu e-mail e o da recepção como testadores e instale pelo app **TestFlight** no iPhone.

## 5. Enviar para a revisão da Apple
No App Store Connect, na versão do app, preencha:
- **Capturas de tela** do iPhone 6,7" (pode tirar do próprio app no TestFlight).
- **Descrição**, palavras-chave, categoria **Saúde e fitness**.
- **URL de suporte**: https://superhiit.nexalyze.com.br · **Política de privacidade**: https://superhiit.nexalyze.com.br/privacidade
- **Privacidade do app**: dados coletados = nome, e-mail, telefone, CPF, dados de saúde/fitness (ficha e avaliações), fotos (stories); usados só para o funcionamento do app; não usados para rastreamento.
- **Login de demonstração** (obrigatório): crie um aluno de teste, por exemplo `revisao.apple@superhiit.com.br`, com senha já trocada, plano ativo, ficha montada e um carnê. Escreva nas notas: *"O app é exclusivo para alunos da academia. A exclusão de conta fica em Perfil › Excluir minha conta."*
- Pagamentos: o plano é pago na academia (serviço presencial), então **não** usa compra pela App Store.

A revisão leva de 1 a 3 dias. Se a Apple pedir ajustes, mande a mensagem dela que eu corrijo.
