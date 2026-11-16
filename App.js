import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Image, Linking, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

SplashScreen.preventAutoHideAsync().catch(() => {});

const SITE = (process.env.EXPO_PUBLIC_SITE_URL || 'https://superhiit.nexalyze.com.br').replace(/\/$/, '');
const HOST = SITE.replace(/^https?:\/\//, '');
const AMARELO = '#FFE600';

// Links de fora (WhatsApp, Instagram, mapas, e-mail) abrem no app certo do celular, não dentro do WebView.
// O site manda PDF do carnê e foto de stories em base64; o app grava e abre o compartilhar do Android.
async function receberArquivo(evento) {
  let msg;
  try { msg = JSON.parse(evento.nativeEvent.data); } catch { return; }
  if (msg?.tipo !== 'arquivo' || !msg.base64) return;
  const nome = String(msg.nome || 'arquivo').replace(/[^\w.-]+/g, '-');
  const uri = `${FileSystem.cacheDirectory}${nome}`;
  await FileSystem.writeAsStringAsync(uri, msg.base64, { encoding: FileSystem.EncodingType.Base64 });
  if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: msg.mime, dialogTitle: nome });
}

const ehInterno = (url) => url.startsWith(SITE) || url.includes('superhiit-academia.web.app') || url.startsWith('about:') || url.startsWith('blob:') || url.startsWith('data:');

function Tela() {
  const web = useRef(null);
  const [podeVoltar, setPodeVoltar] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [offline, setOffline] = useState(false);
  const escuro = useColorScheme() !== 'light';

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (podeVoltar && web.current) { web.current.goBack(); return true; }
      return false;
    });
    return () => sub.remove();
  }, [podeVoltar]);

  const pronto = useCallback(() => {
    setCarregando(false);
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  const fundo = escuro ? '#0b0b0b' : '#f6f6f3';

  if (offline) {
    return (
      <View style={[estilos.offline, { backgroundColor: fundo }]}>
        <Image source={require('./assets/icon.png')} style={estilos.icone} />
        <Text style={[estilos.titulo, { color: escuro ? '#fff' : '#111' }]}>Sem conexão</Text>
        <Text style={[estilos.texto, { color: escuro ? '#a3a3a3' : '#555' }]}>Verifique a internet e tente de novo. Sua ficha volta a aparecer assim que conectar.</Text>
        <Pressable style={estilos.botao} onPress={() => { setOffline(false); setCarregando(true); }}>
          <Text style={estilos.botaoTexto}>Tentar de novo</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: fundo }} edges={['top', 'left', 'right']}>
      <StatusBar style={escuro ? 'light' : 'dark'} />
      {/* Carrega o site publicado: cada deploy chega sozinho ao app, sem atualizar pela loja. */}
      <WebView
        ref={web}
        source={{ uri: `${SITE}/painel` }}
        style={{ flex: 1, backgroundColor: fundo }}
        applicationNameForUserAgent="SuperHIITApp/1.0"
        sharedCookiesEnabled
        domStorageEnabled
        javaScriptEnabled
        allowsBackForwardNavigationGestures
        pullToRefreshEnabled={false}
        bounces={false}
        overScrollMode="never"
        textZoom={100}
        setBuiltInZoomControls={false}
        setDisplayZoomControls={false}
        scalesPageToFit={false}
        cacheEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="normal"
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        setSupportMultipleWindows={false}
        originWhitelist={['*']}
        onNavigationStateChange={(n) => setPodeVoltar(n.canGoBack)}
        onLoadEnd={pronto}
        onError={() => { pronto(); setOffline(true); }}
        onHttpError={(e) => { if (e.nativeEvent.statusCode >= 500) setOffline(true); }}
        onShouldStartLoadWithRequest={(req) => {
          if (ehInterno(req.url) || req.url.includes(HOST)) return true;
          Linking.openURL(req.url).catch(() => {});
          return false;
        }}
        onMessage={(e) => { receberArquivo(e).catch(() => {}); }}
        onRenderProcessGone={() => web.current?.reload()}
        injectedJavaScriptBeforeContentLoaded={"document.documentElement.classList.add('modo-app'); true;"}
        onContentProcessDidTerminate={() => web.current?.reload()}
      />
      {carregando && (
        <View style={[StyleSheet.absoluteFill, estilos.carregando, { backgroundColor: fundo }]}>
          <Image source={require('./assets/icon.png')} style={estilos.icone} />
          <ActivityIndicator color={AMARELO} size="large" />
        </View>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Tela />
    </SafeAreaProvider>
  );
}

const estilos = StyleSheet.create({
  carregando: { alignItems: 'center', justifyContent: 'center', gap: 24 },
  icone: { width: 120, height: 120, borderRadius: 28 },
  offline: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 14 },
  titulo: { fontSize: 24, fontWeight: '800' },
  texto: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  botao: { backgroundColor: AMARELO, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 999, marginTop: 8 },
  botaoTexto: { color: '#0b0b0b', fontWeight: '800', fontSize: 16 },
});
