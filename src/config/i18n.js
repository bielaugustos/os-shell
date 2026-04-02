import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: { translation: {
    greeting: { dawn:'Good early morning', morning:'Good morning', midday:'Good afternoon', afternoon:'Good afternoon', evening:'Good evening', night:'Good night' },
    nav: { home:'Today', clock:'Clock', notes:'Notes', calculator:'Calculator', tower:'Tower', settings:'Settings' },
    apps: { clock:'Clock', notes:'Notes', calculator:'Calculator', tower:'Tower', settings:'Settings' },
    tower: { score:'Score', best:'Best', tapToStart:'Tap to start', gameOver:'Game Over', congratulations:'Congratulations!', instruction:'Tap or press Space to drop blocks' },
    clock: { worldClock:'World Clock', stopwatch:'Stopwatch', timer:'Timer', alarm:'Alarm', start:'Start', pause:'Pause', resume:'Resume', reset:'Reset', lap:'Lap', addAlarm:'Add Alarm', edit:'Edit', delete:'Delete', save:'Save', cancel:'Cancel', hours:'Hours', minutes:'Minutes', seconds:'Seconds', setTimer:'Set Timer', timeUp:'Time\'s up!', alarmSounding:'Alarm!', noAlarms:'No alarms', laps:'Laps', alarmName:'Alarm name', label:'Label', stop:'Stop' },
    notes: { search:'Search...', new:'New', untitled:'Untitled', placeholder:'Start writing...' },
    settings: { appearance:'Appearance', language:'Language', permissions:'Permissions', system:'System', themeAuto:'auto', refresh:'Refresh', granted:'Granted', denied:'Denied', allow:'Allow', version:'Version', engine:'Engine', database:'Database', offline:'Offline', storageUsed:'Storage used', session:'Session' },
    permissions: { microphone:'Microphone', camera:'Camera', location:'Location', notifications:'Notifications', storage:'Storage', clipboard:'Clipboard', micReason:'Voice commands & Whisper STT', camReason:'QR scanner & avatar capture', geoReason:'Local weather & context', notifReason:'Alarms & reminders', storageReason:'Offline data never deleted', clipReason:'Paste between apps', deniedHint:'Change in browser settings', chromeHint:'Chrome: ⋮ → Settings → Privacy → Site settings', safariHint:'Safari: Settings → Safari → [this site]' },
    shortcuts: { title:'Keyboard shortcuts', apps:'Open apps', home:'Go to today', settings:'Settings', newNote:'New note' },
  }},
  pt: { translation: {
    greeting: { dawn:'Bom amanhecer', morning:'Bom dia', midday:'Boa tarde', afternoon:'Boa tarde', evening:'Boa noite', night:'Boa madrugada' },
    nav: { home:'Hoje', clock:'Relógio', notes:'Notas', calculator:'Calculadora', tower:'Torre', settings:'Ajustes' },
    apps: { clock:'Relógio', notes:'Notas', calculator:'Calculadora', tower:'Torre', settings:'Ajustes' },
    tower: { score:'Pontuação', best:'Melhor', tapToStart:'Toque para começar', gameOver:'Fim de Jogo', congratulations:'Parabéns!', instruction:'Toque ou pressione Espaço para soltar blocos' },
    clock: { worldClock:'Relógio Mundial', stopwatch:'Cronômetro', timer:'Temporizador', alarm:'Alarme', start:'Iniciar', pause:'Pausar', resume:'Retomar', reset:'Reiniciar', lap:'Volta', addAlarm:'Adicionar Alarme', edit:'Editar', delete:'Excluir', save:'Salvar', cancel:'Cancelar', hours:'Horas', minutes:'Minutos', seconds:'Segundos', setTimer:'Definir Temporizador', timeUp:'Tempo esgotado!', alarmSounding:'Alarme!', noAlarms:'Nenhum alarme', laps:'Voltas', alarmName:'Nome do alarme', label:'Rótulo', stop:'Parar' },
    notes: { search:'Buscar...', new:'Nova', untitled:'Sem título', placeholder:'Comece a escrever...' },
    settings: { appearance:'Aparência', language:'Idioma', permissions:'Permissões', system:'Sistema', themeAuto:'auto', refresh:'Atualizar', granted:'Concedida', denied:'Negada', allow:'Permitir', version:'Versão', engine:'Engine', database:'Banco de dados', offline:'Offline', storageUsed:'Armazenamento', session:'Sessão' },
    permissions: { microphone:'Microfone', camera:'Câmera', location:'Localização', notifications:'Notificações', storage:'Armazenamento', clipboard:'Área de cópia', micReason:'Comandos de voz e transcrição', camReason:'Scanner QR e avatar', geoReason:'Clima local e contexto', notifReason:'Alarmes e lembretes', storageReason:'Dados offline permanentes', clipReason:'Colar entre apps', deniedHint:'Altere nos ajustes do browser', chromeHint:'Chrome: ⋮ → Ajustes → Privacidade → Ajustes do site', safariHint:'Safari: Ajustes → Safari → [este site]' },
    shortcuts: { title:'Atalhos de teclado', apps:'Abrir apps', home:'Ir para hoje', settings:'Ajustes', newNote:'Nova nota' },
  }},
  es: { translation: {
    greeting: { dawn:'Buenos días temprano', morning:'Buenos días', midday:'Buenas tardes', afternoon:'Buenas tardes', evening:'Buenas noches', night:'Buenas noches' },
    nav: { home:'Hoy', clock:'Reloj', notes:'Notas', calculator:'Calculadora', tower:'Torre', settings:'Ajustes' },
    apps: { clock:'Reloj', notes:'Notas', calculator:'Calculadora', tower:'Torre', settings:'Ajustes' },
    tower: { score:'Puntuación', best:'Mejor', tapToStart:'Toca para empezar', gameOver:'Fin del Juego', congratulations:'¡Felicidades!', instruction:'Toca o presiona Espacio para soltar bloques' },
    clock: { worldClock:'Reloj Mundial', stopwatch:'Cronómetro', timer:'Temporizador', alarm:'Alarma', start:'Iniciar', pause:'Pausar', resume:'Reanudar', reset:'Reiniciar', lap:'Vuelta', addAlarm:'Añadir Alarma', edit:'Editar', delete:'Eliminar', save:'Guardar', cancel:'Cancelar', hours:'Horas', minutes:'Minutos', seconds:'Segundos', setTimer:'Establecer Temporizador', timeUp:'¡Tiempo agotado!', alarmSounding:'¡Alarma!', noAlarms:'Sin alarmas', laps:'Vueltas', alarmName:'Nombre de alarma', label:'Etiqueta', stop:'Detener' },
    notes: { search:'Buscar...', new:'Nueva', untitled:'Sin título', placeholder:'Empieza a escribir...' },
    settings: { appearance:'Apariencia', language:'Idioma', permissions:'Permisos', system:'Sistema', themeAuto:'auto', refresh:'Actualizar', granted:'Concedido', denied:'Denegado', allow:'Permitir', version:'Versión', engine:'Motor', database:'Base de datos', offline:'Sin conexión', storageUsed:'Almacenamiento', session:'Sesión' },
    permissions: { microphone:'Micrófono', camera:'Cámara', location:'Ubicación', notifications:'Notificaciones', storage:'Almacenamiento', clipboard:'Portapapeles', micReason:'Comandos de voz', camReason:'Escáner QR y avatar', geoReason:'Clima local', notifReason:'Alarmas y recordatorios', storageReason:'Datos offline permanentes', clipReason:'Pegar entre apps', deniedHint:'Cambia en la configuración del navegador', chromeHint:'Chrome: ⋮ → Configuración → Privacidad → Config. del sitio', safariHint:'Safari: Ajustes → Safari → [este sitio]' },
    shortcuts: { title:'Atajos de teclado', apps:'Abrir apps', home:'Ir a hoy', settings:'Configuración', newNote:'Nueva nota' },
  }},
  fr: { translation: {
    greeting: { dawn:'Bonjour tôt', morning:'Bonjour', midday:'Bon après-midi', afternoon:'Bon après-midi', evening:'Bonsoir', night:'Bonne nuit' },
    nav: { home:'Aujourd\'hui', clock:'Horloge', notes:'Notes', calculator:'Calculatrice', tower:'Tour', settings:'Réglages' },
    apps: { clock:'Horloge', notes:'Notes', calculator:'Calculatrice', tower:'Tour', settings:'Réglages' },
    tower: { score:'Score', best:'Meilleur', tapToStart:'Touchez pour commencer', gameOver:'Partie Terminée', congratulations:'Félicitations!', instruction:'Touchez ou appuyez sur Espace pour lâcher les blocs' },
    clock: { worldClock:'Horloge Mondiale', stopwatch:'Chronomètre', timer:'Minuteur', alarm:'Alarme', start:'Démarrer', pause:'Pause', resume:'Reprendre', reset:'Réinitialiser', lap:'Tour', addAlarm:'Ajouter Alarme', edit:'Modifier', delete:'Supprimer', save:'Enregistrer', cancel:'Annuler', hours:'Heures', minutes:'Minutes', seconds:'Secondes', setTimer:'Définir Minuteur', timeUp:'Temps écoulé!', alarmSounding:'Alarme!', noAlarms:'Aucune alarme', laps:'Tours', alarmName:'Nom de l\'alarme', label:'Étiquette', stop:'Arrêter' },
    notes: { search:'Rechercher...', new:'Nouvelle', untitled:'Sans titre', placeholder:'Commencez à écrire...' },
    settings: { appearance:'Apparence', language:'Langue', permissions:'Autorisations', system:'Système', themeAuto:'auto', refresh:'Actualiser', granted:'Accordé', denied:'Refusé', allow:'Autoriser', version:'Version', engine:'Moteur', database:'Base de données', offline:'Hors ligne', storageUsed:'Stockage utilisé', session:'Séance' },
    permissions: { microphone:'Microphone', camera:'Caméra', location:'Localisation', notifications:'Notifications', storage:'Stockage', clipboard:'Presse-papiers', micReason:'Commandes vocales', camReason:'Scanner QR et avatar', geoReason:'Météo locale', notifReason:'Alarmes et rappels', storageReason:'Données hors ligne permanentes', clipReason:'Coller entre les apps', deniedHint:'Modifiez dans les paramètres du navigateur', chromeHint:'Chrome: ⋮ → Paramètres → Confidentialité → Paramètres du site', safariHint:'Safari: Réglages → Safari → [ce site]' },
    shortcuts: { title:'Raccourcis clavier', apps:'Ouvrir les apps', home:'Aller à aujourd\'hui', settings:'Paramètres', newNote:'Nouvelle note' },
  }},
}

const detected = navigator.language?.split('-')[0] || 'en'
const supported = Object.keys(resources)
const lng = supported.includes(detected) ? detected : 'en'

i18n.use(initReactI18next).init({
  resources, lng, fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n

export const SUPPORTED_LANGS = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
]
