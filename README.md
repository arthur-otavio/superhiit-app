# SuperHIIT · app Android e iPhone

App de celular da academia **SuperHIIT** (Nexalyze). Feito com Expo, abre o sistema (https://superhiit.nexalyze.com.br) num WebView e acrescenta o que o navegador não faz bem: **notificações push nativas**, compartilhar PDF/foto, botão voltar do Android e tela de abertura.

- Pacote / Bundle ID: `br.com.nexalyze.superhiit`
- Projeto EAS: `@arthur_silva_1/superhiit` (projectId em `app.json` › `extra.eas.projectId`)
- Firebase: projeto `superhiit-academia`, app Android `1:188887993507:android:a8134e32cbcff8ec350316`

## Como o push funciona

1. O app pede permissão e gera o **Expo push token** com o projectId do EAS (`App.js`).
2. O token vai para o usuário no Firestore pelo site.
3. O `superhiit-backend` (`src/push.js`) envia para `https://exp.host/--/api/v2/push/send`; a Expo entrega pelo FCM (Android) e pelo APNs (iPhone).

O que faz o Android funcionar:
- `google-services.json` na raiz (o `app.config.js` liga sozinho quando o arquivo existe);
- credencial **FCM V1** no EAS: chave da conta `firebase-adminsdk-fbsvc@superhiit-academia.iam.gserviceaccount.com`, já enviada. Veja em `npx eas-cli credentials -p android`.

## Rodar localmente

```bash
npm install
npx expo start
```

O push não funciona no Expo Go: teste no APK.

## Gerar o APK (Android)

```bash
npx eas-cli login
npm run apk            # eas build --platform android --profile preview
```

Para publicar no site, baixe o APK do build e envie para a release `app-android` do `superhiit-frontend`:

```bash
gh release upload app-android superhiit.apk --clobber --repo arthur-otavio/superhiit-frontend
gh workflow run deploy.yml --repo arthur-otavio/superhiit-frontend
```

Em cada versão nova, aumente `version` e `android.versionCode` em `app.json`. A chave de assinatura (keystore) fica guardada no EAS: não apague, senão o APK novo não instala por cima do antigo.

## iPhone

Veja [IPHONE.md](IPHONE.md) (conta Apple Developer, App Store Connect, `eas build`/`eas submit`).

## Estrutura

```
App.js            WebView, push, download/compartilhar, voltar do Android
app.json          nome, ícones, permissões, plugins, projectId do EAS
app.config.js     liga o google-services.json e o projectId
eas.json          perfis de build (preview = APK, production = AAB/iOS)
google-services.json   Firebase do Android (não é segredo)
assets/           ícone, ícone adaptativo e tela de abertura
```
