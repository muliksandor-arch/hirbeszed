let articles = [];
const NEWS_FEED_URL = './news.json';
const EMPTY_ARTICLE = {
  id:'empty-news',
  source:'Hírbeszéd',
  category:'Friss',
  time:'',
  title:'Nincs betöltött hír',
  excerpt:'A fejlesztési hírfolyam betöltése nem sikerült.',
  body:'A fejlesztési hírfolyam betöltése nem sikerült. Ellenőrizd a news.json fájlt vagy a helyi szervert.',
  image:'assets/prototype/budapest-tram.svg',
  url:''
};

const topics = [
  {id:'fresh',name:'Friss',description:'Legfrissebb és vezető hírek'},
  {id:'domestic',name:'Belföld',description:'Magyar közélet, politika és társadalom'},
  {id:'foreign',name:'Külföld',description:'Nemzetközi hírek, EU, világpolitika'},
  {id:'economy',name:'Gazdaság',description:'Infláció, árak, forint, cégek és ipar'},
  {id:'money',name:'Pénz',description:'Adózás, bank, hitel, nyugdíj és bérek'},
  {id:'business',name:'Vállalkozás',description:'KKV, pályázatok, támogatások és üzleti trendek'},
  {id:'tech_ai',name:'Tech & AI',description:'Mesterséges intelligencia, technológia és kiberbiztonság'},
  {id:'weather',name:'Időjárás',description:'Előrejelzés, riasztások és időjárási események'},
  {id:'traffic',name:'Közlekedés',description:'Útinform, balesetek, tömegközlekedés és üzemanyagár'},
  {id:'real_estate',name:'Ingatlan',description:'Lakásárak, albérlet, lakáshitel és építőipar'},
  {id:'career',name:'Munka',description:'Álláspiac, karrier, HR és munkajog'},
  {id:'health',name:'Egészség',description:'Egészségügy, gyógyszer, életmód és járványok'},
  {id:'education',name:'Oktatás',description:'Iskola, egyetem, felvételi és érettségi'},
  {id:'sport',name:'Sport',description:'Foci, Forma–1, kézilabda, olimpia és magyar sport'},
  {id:'culture',name:'Kultúra',description:'Film, zene, könyv, színház és programok'},
  {id:'tabloid',name:'Bulvár',description:'Celebek, TV, szórakozás és könnyed hírek'},
  {id:'auto',name:'Autó',description:'Autópiac, elektromos autók, KRESZ és bírságok'},
  {id:'green',name:'Zöld',description:'Környezet, klíma, energia és fenntarthatóság'},
  {id:'law',name:'Jog',description:'Törvények, rendeletek, fogyasztóvédelem és adatvédelem'},
  {id:'local',name:'Helyi',description:'Budapest, vármegyék, városi és helyi hírek'}
];

const ASSISTANT_CHAT_MAX_MESSAGES = 40;
const READER_TRIAL_DEFAULT_DAYS = 14;
const PLAN_CATALOG = {
  free:{
    id:'free',
    name:'Ingyenes csomag',
    shortName:'Ingyenes csomag',
    price:'Ingyenes',
    monthlyPrice:'0 Ft',
    description:'Előfizetés nélküli hírfolyam, témákkal, kereséssel és kedvelésekkel.',
    features:['Friss RSS-hírek','Témák, keresés és kedvelések','Részletes hírnézet']
  },
  reader:{
    id:'reader',
    name:'AI Felolvasó előfizetés',
    shortName:'AI Felolvasó előfizetés',
    price:'1490 Ft',
    monthlyPrice:'1490 Ft/hó',
    description:'AI-hanggal felolvasott hírek képernyő nélküli használathoz.',
    features:['Minden az Ingyenes csomagból','AI-hangos felolvasás','Automatikus hírléptetés és hangutasítások']
  },
  assistant:{
    id:'assistant',
    name:'AI Asszisztens előfizetés',
    shortName:'AI Asszisztens előfizetés',
    price:'3490 Ft',
    monthlyPrice:'3490 Ft/hó',
    description:'Beszélgetős hírasszisztens, amelyet kérdezhetsz a hírekről.',
    features:['Minden az AI Felolvasóból','Teljes csevegéses AI hírasszisztens','Összefoglalók, magyarázatok és témakeresés']
  }
};
const PROMO_ARTICLES = {
  reader:{
    id:'promo-reader-ai-felolvaso',
    promoType:'reader',
    promoAction:'reader-promo',
    promoPlan:'reader',
    source:'Hírbeszéd ajánló',
    category:'Ajánló',
    time:'AI Felolvasó',
    publishedAt:'',
    title:'Hallgasd a híreket AI-hanggal, amikor nem nézed a kijelzőt',
    excerpt:'Az AI Felolvasó előfizetés 1490 Ft/hó áron olvassa fel a friss híreket, automatikus léptetéssel és hangutasításokkal.',
    body:'Az AI Felolvasó előfizetés azoknak készül, akik útközben, munka közben vagy pihenés mellett is szeretnék követni a híreket. Az app AI-hanggal felolvassa a hírfolyam friss cikkeit, a hírek között automatikusan léptet, és hangutasításokkal is irányítható. A végleges appban a felolvasott hanganyag gazdaságosan, backend oldalon készül el, ezért a telefonon gyorsan és kiszámíthatóan játszható le.',
    image:'assets/prototype/technology-ai.svg',
    url:'',
    buttonLabel:'Kipróbálás Felolvasó módban'
  },
  assistant:{
    id:'promo-assistant-ai',
    promoType:'assistant',
    promoAction:'assistant-promo',
    promoPlan:'assistant',
    source:'Hírbeszéd ajánló',
    category:'Ajánló',
    time:'AI Asszisztens',
    publishedAt:'',
    title:'Beszélgess a hírolvasóval a friss hírekről',
    excerpt:'Az AI Asszisztens előfizetés 3490 Ft/hó áron teljes csevegéses hírasszisztenst ad a felolvasó mellé.',
    body:'Az AI Asszisztens előfizetés a teljes beszélgetős hírélményt mutatja meg. Kérdezhetsz a friss hírekről, kérhetsz rövid összefoglalót, háttérmagyarázatot vagy témakeresést. A csomag tartalmazza az AI Felolvasó funkcióit is, és azoknak szól, akik nemcsak meghallgatni, hanem megérteni és továbbkérdezni is szeretnék a híreket.',
    image:'assets/prototype/economy-city.svg',
    url:'',
    buttonLabel:'Kipróbálás Asszisztens módban'
  },
  assistantTrial:{
    id:'promo-assistant-trial-5',
    promoType:'assistant-trial',
    promoAction:'assistant-trial',
    promoPlan:'assistant',
    source:'Hírbeszéd ajánló',
    category:'Ajánló',
    time:'Heti próba',
    publishedAt:'',
    title:'Heti 5 kérdéses AI Asszisztens próba Felolvasó előfizetőknek',
    excerpt:'AI Felolvasó előfizetőként hetente egyszer 5 kérdés erejéig kipróbálhatod a teljes AI Asszisztens csevegést.',
    body:'Az AI Felolvasó előfizetők hetente egyszer 5 kérdéses próbát kapnak az AI Asszisztensből. A próba megmutatja, milyen, amikor a hírolvasóval nemcsak hallgatod a híreket, hanem vissza is kérdezhetsz, összefoglalót kérhetsz vagy egy témát röviden kibontathatsz. A próba elfogadása után az Asszisztensben 5 felhasználói kérdés számít bele a heti keretbe.',
    image:'assets/prototype/sport-stadium.svg',
    url:'',
    buttonLabel:'5 kérdéses próba indítása'
  }
};
const PROMO_ARTICLE_LIST = Object.values(PROMO_ARTICLES);
const defaultSubscription = {
  status:'active',
  plan:'free',
  trialDays:0,
  activeDaysLeft:0,
  scheduledPlan:'',
  scheduledDays:0,
  aiMinutesUsed:0,
  aiMinutesLimit:0,
  assistantTrialWeek:'',
  assistantTrialAvailable:true,
  assistantTrialActive:false,
  assistantTrialRemaining:0,
  assistantTrialPromptAttempts:0,
  readerArticlesSinceAssistantOffer:0,
  assistantTrialPromoDismissedWeek:'',
  assistantTrialPromoClickedWeek:'',
  promoInterval:20
};
function createInitialPrototypeState(){
  return {
  route:'feed', sort:'latest', category:'fresh', theme:'system', mic:true, autoNext:true,
  playing:false, paused:false, detailedRead:false, carIndex:0, assistantMode:'voice', read:[], saved:[], history:[], assistantChat:[], assistantPromoChat:[],
  showReadInFeed:true, promoFeedPriority:true, prototypeImmediateSubscriptionChange:true, prototypeReaderTrialAvailable:true, prototypeReaderTrialDaysLeft:READER_TRIAL_DEFAULT_DAYS, readerPromoMode:false, assistantPromoMode:false,
  deviceSessionState:'active', deviceSessionOtherDevice:'iPhone 15 · 2 perce',
  sources:{HVG:true,Portfolio:true,Qubit:true,'Nemzeti Sport':true,Telex:true,'24.hu':true},
  enabledTopics:topics.map(topic=>topic.id), notifications:true, location:false, mobileData:true,
  subscription:{...defaultSubscription},
  auth:{loggedIn:false,name:'',email:'',phone:'',provider:'',twoFactor:false},
  onboarding:{required:true,introSeen:false,authDone:false,subscriptionDone:false,rssDone:false,privacyAccepted:false,completed:false}
  };
}

function readStoredPrototypeState(){
  try{return JSON.parse(localStorage.getItem('hirbeszed-state') || '{}') || {};}
  catch(_){return {};}
}

function resetPrototypeToFirstLaunch(delay=500){
  localStorage.setItem('hirbeszed-state',JSON.stringify(createInitialPrototypeState()));
  try{sessionStorage.removeItem('hirbeszed-default-launch');}catch(_){}
  toast('Prototipusadatok torolve');
  setTimeout(()=>location.reload(),delay);
}

window.hirbeszedCreateInitialState=createInitialPrototypeState;
window.hirbeszedResetToFirstLaunch=resetPrototypeToFirstLaunch;

const defaults = createInitialPrototypeState();

const state = Object.assign({}, defaults, readStoredPrototypeState());
state.read = new Set(state.read || []); state.saved = new Set(state.saved || []); state.history = state.history || [];
function normalizePlanId(plan){
  if(plan==='basic')return 'reader';
  if(plan==='pro')return 'assistant';
  return PLAN_CATALOG[plan]?plan:'reader';
}
function currentWeekKey(date=new Date()){
  const year=date.getFullYear();
  const start=new Date(year,0,1);
  const day=Math.floor((date-start)/86400000)+1;
  return `${year}-W${String(Math.ceil((day+start.getDay())/7)).padStart(2,'0')}`;
}
function normalizeSubscription(raw={}){
  const next={...defaultSubscription,...raw};
  next.plan=normalizePlanId(next.plan);
  if(!['inactive','trial','active','expired','payment_failed'].includes(next.status))next.status='trial';
  if(next.plan==='free'&&['trial','expired','payment_failed'].includes(next.status))next.status='active';
  next.trialDays=Math.max(0,Number(next.trialDays)||0);
  next.activeDaysLeft=next.status==='active'&&next.plan!=='free'?Math.max(0,Number(next.activeDaysLeft)||30):0;
  next.scheduledPlan=normalizePlanChoice(next.scheduledPlan)||'';
  if(next.scheduledPlan===next.plan||next.plan==='free')next.scheduledPlan='';
  next.scheduledDays=next.scheduledPlan?Math.max(0,Number(next.scheduledDays)||next.trialDays||next.activeDaysLeft||30):0;
  next.aiMinutesUsed=0;
  next.aiMinutesLimit=0;
  next.assistantTrialRemaining=Math.max(0,Math.min(5,Number(next.assistantTrialRemaining)||0));
  next.assistantTrialPromptAttempts=Math.max(0,Number(next.assistantTrialPromptAttempts)||0);
  next.readerArticlesSinceAssistantOffer=Math.max(0,Number(next.readerArticlesSinceAssistantOffer)||0);
  next.assistantTrialPromoDismissedWeek=String(next.assistantTrialPromoDismissedWeek||'');
  next.assistantTrialPromoClickedWeek=String(next.assistantTrialPromoClickedWeek||'');
  next.promoInterval=Math.max(8,Number(next.promoInterval)||20);
  delete next.proPreviewAvailable;
  delete next.proPreviewRemaining;
  delete next.proPreviewActive;
  delete next.assistantTrialPromoWeek;
  return next;
}
function subscriptionHomeRoute(subscription=state.subscription){
  const sub=normalizeSubscription(subscription||{});
  if(sub.status==='active'&&sub.plan==='assistant')return 'assistant';
  if((sub.status==='active'||sub.status==='trial')&&sub.plan==='reader')return 'car';
  return 'feed';
}
state.subscription = normalizeSubscription(state.subscription || {});
state.sources = {...defaults.sources,...(state.sources || {})};
state.enabledTopics = Array.isArray(state.enabledTopics) ? state.enabledTopics : [...defaults.enabledTopics];
state.assistantChat = Array.isArray(state.assistantChat) ? state.assistantChat.filter(item=>item&&['user','assistant'].includes(item.role)&&typeof item.text==='string'&&item.text.trim()).slice(-ASSISTANT_CHAT_MAX_MESSAGES) : [];
state.assistantPromoChat = Array.isArray(state.assistantPromoChat) ? state.assistantPromoChat.filter(item=>item&&['user','assistant'].includes(item.role)&&typeof item.text==='string'&&item.text.trim()).slice(-ASSISTANT_CHAT_MAX_MESSAGES) : [];
state.showReadInFeed = state.showReadInFeed !== false;
state.promoFeedPriority = state.promoFeedPriority !== false;
state.prototypeImmediateSubscriptionChange = state.prototypeImmediateSubscriptionChange !== false;
state.prototypeReaderTrialAvailable = state.prototypeReaderTrialAvailable !== false;
state.prototypeReaderTrialDaysLeft = clampReaderTrialDays(state.prototypeReaderTrialDaysLeft);
state.readerPromoMode = !!state.readerPromoMode;
state.assistantPromoMode = !!state.assistantPromoMode;
state.deviceSessionState = ['active','other_active','detached'].includes(state.deviceSessionState) ? state.deviceSessionState : 'active';
state.deviceSessionOtherDevice = String(state.deviceSessionOtherDevice || 'iPhone 15 · 2 perce');
delete state.sideNavPosition;
const legacyTopics = {Mind:'fresh',Technológia:'tech_ai',Világhírek:'foreign','Helyi hírek':'local'};
state.category = legacyTopics[state.category] || topics.find(topic=>topic.name===state.category)?.id || state.category || 'fresh';
function isTrialExpired(){return state.subscription.status==='expired'||state.subscription.status==='payment_failed';}
function isReaderPlan(){return ['reader','assistant'].includes(state.subscription.plan);}
function hasReaderAccess(){return (state.subscription.status==='trial'&&state.subscription.plan==='reader')||(state.subscription.status==='active'&&isReaderPlan());}
function hasAssistantSubscription(){return state.subscription.status==='active'&&state.subscription.plan==='assistant';}
function hasAssistantTrial(){return state.subscription.assistantTrialActive&&state.subscription.assistantTrialWeek===currentWeekKey();}
function hasAssistantAccess(){return hasAssistantSubscription()||hasAssistantTrial();}
function isActiveReaderSubscription(){return state.subscription.status==='active'&&state.subscription.plan==='reader';}
function isReaderLikeSubscription(){return (state.subscription.status==='active'||state.subscription.status==='trial')&&state.subscription.plan==='reader';}
function isPromoArticle(articleOrId){
  const id=typeof articleOrId==='string'?articleOrId:articleOrId?.id;
  return PROMO_ARTICLE_LIST.some(article=>article.id===id);
}
function promoArticleById(id){return PROMO_ARTICLE_LIST.find(article=>article.id===id)||null;}
function assistantTrialPromoAvailable(){
  const week=currentWeekKey();
  const sub=state.subscription;
  return isActiveReaderSubscription()
    && sub.assistantTrialAvailable!==false
    && sub.assistantTrialWeek!==week
    && sub.assistantTrialPromoDismissedWeek!==week
    && sub.assistantTrialPromoClickedWeek!==week;
}
function readerPromoArticles(){return [PROMO_ARTICLES.reader,PROMO_ARTICLES.assistant];}
function currentReaderArticleList(){
  if(state.readerPromoMode&&!hasReaderAccess())return readerPromoArticles();
  return articleSequenceWithPromos(articles);
}
function setFreeAccess(){
  state.subscription.status='active';
  state.subscription.plan='free';
  state.subscription.trialDays=0;
  state.subscription.activeDaysLeft=0;
  state.subscription.scheduledPlan='';
  state.subscription.scheduledDays=0;
  state.subscription.assistantTrialActive=false;
  state.subscription.assistantTrialRemaining=0;
  state.readerPromoMode=false;
  state.assistantPromoMode=false;
}
function applySubscriptionLaunchRoute(){
  if(state.onboarding?.required)return;
  state.route=subscriptionHomeRoute(state.subscription);
  if(state.route!=='car'){
    state.playing=false;
    state.paused=false;
  }
}
applySubscriptionLaunchRoute();
if((isTrialExpired()||state.subscription.status==='inactive'||!hasReaderAccess())&&state.route==='car'&&!state.readerPromoMode)state.route='feed';
if(!hasAssistantAccess()&&state.route==='assistant'&&!state.assistantPromoMode)state.route='feed';
let currentUtterance = null; let speechRunId = 0; let currentSpeechText = ''; let currentSpeechOffset = 0; let currentSpeechDetails = false; let assistantSpeaking = false; let currentRecognition = null; let recognitionContext = null; let toastTimer = null; let activeSheetRenderer = null; let carAutoAdvanceTimer = null; let carDeferredSheetTimer = null; let carMicWindowTimer = null; let carMicWindowActive = false; let assistantTrialPromptTimer = null;
let assistantPromptPool = []; let activeAssistantPrompt = null; let assistantVoiceResult = null;
const $ = selector => document.querySelector(selector);
const view = $('#view'); const sheet = $('#sheet'); const sheetBody = $('#sheetBody'); const phoneShell = $('#phone');
let assistantComposerFocused = false; let assistantKeyboardUpdateTimers = [];

function isAssistantComposerInput(target){
  return !!target?.closest?.('.assistant-route-view .composer input, .assistant-route-view .composer textarea');
}
function detectKeyboardOffset(){
  let offset = 0;
  const virtualKeyboard = navigator.virtualKeyboard;
  if(virtualKeyboard?.boundingRect?.height)offset=Math.max(offset,Math.round(virtualKeyboard.boundingRect.height));
  const visualViewport = window.visualViewport;
  if(visualViewport){
    const layoutHeight = Math.max(window.innerHeight||0,document.documentElement?.clientHeight||0);
    const viewportBottom = visualViewport.height + Math.max(0,visualViewport.offsetTop||0);
    offset = Math.max(offset,Math.round(layoutHeight - viewportBottom));
  }
  return Math.max(0,offset);
}
function updateAssistantKeyboardState(){
  if(!phoneShell)return;
  const focused = assistantComposerFocused && state.route==='assistant';
  const offset = focused ? detectKeyboardOffset() : 0;
  const active = focused && offset > 80;
  phoneShell.style.setProperty('--keyboard-offset',active?`${offset}px`:'0px');
  phoneShell.classList.toggle('assistant-keyboard-open',active);
}
function scheduleAssistantKeyboardUpdate(){
  assistantKeyboardUpdateTimers.forEach(clearTimeout);
  assistantKeyboardUpdateTimers=[60,180,420,720].map(delay=>setTimeout(updateAssistantKeyboardState,delay));
  requestAnimationFrame(updateAssistantKeyboardState);
}
function setupAssistantKeyboardHandling(){
  try{ if(navigator.virtualKeyboard)navigator.virtualKeyboard.overlaysContent=true; }catch(_){}
  document.addEventListener('focusin',event=>{
    if(isAssistantComposerInput(event.target)){
      assistantComposerFocused=true;
      scheduleAssistantKeyboardUpdate();
    }
  });
  document.addEventListener('focusout',event=>{
    if(!isAssistantComposerInput(event.target))return;
    setTimeout(()=>{
      assistantComposerFocused=isAssistantComposerInput(document.activeElement);
      scheduleAssistantKeyboardUpdate();
    },80);
  });
  window.visualViewport?.addEventListener('resize',scheduleAssistantKeyboardUpdate);
  window.visualViewport?.addEventListener('scroll',scheduleAssistantKeyboardUpdate);
  window.addEventListener('resize',scheduleAssistantKeyboardUpdate);
  navigator.virtualKeyboard?.addEventListener?.('geometrychange',scheduleAssistantKeyboardUpdate);
}

function saveState(){
  state.subscription=normalizeSubscription(state.subscription||{});
  const serial = {...state,read:[...state.read],saved:[...state.saved]};
  localStorage.setItem('hirbeszed-state',JSON.stringify(serial));
}
function normalizeNewsArticle(item,index){
  const text=value=>String(value||'').trim();
  const source=text(item.source)||'RSS';
  return {
    id:text(item.id)||`rss-${index}`,
    source,
    category:text(item.category)||'Friss',
    time:text(item.time),
    publishedAt:text(item.publishedAt),
    title:text(item.title)||'Cím nélküli hír',
    excerpt:text(item.excerpt||item.description)||'Nincs rövid leírás.',
    body:text(item.body||item.content||item.excerpt)||'A részletes RSS-tartalom nem érhető el.',
    image:text(item.image)||'assets/prototype/budapest-tram.svg',
    url:text(item.url||item.link),
    feedUrl:text(item.feedUrl)
  };
}
async function loadNewsArticles(){
  try{
    const response=await fetch(NEWS_FEED_URL,{cache:'no-store'});
    if(!response.ok)throw new Error('news feed unavailable');
    const payload=await response.json();
    const items=Array.isArray(payload.items)?payload.items:[];
    articles=items.map(normalizeNewsArticle).filter(article=>article.title&&article.id);
    articles.forEach(article=>{ if(!(article.source in state.sources))state.sources[article.source]=true; });
    if(!articles.length)articles=[EMPTY_ARTICLE];
    if(state.carIndex>=articles.length)state.carIndex=0;
  }catch(error){
    console.warn('A fejlesztési hírfolyam nem tölthető be.',error);
    articles=[EMPTY_ARTICLE];
    state.carIndex=0;
  }
}
function effectiveTheme(){ return state.theme==='system' ? (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light') : state.theme; }
function applyTheme(){
  const theme=effectiveTheme(); document.documentElement.dataset.theme=theme;
  $('#brandMark').src=`assets/brand/hirbeszed-mark-${theme}.svg`;
  document.querySelector('meta[name="theme-color"]').content=theme==='dark'?'#0D191E':'#F6F9F8';
}
function toast(message,options={}){
  const el=$('#toast');
  if(state.route==='car'&&!options.allowInCar){
    clearTimeout(toastTimer);
    if(el) el.classList.remove('show');
    return;
  }
  if(!el)return;
  el.textContent=message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>el.classList.remove('show'),1900);
}
function deviceSessionStatusLabel(status=state.deviceSessionState){
  if(status==='other_active')return 'Másik eszköz aktív';
  if(status==='detached')return 'Ez az eszköz leválasztva';
  return 'Normál állapot';
}
function deviceSessionGateContent(){
  const other=escapeHtml(state.deviceSessionOtherDevice||'másik bejelentkezett készülék');
  if(state.deviceSessionState==='detached'){
    return {
      title:'A használat átkerült egy másik eszközre',
      text:'A Hírbeszédet most egy másik készüléken használják ezzel a fiókkal. Ezen az eszközön addig nem folytatható az app, amíg vissza nem veszed a munkamenetet.',
      meta:`Aktív eszköz: ${other}`,
      primary:'Használat visszavétele ezen az eszközön',
      action:'take-over'
    };
  }
  return {
    title:'Az app egy másik eszközön aktív',
    text:'A Hírbeszéd egyszerre egy eszközön használható. Ezzel védjük az előfizetést, az AI-használatot és a tokenfogyasztást.',
    meta:`Aktív eszköz: ${other}`,
    primary:'Használat átvétele ezen az eszközön',
    action:'take-over'
  };
}
function ensureDeviceSessionGate(){
  let gate=document.querySelector('#deviceSessionGate');
  if(gate)return gate;
  gate=document.createElement('section');
  gate.id='deviceSessionGate';
  gate.className='device-session-gate';
  gate.setAttribute('aria-live','polite');
  document.querySelector('#phone')?.appendChild(gate);
  return gate;
}
function renderDeviceSessionGate(){
  const gate=ensureDeviceSessionGate();
  const phone=document.querySelector('#phone');
  const locked=state.deviceSessionState!=='active';
  if(!gate)return;
  phone?.classList.toggle('device-session-locked',locked);
  gate.classList.toggle('show',locked);
  gate.setAttribute('aria-hidden',locked?'false':'true');
  if(!locked){
    gate.innerHTML='';
    return;
  }
  stopSpeech(false);
  stopVoiceListening();
  clearReaderTimers();
  const content=deviceSessionGateContent();
  gate.innerHTML=`<div class="device-session-card" role="dialog" aria-modal="true" aria-labelledby="deviceSessionTitle">
    <span class="device-session-icon">⇄</span>
    <p class="device-session-kicker">Egyidejű eszközhasználat</p>
    <h1 id="deviceSessionTitle">${escapeHtml(content.title)}</h1>
    <p>${escapeHtml(content.text)}</p>
    <div class="device-session-meta">${content.meta}</div>
    <button class="primary-button coral-button" type="button" data-device-session-action="${content.action}">${escapeHtml(content.primary)}</button>
    <button class="secondary-button" type="button" data-device-session-action="stay-locked">Mégsem</button>
  </div>`;
}
function setDeviceSessionState(status,message=''){
  state.deviceSessionState=['active','other_active','detached'].includes(status)?status:'active';
  if(state.deviceSessionState!=='active'){
    state.playing=false;
    state.paused=false;
  }
  saveState();
  renderDeviceSessionGate();
  if(message)toast(message,{allowInCar:true});
}
function takeOverDeviceSession(){
  state.deviceSessionOtherDevice='Ez az eszköz · most';
  setDeviceSessionState('active','Ez az eszköz lett aktív');
}
function deviceSessionSimulationSheet(){
  const current=deviceSessionStatusLabel();
  return openSheet('Eszközhasználat szimuláció','Egy fiók, egy aktív eszköz',`<p class="settings-intro">A végleges appban ezt a backend fogja eldönteni. Itt azt teszteljük, hogyan néz ki, amikor a fiók már másik eszközön aktív, vagy ezt az eszközt leválasztották.</p><div class="settings-group">
    <button class="settings-row" data-device-session-sim="other_active"><span class="row-icon">⇄</span><span class="row-copy"><strong>Másik eszköz aktív</strong><small>Átvételi kérdés megjelenítése ezen az eszközön</small></span><span class="row-end">›</span></button>
    <button class="settings-row" data-device-session-sim="detached"><span class="row-icon">⟲</span><span class="row-copy"><strong>Ez az eszköz leválasztva</strong><small>Azt mutatja, amikor egy másik készülék átvette a használatot</small></span><span class="row-end">›</span></button>
    <button class="settings-row" data-device-session-sim="active"><span class="row-icon">✓</span><span class="row-copy"><strong>Normál állapot visszaállítása</strong><small>Jelenlegi szimuláció: ${escapeHtml(current)}</small></span><span class="row-end">›</span></button>
  </div>`);
}
function prototypeReaderTrialDaysInput(){
  const value=prototypeReaderTrialDaysLeft();
  return `<label class="settings-row settings-number-row" for="prototypeReaderTrialDaysLeft"><span class="row-icon">#</span><span class="row-copy"><strong>Hátralévő AI Felolvasó próbanapok</strong><small>1 és 14 nap között szimulálható. Most: ${value} nap.</small></span><input id="prototypeReaderTrialDaysLeft" class="settings-number-input" type="number" min="1" max="${READER_TRIAL_DEFAULT_DAYS}" step="1" inputmode="numeric" value="${value}" data-prototype-trial-days aria-label="Hátralévő AI Felolvasó próbanapok"></label>`;
}
function prototypeSettingsContent(){
  return `<p class="settings-intro">Ezek a kapcsolók csak a helyi prototípus tesztelését segítik, a végleges appban az előfizetési állapotot, a jogosultságot és az aktív eszközt a backend adja.</p><h3 class="section-label">Előfizetéskezelés</h3><div class="settings-group"><button class="settings-row" data-toggle-setting="prototypeImmediateSubscriptionChange"><span class="row-icon">⇄</span><span class="row-copy"><strong>Előfizetésváltás felülbírálása és azonnali csomagváltás aktiválása</strong><small>${state.prototypeImmediateSubscriptionChange?'Bekapcsolva: jóváhagyáskor azonnal aktív lesz a kiválasztott csomag':'Kikapcsolva: csak a lefelé váltás fordulónapos, a felfelé váltás azonnali'}</small></span><span class="toggle ${state.prototypeImmediateSubscriptionChange?'on':''}"></span></button><button class="settings-row" data-toggle-setting="prototypeReaderTrialAvailable"><span class="row-icon">14</span><span class="row-copy"><strong>AI Felolvasó próbaidő az Ingyenes csomagban</strong><small>${state.prototypeReaderTrialAvailable?'Bekapcsolva: az Ingyenes csomag próbaidős változata látszik':'Kikapcsolva: a lejárt próbaidős változat látszik'}</small></span><span class="toggle ${state.prototypeReaderTrialAvailable?'on':''}"></span></button>${prototypeReaderTrialDaysInput()}</div><h3 class="section-label">Promóciók</h3><div class="settings-group"><button class="settings-row" data-toggle-setting="promoFeedPriority"><span class="row-icon">✦</span><span class="row-copy"><strong>Hírfolyam promo előresorolás</strong><small>${state.promoFeedPriority?'Bekapcsolva':'Kikapcsolva'}</small></span><span class="toggle ${state.promoFeedPriority?'on':''}"></span></button></div><h3 class="section-label">Eszközhasználat</h3><div class="settings-group"><button class="settings-row" data-setting="device-session"><span class="row-icon">▣</span><span class="row-copy"><strong>Egyidejű eszközhasználat szimuláció</strong><small>${escapeHtml(deviceSessionStatusLabel())}</small></span><span class="row-end">›</span></button></div><div class="settings-group"><button class="settings-row" data-setting="reset-app"><span class="row-icon">↺</span><span class="row-copy"><strong>Prototípusadatok törlése</strong><small>Első indítás, onboarding és alapállapot újratesztelése</small></span><span class="row-end">›</span></button></div>`;
}
function transitionCarControl(button, pressed, callback){
  if(!button){callback();return;}
  if(button.dataset.transitioning==='true')return;
  button.dataset.transitioning='true';
  button.classList.toggle('is-pressed-state',pressed);
  setTimeout(()=>{delete button.dataset.transitioning;callback();},150);
}
function iconButton(symbol,label,action,extraClass=''){ return `<button class="icon-button ${extraClass}" type="button" data-action="${action}" aria-label="${label}">${symbol}</button>`; }
function feedHeaderActions(){
  const readLabel=state.showReadInFeed?'Olvasott hírek elrejtése':'Olvasott hírek mutatása';
  const readIcon='<span class="header-read-icon" aria-hidden="true"></span>';
  return iconButton('⌕','Keresés','search','feed-header-button')
    +iconButton('♡','Kedveltek','library','feed-header-button feed-liked-button')
    +iconButton(readIcon,readLabel,'toggle-read-feed',`feed-header-button read-feed-toggle ${state.showReadInFeed?'active':''}`);
}
function carControlIcon(type,active=true){
  const offClass=active?'':' off';
  if(type==='mic'){
    return `<span class="car-control-icon mic-icon${offClass}" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><path class="control-line" d="M18 13c0-3.3 2.7-6 6-6s6 2.7 6 6v11c0 3.3-2.7 6-6 6s-6-2.7-6-6V13Z"></path><path class="control-line" d="M13 23v1c0 6.1 4.9 11 11 11s11-4.9 11-11v-1"></path><path class="control-line" d="M24 35v6"></path><path class="control-line" d="M18 41h12"></path>${active?'<path class="control-accent" d="M24 14v8"></path>':'<path class="control-slash" d="M12 39L36 9"></path>'}</svg></span>`;
  }
  if(type==='stop'){
    return `<span class="car-control-icon read-icon" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><rect class="control-line" x="10" y="9" width="28" height="30" rx="9"></rect><rect class="control-accent" x="20" y="18" width="8" height="12" rx="2"></rect></svg></span>`;
  }
  if(type==='auto'){
    return `<span class="car-control-icon auto-icon${offClass}" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><rect class="control-line" x="9" y="10" width="30" height="28" rx="8"></rect><path class="control-line" d="M15 18h12M15 24h10M15 30h12"></path><path class="control-accent" d="M30 18l5 6-5 6"></path>${active?'':'<path class="control-slash" d="M13 37L35 11"></path>'}</svg></span>`;
  }
  if(type==='prev'){
    return `<span class="car-control-icon step-icon" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><rect class="control-line" x="10" y="9" width="28" height="30" rx="9"></rect><path class="control-accent" d="M17 17v14"></path><path class="control-line" d="M31 17l-8 7 8 7"></path></svg></span>`;
  }
  if(type==='next'){
    return `<span class="car-control-icon step-icon" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><rect class="control-line" x="10" y="9" width="28" height="30" rx="9"></rect><path class="control-line" d="M17 17l8 7-8 7"></path><path class="control-accent" d="M31 17v14"></path></svg></span>`;
  }
  if(type==='pause'){
    return `<span class="car-control-icon pause-icon" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><rect class="control-line" x="10" y="9" width="28" height="30" rx="9"></rect><path class="control-accent" d="M20 17v14M28 17v14"></path></svg></span>`;
  }
  if(type==='resume'){
    return `<span class="car-control-icon pause-icon" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><rect class="control-line" x="10" y="9" width="28" height="30" rx="9"></rect><path class="control-accent" d="M20 17l12 7-12 7V17Z"></path></svg></span>`;
  }
  if(type==='details'){
    return `<span class="car-control-icon details-icon${offClass}" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><rect class="control-line" x="9" y="10" width="30" height="28" rx="8"></rect><path class="control-line" d="M15 17h18M15 24h18M15 31h12"></path><path class="control-accent" d="M33 30l4 4"></path></svg></span>`;
  }
  return `<span class="car-control-icon read-icon" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><rect class="control-line" x="10" y="9" width="28" height="30" rx="9"></rect><path class="control-accent" d="M20 17l12 7-12 7V17Z"></path></svg></span>`;
}
function carControlViewModel(){
  const micLabel='Mikrofon';
  const playbackLabel=state.paused?'Folytatás':state.playing?'Szünet':'Felolvasás';
  const autoLabel='Hírléptető';
  const prevLabel='Előző';
  const detailLabel=state.detailedRead?'Rövidített hírek':'Részletes hírek';
  const saveLabel='Kedvelés';
  const nextLabel='Következő';
  const voiceCommands=[micLabel,playbackLabel,autoLabel,prevLabel,detailLabel,saveLabel,nextLabel];
  const button = (className,aria,icon,label) => ({className,aria,html:`${icon}<span class="car-control-label">${label}</span>`});
  return {
    voicePanel:state.mic
      ? `<div class="voice-command-panel"><strong>${carMicWindowActive?'Mikrofon figyel:':state.autoNext?'Hír végén 3 mp:':'Hír végén figyel:'}</strong><span>${state.autoNext?voiceCommands.join(' · '):`${voiceCommands.join(' · ')} · hír végén nyitva marad`}</span></div>`
      : `<div class="voice-command-panel inactive"><strong>Hangutasítások kikapcsolva</strong><span>Hangutasításokhoz kapcsold be a mikrofont a Mikrofon gomb megnyomásával.</span></div>`,
    buttons:{
      mic:button(`car-control mic ${state.mic?'':'off is-pressed-state'}`,state.mic?'Mikrofon bekapcsolva':'Mikrofon kikapcsolva',carControlIcon('mic',state.mic),micLabel),
      play:button(`car-control read-toggle ${state.playing?'playing':''} ${state.paused?'paused is-pressed-state':''}`,state.paused?'Felolvasás folytatása':state.playing?'Felolvasás szüneteltetése':'Felolvasás indítása',carControlIcon(state.paused?'resume':state.playing?'pause':'play'),playbackLabel),
      auto:button(`car-control auto-next ${state.autoNext?'':'off is-pressed-state'}`,state.autoNext?'Hírléptető bekapcsolva':'Hírléptető kikapcsolva',carControlIcon('auto',state.autoNext),autoLabel),
      prev:button('car-control step-control','Előző hír',carControlIcon('prev'),prevLabel),
      details:button(`car-control step-control details-control ${state.detailedRead?'active is-pressed-state':''}`,state.detailedRead?'Rövidített hírek bekapcsolása':'Részletes hírek bekapcsolása',carControlIcon('details',state.detailedRead),detailLabel),
      next:button('car-control step-control','Következő hír',carControlIcon('next'),nextLabel)
    }
  };
}
function updateCarButton(kind,config){
  const button=document.querySelector(`[data-car="${kind}"]`);
  if(!button)return;
  if(button.className!==config.className)button.className=config.className;
  if(button.getAttribute('aria-label')!==config.aria)button.setAttribute('aria-label',config.aria);
  if(button.innerHTML!==config.html)button.innerHTML=config.html;
  delete button.dataset.transitioning;
}
function updateCarDom(){
  if(state.route!=='car'||!document.querySelector('.car-view')){renderCar();return;}
  const article=currentCarArticle();
  const image=document.querySelector('.car-image-wrap .article-image');
  if(image){
    if(image.getAttribute('src')!==article.image)image.setAttribute('src',article.image);
    if(image.getAttribute('alt')!==article.title)image.setAttribute('alt',article.title);
  }
  const badge=document.querySelector('.car-badge'); if(badge&&badge.textContent!==article.category)badge.textContent=article.category;
  const title=document.querySelector('.car-status h1'); if(title&&title.textContent!==article.title)title.textContent=article.title;
  const meta=document.querySelector('.car-meta-text'); const metaText=`${article.source} · ${article.time}`; if(meta&&meta.textContent!==metaText)meta.textContent=metaText;
  const carActions=document.querySelector('.car-meta-actions'); const nextActions=newsActionButtons(article,{compact:true,inline:true,extraClass:'meta-news-actions car-meta-actions'});
  if(carActions&&carActions.outerHTML!==nextActions)carActions.outerHTML=nextActions;
  setVoiceActivityState(document.querySelector('.car-wave-area .voice-activity'),carVoiceActivityState());
  const model=carControlViewModel();
  Object.entries(model.buttons).forEach(([kind,config])=>updateCarButton(kind,config));
  const panel=document.querySelector('.voice-command-panel'); if(panel&&panel.outerHTML!==model.voicePanel)panel.outerHTML=model.voicePanel;
}
function setHeader(title,actions=''){ $('#pageTitle').textContent=title; $('#headerActions').innerHTML=actions; }
function articleById(id){ return articles.find(article=>article.id===id)||promoArticleById(id); }
function recordRead(id){
  if(isPromoArticle(id))return;
  state.read.add(id);
  state.history=[id,...state.history.filter(item=>item!==id)].slice(0,30);
  saveState();
}
function toggleSaved(id){
  if(!articleById(id)||isPromoArticle(id))return;
  const liked=!state.saved.has(id);
  if(liked)state.saved.add(id); else state.saved.delete(id);
  saveState();
  toast(liked?'Kedvelted':'Kedvelés eltávolítva');
}
function favoriteLabel(id){return state.saved.has(id)?'Kedvelted':'Kedvelés';}
function readLabel(id){return state.read.has(id)?'Olvasott':'Olvasatlan';}
function favoriteIcon(id){return `<span class="news-action-icon heart-icon ${state.saved.has(id)?'is-liked':''}" aria-hidden="true">${state.saved.has(id)?'♥':'♡'}</span>`;}
function readStateIcon(id){return `<span class="news-action-icon read-state-icon ${state.read.has(id)?'is-read':'is-unread'}" aria-hidden="true"></span>`;}
function shareStateIcon(){return `<span class="news-action-icon share-state-icon" aria-hidden="true">↗</span>`;}
function newsActionButtons(article,options={}){
  const id=escapeHtml(article.id);
  const classes=['news-actions'];
  if(options.detail)classes.push('detail-actions');
  if(options.compact)classes.push('compact-actions');
  if(options.inline)classes.push('inline-actions');
  if(options.extraClass)classes.push(options.extraClass);
  if(isPromoArticle(article)){
    return `<div class="${classes.join(' ')} promo-inline-actions" data-news-actions-for="${id}">
      <button type="button" class="news-action promo-action-button" data-promo-action="${escapeHtml(article.promoAction)}" aria-label="${escapeHtml(article.buttonLabel||'Kipróbálás')}"><span class="news-action-label">${escapeHtml(article.buttonLabel||'Kipróbálás')}</span></button>
    </div>`;
  }
  return `<div class="${classes.join(' ')}" data-news-actions-for="${id}">
    <button type="button" class="news-action favorite-action ${state.saved.has(article.id)?'is-liked':''}" data-save="${id}" aria-label="${favoriteLabel(article.id)}">${favoriteIcon(article.id)}<span class="news-action-label">${favoriteLabel(article.id)}</span></button>
    <button type="button" class="news-action share-action" data-share="${id}" aria-label="Megosztás">${shareStateIcon()}<span class="news-action-label">Megosztás</span></button>
    <button type="button" class="news-action read-state-action ${state.read.has(article.id)?'is-read':'is-unread'}" data-read-toggle="${id}" aria-label="${readLabel(article.id)}">${readStateIcon(article.id)}<span class="news-action-label">${readLabel(article.id)}</span></button>
  </div>`;
}
function appShareUrl(article){
  return `https://muliksandor-arch.github.io/hirbeszed-prototipus/?openNews=${encodeURIComponent(article.id)}&from=share`;
}
async function shareArticle(id){
  const article=articleById(id);
  if(!article)return;
  const url=appShareUrl(article);
  const text=`Nyisd meg ezt a hírt a Hírbeszéd appban, vagy telepítés után hallgasd meg: ${article.title}`;
  if(navigator.share){
    try{await navigator.share({title:article.title,text,url});toast('Megosztás előkészítve');return;}catch(error){if(error?.name==='AbortError')return;}
  }
  try{await navigator.clipboard.writeText(`${text} ${url}`);toast('Hírbeszéd megosztási link másolva');}
  catch(_){toast('Hírbeszéd appnyitó megosztás helye');}
}
function toggleReadState(id){
  if(!articleById(id)||isPromoArticle(id))return;
  if(state.read.has(id)){state.read.delete(id);saveState();toast('Olvasatlanra jelölve');}
  else{recordRead(id);toast('Olvasottként jelölve');}
}
function refreshArticleViews(id){
  if(state.route==='feed')renderFeed();
  if(state.route==='car')updateCarDom();
  if(sheet.classList.contains('open')){
    if(sheet.classList.contains('detail-sheet'))renderArticleDetail(id,false);
    else if(activeSheetRenderer)activeSheetRenderer();
  }
}

function articleCard(article,compact=false){
  const read=state.read.has(article.id);
  return `<article class="news-card news-box ${compact?'compact-card news-box-small':'news-box-large'} ${read?'read':''}" data-article="${escapeHtml(article.id)}">
    <img class="article-image" src="${escapeHtml(article.image)}" alt="A hír illusztrációja">
    <div class="card-body"><div class="meta-line"><span class="meta-copy"><span>${escapeHtml(article.source)}</span><span class="meta-time">· ${escapeHtml(article.time)}</span></span>${newsActionButtons(article,{compact,inline:true,extraClass:'meta-news-actions'})}</div>
    <h2>${escapeHtml(article.title)}</h2>${compact?'':`<p>${escapeHtml(article.excerpt)}</p>`}</div></article>`;
}
function isFeedPromoEnabled(){
  return state.category==='fresh'&&state.sort!=='unread';
}
function priorityFeedPromos(){
  if(!isFeedPromoEnabled()||!state.promoFeedPriority||hasAssistantSubscription())return [];
  if(isActiveReaderSubscription()){
    const promos=[PROMO_ARTICLES.assistant];
    if(assistantTrialPromoAvailable())promos.push(PROMO_ARTICLES.assistantTrial);
    return promos;
  }
  if(isReaderLikeSubscription())return [PROMO_ARTICLES.assistant];
  if(isTrialExpired()||state.subscription.plan==='free'||state.subscription.status==='inactive')return [PROMO_ARTICLES.reader,PROMO_ARTICLES.assistant];
  return [];
}
function timedFeedPromos(){
  if(!isFeedPromoEnabled()||hasAssistantSubscription())return [];
  if(isActiveReaderSubscription()){
    const promos=[PROMO_ARTICLES.assistant];
    if(!state.promoFeedPriority&&assistantTrialPromoAvailable())promos.push(PROMO_ARTICLES.assistantTrial);
    return promos;
  }
  if(isReaderLikeSubscription())return [PROMO_ARTICLES.assistant];
  if(isTrialExpired()||state.subscription.plan==='free'||state.subscription.status==='inactive')return [PROMO_ARTICLES.reader,PROMO_ARTICLES.assistant];
  return [];
}
function promoCard(article,compact=false){
  const price=PLAN_CATALOG[article.promoPlan]?.monthlyPrice||'';
  return `<article class="news-card news-box promo-news-card ${compact?'compact-card news-box-small':'news-box-large'}" data-promo-id="${escapeHtml(article.id)}" data-article="${escapeHtml(article.id)}" aria-label="${escapeHtml(article.title)}">
    <img class="article-image" src="${escapeHtml(article.image)}" alt="Hírbeszéd ajánló">
    <div class="card-body"><div class="meta-line"><span class="meta-copy"><span>${escapeHtml(article.source)}</span><span class="meta-time">· ${escapeHtml(article.time)}</span></span><span class="promo-lock">Promóció</span></div>
    <h2>${escapeHtml(article.title)}</h2>${compact?'':`<p>${escapeHtml(article.excerpt)}</p>`}
    <button type="button" class="promo-news-button" data-promo-action="${escapeHtml(article.promoAction)}">${escapeHtml(article.buttonLabel)}${price?` · ${escapeHtml(price)}`:''}</button></div></article>`;
}
function timedPromoInterval(){
  if(isActiveReaderSubscription())return 35;
  return Number(state.subscription.promoInterval)||20;
}
function articleSequenceWithPromos(items){
  if(!isFeedPromoEnabled())return items;
  const priority=priorityFeedPromos();
  const timed=timedFeedPromos();
  if(!priority.length&&!timed.length)return items;
  const interval=timedPromoInterval();
  const output=[];
  let timedCount=0;
  const timedLimit=isActiveReaderSubscription()?1:2;
  items.forEach((article,index)=>{
    output.push(article);
    if(priority[0]&&index===0)output.push(priority[0]);
    if(priority[1]&&index===1)output.push(priority[1]);
    if(timedCount<timedLimit&&(index+1)%interval===0){
      const promo=timed[timedCount%timed.length];
      timedCount+=1;
      if(promo)output.push(promo);
    }
  });
  return output;
}
function feedItemsWithPromos(items){
  return articleSequenceWithPromos(items).map(article=>isPromoArticle(article)?promoCard(article,false):articleCard(article,false));
}
function filteredArticles(){
  const selectedTopic=topics.find(topic=>topic.id===state.category);
  let items=articles.filter(a=>state.sources[a.source]!==false && (state.category==='fresh'||a.category===selectedTopic?.name));
  if(state.showReadInFeed===false) items=items.filter(a=>!state.read.has(a.id));
  if(state.sort==='unread') items=items.filter(a=>!state.read.has(a.id));
  if(state.sort==='personal') items=[...items].sort((a,b)=>(state.saved.has(b.id)?1:0)-(state.saved.has(a.id)?1:0));
  return items;
}
function renderFeed(){
  setHeader('Hírfolyam',feedHeaderActions());
  const visibleTopics=topics.filter(topic=>topic.id==='fresh'||state.enabledTopics.includes(topic.id)); const items=filteredArticles();
  view.innerHTML=`<div class="segmented"><button data-sort="latest" class="${state.sort==='latest'?'active':''}">Legfrissebb</button><button data-sort="personal" class="${state.sort==='personal'?'active':''}">Nekem</button><button data-sort="unread" class="${state.sort==='unread'?'active':''}">Olvasatlan</button></div>
    <div class="chips topic-strip" aria-label="Hírtémák">${visibleTopics.map(topic=>`<button class="chip ${state.category===topic.id?'active':''}" data-category="${topic.id}">${topic.name}</button>`).join('')}</div>
    <div class="feed-list">${items.length?feedItemsWithPromos(items).join(''):`<div class="empty"><div class="empty-icon">✓</div><h2>Minden hírt átnéztél</h2><p>Válassz másik témát vagy frissítsd az RSS-forrásokat.</p></div>`}</div>`;
  if(window.HB_SYNC_RESPONSIVE_PREVIEW_MODE)window.HB_SYNC_RESPONSIVE_PREVIEW_MODE();
}

function currentCarArticle(){
  const list=currentReaderArticleList();
  return list.length?list[state.carIndex%list.length]:EMPTY_ARTICLE;
}
function currentSpeechBody(details=state.detailedRead){
  const article=currentCarArticle();
  return `${article.source}. ${article.title}. ${details?article.body:article.excerpt}`;
}
function resumeCurrentSpeech(){
  const details=currentSpeechText?currentSpeechDetails:state.detailedRead;
  if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){
    speakCurrent(details,currentSpeechOffset);
    return;
  }
  if(typeof navigator!=='undefined'&&/Android/i.test(navigator.userAgent||'')){
    speakCurrent(details,currentSpeechOffset);
    return;
  }
  try{speechSynthesis.resume();}catch(_){}
  setTimeout(()=>{
    if(state.route!=='car'||!state.playing||state.paused)return;
    let silent=false;
    try{silent=!speechSynthesis.speaking||speechSynthesis.paused;}catch(_){silent=true;}
    if(silent)speakCurrent(details,currentSpeechOffset);
  },420);
}
window.resumeCurrentSpeech=resumeCurrentSpeech;
function saveCurrentCarArticle(){
  const article=currentCarArticle();
  if(state.saved.has(article.id)){
    toast('Már kedvelted ezt a hírt');
    return;
  }
  toggleSaved(article.id);
}
function handleVoiceCommand(text){
  if(state.route!=='car')return false;
  const command=(text||'').toLowerCase();
  if(isAssistantTrialPromptOpen()){
    if(command.includes('igen')||command.includes('kiprób')||command.includes('kiprob')){acceptAssistantTrialOffer();return true;}
    if(command.includes('nem')||command.includes('később')||command.includes('kesobb')){dismissAssistantTrialOffer(true);return true;}
  }
  if(command.includes('mikrofon')){state.mic=!state.mic;clearCarMicWindow();toast(state.mic?'Mikrofon bekapcsolva: hír végén figyel':'Mikrofon kikapcsolva');updateCarDom();saveState();return true;}
  if(command.includes('felolvasás')||command.includes('felolvaso')||command.includes('felolvasó')){toggleCarPlayback();return true;}
  if(command.includes('hírléptető')||command.includes('hirlepteto')||command.includes('hírléptetés')){const wasOn=state.autoNext;state.autoNext=!state.autoNext;if(!state.autoNext)clearCarMicWindow();if(!wasOn&&state.autoNext){saveState();goToAdjacentArticle(1);return true;}saveState();updateCarDom();toast(state.autoNext?'Hírléptető bekapcsolva':'Hírléptető kikapcsolva');return true;}
  if(command.includes('következő')){goToAdjacentArticle(1);return true;}
  if(command.includes('előző')){goToAdjacentArticle(-1);return true;}
  if(command.includes('állj')||command.includes('stop')){stopSpeech();return true;}
  if(command.includes('szünet')){togglePause();return true;}
  if(command.includes('folytat')){togglePause();return true;}
  if(command.includes('rövidített')||command.includes('rövid hírek')||command.includes('rövidhírek')){if(state.detailedRead)toggleDetailedRead();else toast('Már rövidített híreket hallasz');return true;}
  if(command.includes('részlet')){toggleDetailedRead();return true;}
  if(command.includes('kedvel')||command.includes('kedvenc')||command.includes('ment')){saveCurrentCarArticle();return true;}
  toast('Nem értettem a hangutasítást');
  return false;
}
function clearAssistantTrialPromptTimer(){
  if(assistantTrialPromptTimer){clearTimeout(assistantTrialPromptTimer);assistantTrialPromptTimer=null;}
}
function isAssistantTrialPromptOpen(){
  return sheet.classList.contains('open')&&sheet.dataset.sheetKind==='assistant-trial-offer';
}
function noteReaderArticleFinished(){
  if(state.subscription.status==='active'&&state.subscription.plan==='reader'){
    state.subscription.readerArticlesSinceAssistantOffer=(Number(state.subscription.readerArticlesSinceAssistantOffer)||0)+1;
  }
}
function shouldOfferAssistantTrial(){
  const sub=state.subscription;
  if(state.route!=='car'||sub.status!=='active'||sub.plan!=='reader')return false;
  if(sub.assistantTrialWeek===currentWeekKey())return false;
  if(sub.assistantTrialAvailable===false)return false;
  return currentCarArticle().promoType==='assistant-trial';
}
function continueReaderAfterAssistantOffer(){
  clearAssistantTrialPromptTimer();
  clearCarMicWindow();
  if(state.route!=='car')return;
  updateCarDom();
  if(state.autoNext){
    carAutoAdvanceTimer=setTimeout(()=>{carAutoAdvanceTimer=null;if(state.route==='car'&&state.autoNext)nextArticle(true);},300);
  }
}
function assistantTrialOfferMarkup(attempt){
  const ask=attempt===0?'Kipróbálod most az AI Asszisztenst?':attempt===1?'Kipróbálod az Asszisztenst? Még várok a válaszodra.':'Utolsó kérdés: indítsuk az AI Asszisztens próbát?';
  return `<section class="subscription-screen assistant-trial-offer"><div class="expired-hero"><span class="expired-icon">AI</span><span class="subscription-kicker">HETI ASSZISZTENS PRÓBA</span><h1>${ask}</h1><p>Az AI Felolvasó előfizetésed mellé hetente egyszer 5 kérdéses próba jár. Mondhatod: igen, nem vagy később.</p></div><button class="primary-button coral-button" data-assistant-trial="accept">Kipróbálom · 5 kérdés</button><button class="secondary-button" data-assistant-trial="decline">Most nem</button></section>`;
}
function offerAssistantTrialPrompt(attempt=0){
  clearAssistantTrialPromptTimer();
  state.subscription.assistantTrialPromptAttempts=attempt;
  saveState();
  openSheet('AI Asszisztens próba','A Felolvasó megáll és választ vár',assistantTrialOfferMarkup(attempt));
  sheet.dataset.sheetKind='assistant-trial-offer';
  if(state.mic){
    carMicWindowActive=true;
    startRecognition('car',handleVoiceCommand,{continuous:false});
    updateCarDom();
  }
  assistantTrialPromptTimer=setTimeout(()=>{
    if(!isAssistantTrialPromptOpen())return;
    if(attempt<2)offerAssistantTrialPrompt(attempt+1);
    else dismissAssistantTrialOffer(true);
  },6500);
}
function maybeOfferAssistantTrial(){
  if(!shouldOfferAssistantTrial())return false;
  offerAssistantTrialPrompt(0);
  return true;
}
function acceptAssistantTrialOffer(){
  clearAssistantTrialPromptTimer();
  clearCarMicWindow();
  state.subscription.assistantTrialWeek=currentWeekKey();
  state.subscription.assistantTrialPromoClickedWeek=currentWeekKey();
  state.subscription.assistantTrialActive=true;
  state.subscription.assistantTrialRemaining=5;
  state.subscription.assistantTrialPromptAttempts=0;
  state.subscription.readerArticlesSinceAssistantOffer=0;
  saveState();
  closeSheet();
  if(state.route==='assistant'){render();activateRouteAudio('assistant');}else{changeRoute('assistant');}
  toast('AI Asszisztens próba: 5 kérdés elérhető');
}
function dismissAssistantTrialOffer(resumeReader=false){
  clearAssistantTrialPromptTimer();
  clearCarMicWindow();
  state.subscription.assistantTrialWeek=currentWeekKey();
  state.subscription.assistantTrialPromoDismissedWeek=currentWeekKey();
  state.subscription.assistantTrialActive=false;
  state.subscription.assistantTrialRemaining=0;
  state.subscription.assistantTrialPromptAttempts=0;
  state.subscription.readerArticlesSinceAssistantOffer=0;
  saveState();
  closeSheet();
  if(resumeReader)continueReaderAfterAssistantOffer();
}
function shouldKeepRecognitionAlive(context){
  if(context==='car')return state.route==='car'&&state.mic&&carMicWindowActive;
  if(context==='assistant')return state.route==='assistant'&&state.assistantMode==='voice';
  return false;
}
function startRecognition(context,onResult,options={}){
  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  const warnOptions={allowInCar:context==='car'};
  if(!Recognition){toast('Ez a böngésző nem támogatja a mikrofonos vezérlést',warnOptions);return false;}
  if(!shouldKeepRecognitionAlive(context))return false;
  const continuous=options.continuous!==false;
  try{
    stopVoiceListening();
    recognitionContext=context;
    currentRecognition=new Recognition();
    currentRecognition.lang='hu-HU';
    currentRecognition.continuous=continuous;
    currentRecognition.interimResults=false;
    currentRecognition.onresult=event=>{
      const result=event.results[event.results.length-1];
      const handled=onResult(result&&result[0]&&result[0].transcript);
      if(context==='car'&&handled&&state.autoNext)finishCarMicWindow(false);
    };
    currentRecognition.onerror=()=>toast('A mikrofon nem hallható vagy nincs engedély',warnOptions);
    currentRecognition.onend=()=>{if(continuous&&shouldKeepRecognitionAlive(context))try{currentRecognition.start();}catch(_){}}; 
    currentRecognition.start();
    toast(context==='assistant'?'Asszisztens figyel':'Mikrofon figyel');
    return true;
  }catch(_){
    toast('A mikrofon engedélyezése nem sikerült',warnOptions);
    return false;
  }
}
function startVoiceListening(){
  return startCarMicWindow();
}
function clearCarMicWindow(){
  if(carMicWindowTimer){clearTimeout(carMicWindowTimer);carMicWindowTimer=null;}
  carMicWindowActive=false;
  if(recognitionContext==='car')stopVoiceListening();
}
function finishCarMicWindow(advance=false){
  const shouldAdvance=advance&&state.route==='car'&&state.autoNext;
  clearCarMicWindow();
  if(state.route==='car')updateCarDom();
  if(shouldAdvance){
    carAutoAdvanceTimer=setTimeout(()=>{carAutoAdvanceTimer=null;if(state.route==='car'&&state.autoNext)nextArticle(true);},140);
  }
}
function scheduleAutoNextAfterReader(){
  if(state.route!=='car'){updateCarDom();return;}
  if(state.mic){
    startCarMicWindow();
    return;
  }
  if(!state.autoNext){updateCarDom();return;}
  updateCarDom();
  carAutoAdvanceTimer=setTimeout(()=>{carAutoAdvanceTimer=null;if(state.route==='car'&&state.autoNext)nextArticle(true);},700);
}
function startCarMicWindow(){
  if(state.route!=='car'||!state.mic)return false;
  clearCarMicWindow();
  carMicWindowActive=true;
  updateCarDom();
  const started=startRecognition('car',handleVoiceCommand,{continuous:!state.autoNext});
  if(state.autoNext){
    carMicWindowTimer=setTimeout(()=>finishCarMicWindow(true),3000);
    toast('Hír végi mikrofonablak: 3 másodperc');
    return true;
  }
  if(!started){
    carMicWindowActive=false;
    updateCarDom();
    return false;
  }
  toast('Mikrofon figyel: mondd a következő parancsot');
  return true;
}
function handleAssistantVoiceCommand(text){
  if(state.route!=='assistant'||state.assistantMode!=='voice')return;
  const question=(text||'').trim();
  if(!question)return;
  handleAssistantQuestion(question);
}
function startAssistantListening(){
  if(state.route!=='assistant'||state.assistantMode!=='voice')return false;
  return startRecognition('assistant',handleAssistantVoiceCommand);
}
function stopVoiceListening(){
  const recognition=currentRecognition;
  currentRecognition=null;
  recognitionContext=null;
  try{if(recognition){recognition.onend=null;recognition.stop();}}catch(_){}
}
function stopSpeech(update=true){
  clearReaderTimers();
  speechRunId++;
  if('speechSynthesis' in window)try{speechSynthesis.cancel();}catch(_){}
  currentUtterance=null; currentSpeechText=''; currentSpeechOffset=0; assistantSpeaking=false; state.playing=false; state.paused=false; if(update&&state.route==='car') updateCarDom(); if(update&&state.route==='assistant') updateAssistantDom();
}
function clearReaderTimers(){
  if(carAutoAdvanceTimer){clearTimeout(carAutoAdvanceTimer);carAutoAdvanceTimer=null;}
  if(carDeferredSheetTimer){clearTimeout(carDeferredSheetTimer);carDeferredSheetTimer=null;}
  if(carMicWindowTimer){clearTimeout(carMicWindowTimer);carMicWindowTimer=null;}
  clearAssistantTrialPromptTimer();
  carMicWindowActive=false;
  if(recognitionContext==='car')stopVoiceListening();
}
function stopReaderSession(resetOptions=false){
  clearReaderTimers();
  stopVoiceListening();
  stopSpeech(false);
  state.playing=false;
  state.paused=false;
  if(resetOptions)state.detailedRead=false;
}
function stopAssistantSession(){
  stopVoiceListening();
  stopSpeech(false);
}
function enforceSilentRoute(){
  stopVoiceListening();
  stopSpeech(false);
  clearReaderTimers();
  state.detailedRead=false;
}
function speakCurrent(details=state.detailedRead,startOffset=0){
  clearCarMicWindow();
  const article=currentCarArticle();
  const fullText=currentSpeechBody(details);
  const maxOffset=Math.max(0,fullText.length-1);
  const offset=Math.max(0,Math.min(Number(startOffset)||0,maxOffset));
  currentSpeechText=fullText;
  currentSpeechDetails=details;
  currentSpeechOffset=offset;
  if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){
    state.playing=true; state.paused=false;
    saveState();
    updateCarDom();
    toast('A böngésző nem támogatja a felolvasást, vizuális próba fut');
    return;
  }
  const runId=++speechRunId;
  try{speechSynthesis.cancel();}catch(_){}
  const remaining=fullText.slice(offset).trim()||fullText;
  const runOffset=remaining===fullText?0:offset;
  currentUtterance=new SpeechSynthesisUtterance(remaining);
  currentUtterance.lang='hu-HU'; currentUtterance.rate=1; state.playing=true; state.paused=false; updateCarDom();
  currentUtterance.onboundary=event=>{ if(runId!==speechRunId)return; if(typeof event.charIndex==='number')currentSpeechOffset=Math.min(fullText.length,runOffset+event.charIndex); };
  currentUtterance.onend=()=>{ if(runId!==speechRunId)return; currentSpeechText=''; currentSpeechOffset=0; recordRead(article.id); noteReaderArticleFinished(); state.playing=false; state.paused=false; if(maybeOfferAssistantTrial()){updateCarDom();return;} scheduleAutoNextAfterReader(); };
  currentUtterance.onerror=()=>{ if(runId!==speechRunId)return; currentUtterance=null;state.playing=true;state.paused=false;updateCarDom();toast('A böngésző hangmotorja nem indult el, vizuális próba fut');};
  try{speechSynthesis.speak(currentUtterance);}catch(_){if(runId!==speechRunId)return; currentUtterance=null;state.playing=true;state.paused=false;updateCarDom();toast('A böngésző hangmotorja nem indult el, vizuális próba fut');}
}
function toggleCarPlayback(){
  if(state.paused){
    state.paused=false; state.playing=true;
    resumeCurrentSpeech();
    updateCarDom(); saveState(); return;
  }
  if(state.playing){
    state.paused=true; state.playing=true;
    if('speechSynthesis' in window)try{speechSynthesis.pause();}catch(_){}
    updateCarDom(); saveState(); return;
  }
  speakCurrent();
  saveState();
}
window.toggleCarPlayback=toggleCarPlayback;
function handleCarPlayButton(event){
  event?.preventDefault?.();
  event?.stopPropagation?.();
  event?.stopImmediatePropagation?.();
  toggleCarPlayback();
  return false;
}
window.handleCarPlayButton=handleCarPlayButton;
function nextArticle(auto=false){
  if(auto&&state.route!=='car')return;
  const list=currentReaderArticleList();
  if(!list.length)return;
  recordRead(currentCarArticle().id);
  state.carIndex=(state.carIndex+1)%list.length;
  saveState();
  if(auto||state.playing){state.playing=true;state.paused=false;speakCurrent();}else updateCarDom();
}
function goToAdjacentArticle(direction,continuePlayback=true){
  if(state.route!=='car')return;
  clearReaderTimers();
  speechRunId++;
  if('speechSynthesis' in window)try{speechSynthesis.cancel();}catch(_){}
  currentUtterance=null; currentSpeechText=''; currentSpeechOffset=0;
  recordRead(currentCarArticle().id);
  const list=currentReaderArticleList();
  if(!list.length)return;
  state.carIndex=(state.carIndex+list.length+direction)%list.length;
  state.paused=false;
  saveState();
  if(continuePlayback){
    state.playing=true;
    speakCurrent();
    return;
  }
  state.playing=false;
  updateCarDom();
}
function togglePause(){
  if(state.paused){
    state.paused=false; state.playing=true;
    resumeCurrentSpeech();
    updateCarDom(); saveState(); return;
  }
  if(!state.playing){speakCurrent();return;}
  state.paused=true; state.playing=true;
  if('speechSynthesis' in window)try{speechSynthesis.pause();}catch(_){}
  updateCarDom(); saveState();
}
function toggleDetailedRead(){
  const switchingToDetailed=!state.detailedRead;
  if(!switchingToDetailed){
    speechRunId++;
    if('speechSynthesis' in window)try{speechSynthesis.cancel();}catch(_){}
    currentUtterance=null; currentSpeechText=''; currentSpeechOffset=0;
    recordRead(currentCarArticle().id);
    state.carIndex=(state.carIndex+1)%articles.length;
  }
  state.detailedRead=switchingToDetailed;
  state.paused=false;
  saveState();
  state.playing=true;
  speakCurrent(state.detailedRead);
  toast(state.detailedRead?'Részletes hírek bekapcsolva':'Rövidített hírek bekapcsolva');
}
function carVoiceActivityState(){
  if(state.playing&&!state.paused)return 'speaking';
  if(carMicWindowActive)return 'listening';
  return 'idle';
}
function voiceActivityMarkup(mode='idle',extraClass=''){
  const safeMode=['idle','speaking','listening'].includes(mode)?mode:'idle';
  const label=safeMode==='speaking'?'Felolvasás folyamatban':safeMode==='listening'?'Mikrofon figyel':'Nyugalmi hangállapot';
  return `<div class="wave voice-activity voice-${safeMode} ${safeMode==='speaking'?'':'paused'} ${extraClass}" data-voice-state="${safeMode}" role="img" aria-label="${label}"><span class="voice-rings" aria-hidden="true"><b></b><b></b><b></b></span><span class="voice-core" aria-hidden="true"></span><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>`;
}
function setVoiceActivityState(element,mode){
  if(!element)return;
  const safeMode=['idle','speaking','listening'].includes(mode)?mode:'idle';
  element.dataset.voiceState=safeMode;
  element.classList.toggle('voice-idle',safeMode==='idle');
  element.classList.toggle('voice-speaking',safeMode==='speaking');
  element.classList.toggle('voice-listening',safeMode==='listening');
  element.classList.toggle('paused',safeMode!=='speaking');
  element.setAttribute('aria-label',safeMode==='speaking'?'Felolvasás folyamatban':safeMode==='listening'?'Mikrofon figyel':'Nyugalmi hangállapot');
}
function planFeatureHtml(planId){
  return planFeatures(planId).map(feature=>`<span>✓ ${escapeHtml(feature)}</span>`).join('');
}
function renderCar(){
  const readerPromoMode=state.readerPromoMode&&!hasReaderAccess();
  setHeader('Felolvasó',subscriptionHeaderCta('car'));
  if(!hasReaderAccess()&&!readerPromoMode){
    view.innerHTML=subscriptionPromptMarkup('reader','reader-locked');
    return;
  }
  const article=currentCarArticle();
  const micLabel='Mikrofon';
  const playbackLabel=state.paused?'Folytatás':state.playing?'Szünet':'Felolvasás';
  const autoLabel='Hírléptető';
  const prevLabel='Előző';
  const detailLabel=state.detailedRead?'Rövidített hírek':'Részletes hírek';
  const saveLabel='Kedvelés';
  const nextLabel='Következő';
  const voiceCommands=[micLabel,playbackLabel,autoLabel,prevLabel,detailLabel,saveLabel,nextLabel];
  const voicePanel=state.mic
    ? `<div class="voice-command-panel"><strong>${carMicWindowActive?'Mikrofon figyel:':state.autoNext?'Hír végén 3 mp:':'Hír végén figyel:'}</strong><span>${state.autoNext?voiceCommands.join(' · '):`${voiceCommands.join(' · ')} · hír végén nyitva marad`}</span></div>`
    : `<div class="voice-command-panel inactive"><strong>Hangutasítások kikapcsolva</strong><span>Hangutasításokhoz kapcsold be a mikrofont a Mikrofon gomb megnyomásával.</span></div>`;
  view.innerHTML=`<section class="car-view"><div class="car-news-stack"><div class="car-image-wrap"><img class="article-image" src="${escapeHtml(article.image)}" alt="${escapeHtml(article.title)}"><span class="car-badge">${escapeHtml(article.category)}</span></div>
    <div class="car-status"><h1>${escapeHtml(article.title)}</h1><div class="meta-line car-meta-line"><span class="car-meta-text">${escapeHtml(article.source)} · ${escapeHtml(article.time)}</span>${newsActionButtons(article,{compact:true,inline:true,extraClass:'meta-news-actions car-meta-actions'})}</div></div></div>
    <div class="car-bottom-stack"><div class="car-wave-area">${voiceActivityMarkup(carVoiceActivityState())}</div>${voicePanel}
      <div class="car-controls"><button class="car-control step-control" data-car="prev" aria-label="Előző hír">${carControlIcon('prev')}<span class="car-control-label">${prevLabel}</span></button><button type="button" class="car-control read-toggle ${state.playing?'playing':''} ${state.paused?'paused is-pressed-state':''}" data-car="play" aria-label="${state.paused?'Felolvasás folytatása':state.playing?'Felolvasás szüneteltetése':'Felolvasás indítása'}">${carControlIcon(state.paused?'resume':state.playing?'pause':'play')}<span class="car-control-label">${playbackLabel}</span></button><button class="car-control step-control" data-car="next" aria-label="Következő hír">${carControlIcon('next')}<span class="car-control-label">${nextLabel}</span></button></div>
      <div class="car-step-controls"><button class="car-control mic ${state.mic?'':'off is-pressed-state'}" data-car="mic" aria-label="${state.mic?'Mikrofon bekapcsolva':'Mikrofon kikapcsolva'}">${carControlIcon('mic',state.mic)}<span class="car-control-label">${micLabel}</span></button><button class="car-control step-control details-control ${state.detailedRead?'active is-pressed-state':''}" data-car="details" aria-label="${state.detailedRead?'Rövidített hírek bekapcsolása':'Részletes hírek bekapcsolása'}">${carControlIcon('details',state.detailedRead)}<span class="car-control-label">${detailLabel}</span></button><button class="car-control auto-next ${state.autoNext?'':'off is-pressed-state'}" data-car="auto" aria-label="${state.autoNext?'Hírléptető bekapcsolva':'Hírléptető kikapcsolva'}">${carControlIcon('auto',state.autoNext)}<span class="car-control-label">${autoLabel}</span></button></div>
      </div></section>`;
}

const assistantOpeningQuestion='Melyik témával kezdjük a hírmustrát?';
const assistantPromptFallbacks=[
  {question:'Mivel kezdjük a hírmustrát?',description:'Mondd el, milyen témára vagy kíváncsi, és átnézem hozzá a híreket.'},
  {question:'Milyen hírekről beszéljünk?',description:'Kérdezhetsz témára, eseményre vagy forrásra, én pedig összefoglalom.'},
  {question:'Mi érdekel most leginkább?',description:'Mondd ki a témát, és segítek eligazodni a friss hírek között.'},
  {question:'Milyen témában nézzünk körül?',description:'Elég egy kulcsszó, például gazdaság, sport, közlekedés vagy technológia.'},
  {question:'Mit keressek meg a hírfolyamban?',description:'Mondd el röviden, mire vagy kíváncsi, és megkeresem a kapcsolódó híreket.'},
  {question:'Miről szeretnél hallani?',description:'Válaszolj természetesen, én pedig összefoglalom a lényeget.'},
  {question:'Melyik témával induljunk?',description:'Mondd ki a témát, és elmondom, mi történt benne mostanában.'},
  {question:'Miben segítsek a hírek között?',description:'Kérdezhetsz friss eseményről, háttérről vagy egy konkrét témáról.'},
  {question:'Melyik hír érdekel?',description:'Mondd el, mire gondolsz, és átnézem a hozzá kapcsolódó cikkeket.'},
  {question:'Keresünk valami frisset?',description:'Mondd ki a témát, és összeszedem a legfontosabb híreket.'},
  {question:'Mi legyen az első téma?',description:'Kezdhetünk bármivel, ami most érdekel a hírfolyamból.'},
  {question:'Milyen irányba menjünk?',description:'Mondhatsz témakört, hírtípust vagy egyszerű kérdést is.'},
  {question:'Mit nézzek át neked?',description:'A friss RSS-hírek alapján röviden összefoglalom, amit találok.'},
  {question:'Mire vagy kíváncsi a hírekből?',description:'Kérdezz szóban, és válaszolok a beállított források alapján.'},
  {question:'Kezdjük a hírmustrát?',description:'Mondd meg, milyen témával induljunk, és már nézem is.'},
  {question:'Mi foglalkoztat most?',description:'Elmondhatod saját szavaiddal, én hírekre fordítom a kérdést.'},
  {question:'Melyik témát bontsam ki?',description:'Röviden vagy részletesebben is elmondhatom, amit a hírekből látok.'},
  {question:'Kérdezz a friss hírekről.',description:'Mondd ki, mi érdekel, és keresek hozzá kapcsolódó híreket.'},
  {question:'Milyen hírt hallgatnál meg?',description:'Választhatsz témát, forrást vagy konkrét eseményt is.'},
  {question:'Indulhat a hangos hírmustra?',description:'Mondd el, merre induljunk, és összefoglalom a legfontosabbakat.'}
];
function normalizeAssistantPrompt(item){
  if(!item||typeof item.question!=='string'||typeof item.description!=='string')return null;
  const question=item.question.trim();
  const description=item.description.trim();
  return question&&description?{question,description}:null;
}
async function fetchAssistantPromptProvider(){
  // Later this can call the real AI/API endpoint with current news and user preferences.
  const response=await fetch('./assistant-prompts.json',{cache:'no-store'});
  if(!response.ok)throw new Error('assistant prompts unavailable');
  const data=await response.json();
  const items=Array.isArray(data)?data:data.items;
  if(!Array.isArray(items))throw new Error('assistant prompts malformed');
  return items.map(normalizeAssistantPrompt).filter(Boolean);
}
async function loadAssistantPromptProvider(){
  try{
    const prompts=await fetchAssistantPromptProvider();
    assistantPromptPool=prompts.length?prompts:[...assistantPromptFallbacks];
  }catch(_){
    assistantPromptPool=[...assistantPromptFallbacks];
  }
}
function randomAssistantPrompt(){
  const prompts=assistantPromptPool.length?assistantPromptPool:assistantPromptFallbacks;
  return prompts[Math.floor(Math.random()*prompts.length)]||{question:assistantOpeningQuestion,description:'Mondd el, mire vagy kíváncsi, és átnézem hozzá a híreket.'};
}
function prepareAssistantVoiceOpening(){
  activeAssistantPrompt=randomAssistantPrompt();
  assistantVoiceResult=null;
}
function currentAssistantPrompt(){
  if(!activeAssistantPrompt)prepareAssistantVoiceOpening();
  return activeAssistantPrompt;
}
function escapeHtml(value){
  return String(value??'').replace(/[&<>"']/g, char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function assistantMessageId(){
  return `am-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
}
function trimAssistantChat(){
  state.assistantChat=state.assistantChat.slice(-ASSISTANT_CHAT_MAX_MESSAGES);
}
function assistantOpeningMessageText(prompt=currentAssistantPrompt()){
  return `${prompt.question} ${prompt.description}`;
}
function addAssistantChatMessage(role,text,options={}){
  const clean=String(text||'').trim();
  if(!clean)return null;
  const message={
    id:assistantMessageId(),
    role,
    text:clean,
    kind:options.kind||'',
    title:options.title||'',
    description:options.description||'',
    source:options.source||'',
    articleId:options.articleId||'',
    articleIds:Array.isArray(options.articleIds)?options.articleIds.filter(Boolean).slice(0,5):[],
    createdAt:Date.now()
  };
  state.assistantChat.push(message);
  trimAssistantChat();
  saveState();
  return message;
}
function ensureAssistantConversation(){
  if(state.assistantChat.length)return;
  const prompt=currentAssistantPrompt();
  addAssistantChatMessage('assistant',assistantOpeningMessageText(prompt),{kind:'opening',title:prompt.question,description:prompt.description});
}
function resetAssistantConversation(){
  state.assistantChat=[];
  prepareAssistantVoiceOpening();
  ensureAssistantConversation();
  assistantVoiceResult=null;
  saveState();
}
function assistantHasRealExchange(){
  return state.assistantChat.some(message=>message.role==='user');
}
function normalizeIntentText(text){
  return String(text||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}
const ASSISTANT_STOP_WORDS=new Set('akkor ahol ahogy akarok alapjan amit arra arrol azt azok csak cikk cikket egy ebben engem ennek erdekel erdekelne ezt fel hogy hirek hireket hir hirbol hirt hozza kerlek kicsit lehet legyen meg melyik mi mik miket milyen mit most mondj mutasd vagy van vannak valami valamit'.split(' '));
function assistantKeywords(text){
  return normalizeIntentText(text).split(/[^a-z0-9]+/).filter(word=>word.length>2&&!ASSISTANT_STOP_WORDS.has(word));
}
function assistantIntentFor(text){
  const value=normalizeIntentText(text);
  return {
    value,
    keywords:assistantKeywords(text),
    wantsMore:['reszletes','bovebben','mondj tobbet','hatter','miert','errol','folytasd','bontsd ki'].some(phrase=>value.includes(phrase)),
    wantsSummary:['osszefoglal','foglalj ossze','attekintes','mi tortent','legfontosabb','hir mustra','hirmustra'].some(phrase=>value.includes(phrase)),
    wantsShort:['roviden','tomoren','egy mondatban'].some(phrase=>value.includes(phrase))
  };
}
function isAssistantNewConversationIntent(text){
  const value=normalizeIntentText(text);
  return ['mas erdekel','valtsunk temat','tema valtas','mas tema','uj beszelgetes','uj cseveges','kezdjunk ujat','kezdjuk ujra'].some(phrase=>value.includes(phrase));
}
function latestAssistantAnswer(){
  return [...state.assistantChat].reverse().find(message=>message.role==='assistant'&&message.kind!=='opening')||null;
}
function latestAssistantArticle(){
  const latest=latestAssistantAnswer();
  const id=latest?.articleId||latest?.articleIds?.[0];
  return id?articleById(id):null;
}
function titleFromAssistantText(text){
  const clean=String(text||'').replace(/\s+/g,' ').trim();
  const direct=clean.match(/^(.+?) friss híre:\s*(.+?)(?:\. Részletesebben:|$)/);
  if(direct)return direct[2].trim();
  const digest=clean.match(/\b1\.\s*([^:]+):\s*(.+?)(?:\. \d\.|$)/);
  if(digest)return digest[2].trim();
  return '';
}
function latestAssistantVoiceContext(){
  const latest=latestAssistantAnswer();
  if(!latest)return null;
  const title=latest.title||titleFromAssistantText(latest.text)||'Folytassuk innen';
  const description=latest.description||firstSentence(latest.text)||'Mondd el, merre menjünk tovább a hírek között.';
  return {message:latest,title,description};
}
function matchingArticleForQuestion(text){
  const matches=assistantArticleMatches(assistantIntentFor(text),1);
  return matches[0]||null;
}
function firstSentence(text){
  const clean=String(text||'').replace(/^Rövid hír:\s*/i,'').replace(/^Részletes hír:\s*/i,'').trim();
  const match=clean.match(/^.*?[.!?](?=\s|$)/);
  return (match?match[0]:clean).trim();
}
function assistantArticleScore(article,intent,index){
  if(state.sources[article.source]===false)return -1;
  const title=normalizeIntentText(article.title);
  const excerpt=normalizeIntentText(article.excerpt);
  const body=normalizeIntentText(article.body);
  const category=normalizeIntentText(article.category);
  const source=normalizeIntentText(article.source);
  let score=Math.max(0,30-index)*0.01;
  if(intent.value.includes(source))score+=12;
  if(intent.value.includes(category))score+=9;
  intent.keywords.forEach(word=>{
    if(source.includes(word))score+=8;
    if(category.includes(word))score+=6;
    if(title.includes(word))score+=4;
    if(excerpt.includes(word))score+=2;
    if(body.includes(word))score+=1;
  });
  return score;
}
function assistantArticleMatches(intent,limit=3){
  const scored=articles.map((article,index)=>({article,index,score:assistantArticleScore(article,intent,index)})).filter(item=>item.score>0);
  const matches=(scored.length?scored:articles.filter(article=>state.sources[article.source]!==false).map((article,index)=>({article,index,score:0})))
    .sort((a,b)=>b.score-a.score||a.index-b.index)
    .map(item=>item.article);
  return matches.slice(0,limit);
}
function assistantArticleLine(article,index){
  return `${index+1}. ${article.source}: ${article.title}. ${firstSentence(article.excerpt)}`;
}
function assistantSingleArticleAnswer(article,intent){
  const intro=intent.wantsMore?'Kibontom az utolsó kapcsolódó hírt.':'A hírfolyam alapján ez kapcsolódik leginkább a kérdésedhez.';
  const speech=intent.wantsShort
    ? `${article.source}: ${article.title}. ${firstSentence(article.excerpt)}`
    : `${intro} ${article.source} cikke szerint: ${article.title}. Röviden: ${firstSentence(article.excerpt)} Részletesebben: ${article.body}`;
  return {
    speech,
    title:article.title,
    description:firstSentence(article.excerpt||article.body),
    articleId:article.id,
    articleIds:[article.id]
  };
}
function assistantMultiArticleAnswer(matches,intent){
  if(!matches.length){
    return {speech:'A fejlesztési RSS-hírfolyam most nem tartalmaz elérhető hírt.',title:'Nincs találat',description:'A hírlista jelenleg üres.',articleIds:[]};
  }
  const main=matches[0];
  const topic=intent.keywords[0]?`a(z) ${intent.keywords[0]} témában`:'a betöltött RSS-hírek között';
  const lead=intent.wantsSummary?'Rövid hírmustrát adok.':`Ezt találtam ${topic}.`;
  const speech=`${lead} ${matches.map(assistantArticleLine).join(' ')} A legfontosabbnak most a ${main.source} híre tűnik: ${main.title}. Ha szeretnéd, ezt részletesebben is kibontom.`;
  return {
    speech,
    title:intent.wantsSummary?'Rövid hírmustra':main.title,
    description:firstSentence(main.excerpt||speech),
    articleId:main.id,
    articleIds:matches.map(article=>article.id)
  };
}
function assistantVoiceAnswerFor(text){
  const intent=assistantIntentFor(text);
  const previous=latestAssistantArticle();
  if(intent.wantsMore&&previous)return assistantSingleArticleAnswer(previous,intent);
  const matchLimit=intent.wantsSummary?3:3;
  const matches=assistantArticleMatches(intent,matchLimit);
  if(matches.length===1||(!intent.wantsSummary&&intent.keywords.length>0&&assistantArticleScore(matches[0],intent,0)>=8)){
    return assistantSingleArticleAnswer(matches[0],intent);
  }
  return assistantMultiArticleAnswer(matches,intent);
}
function addAssistantPromoChatMessage(role,text){
  const clean=String(text||'').trim();
  if(!clean)return null;
  const message={id:assistantMessageId(),role,text:clean,createdAt:Date.now()};
  state.assistantPromoChat.push(message);
  state.assistantPromoChat=state.assistantPromoChat.slice(-ASSISTANT_CHAT_MAX_MESSAGES);
  saveState();
  return message;
}
function ensureAssistantPromoConversation(){
  if(state.assistantPromoChat.length)return;
  addAssistantPromoChatMessage('assistant','Ehhez még nincs aktív AI Asszisztens előfizetésed. Szeretnéd tudni, melyik csomag mit ad, és hogyan lehet kipróbálni?');
}
function assistantPromoAnswerFor(text){
  const value=normalizeIntentText(text);
  if(value.includes('felolvas')||value.includes('hang')||value.includes('1490')){
    return 'Az AI Felolvasó előfizetés 1490 Ft havonta. AI-hanggal olvassa fel a hírfolyam cikkeit, automatikus hírléptetést és hangutasításokat ad.';
  }
  if(value.includes('assziszt')||value.includes('cseveg')||value.includes('3490')){
    return 'Az AI Asszisztens előfizetés 3490 Ft havonta. Tartalmazza az AI Felolvasó előfizetés funkcióit, és teljes csevegéses hírasszisztenst ad: kérdezhetsz, összefoglalót kérhetsz és témákat bontathatsz ki.';
  }
  if(value.includes('proba')||value.includes('próba')||value.includes('5')||value.includes('het')){
    return 'AI Felolvasó előfizetőként hetente egyszer 5 kérdéses AI Asszisztens próba jár. Ez a promóhíren keresztül indítható, és csak a felhasználói kérdéseket számolja.';
  }
  if(value.includes('ingyen')||value.includes('alap')){
    return 'Az Ingyenes csomag előfizetés nélkül elérhető. Ebben a hírfolyam, témák, kedvelések és részletes hírnézet érhető el. Az AI Felolvasó előfizetés és az AI Asszisztens előfizetés külön kapcsolható be.';
  }
  return 'Ebben a korlátozott Asszisztens promo módban csak a használati lehetőségekről tudok válaszolni: Ingyenes csomag, AI Felolvasó előfizetés és AI Asszisztens előfizetés.';
}
function assistantPromoChatEntryMarkup(message){
  const classes=['bubble'];
  if(message.role==='user')classes.push('user');
  const button=message.role==='assistant'?assistantPromoChatCtaButton():'';
  return `<div class="${classes.join(' ')}" data-message-id="${escapeHtml(message.id)}">${escapeHtml(message.text)}${button}</div>`;
}
function assistantPromoChatCtaButton(){
  const label=subscriptionCtaLabel('assistant');
  const target=subscriptionCtaTarget('assistant');
  return label?headerCtaButton(label,`${label} - Csomagok és előfizetés megnyitása`,target,'promo-chat-plan-button'):'';
}
function assistantPromoMarkup(){
  ensureAssistantPromoConversation();
  return `<section class="assistant-view assistant-mode-silent assistant-promo-mode">${assistantModeButtons(state.assistantMode)}<div class="assistant-silent-header"><div class="live">Előfizetési információ</div></div><div class="assistant-chat-panel"><div id="promoChatLog" class="chat-log">${state.assistantPromoChat.map(assistantPromoChatEntryMarkup).join('')}</div></div><form id="promoComposer" class="composer"><input id="promoChatInput" autocomplete="off" placeholder="Kérdezz az előfizetésről…"><button type="submit">➤</button></form></section>`;
}
function handleAssistantPromoQuestion(question){
  const clean=String(question||'').trim();
  if(!clean)return;
  ensureAssistantPromoConversation();
  addAssistantPromoChatMessage('user',clean);
  addAssistantPromoChatMessage('assistant',assistantPromoAnswerFor(clean));
  renderAssistant();
  requestAnimationFrame(()=>{const input=$('#promoChatInput');if(input){input.focus({preventScroll:true});input.setSelectionRange?.(input.value.length,input.value.length);}});
}
function handleAssistantQuestion(question){
  const clean=String(question||'').trim();
  if(!clean)return;
  if(!hasAssistantAccess()){
    state.assistantPromoMode=true;
    handleAssistantPromoQuestion(clean);
    return;
  }
  const assistantTrialQuestion=!hasAssistantSubscription()&&hasAssistantTrial();
  if(assistantTrialQuestion&&state.subscription.assistantTrialRemaining<=0){
    subscriptionSheet('plans');
    toast('A heti 5 kérdéses próba elfogyott');
    return;
  }
  if(isAssistantNewConversationIntent(clean)){
    resetAssistantConversation();
    renderAssistant();
    focusAssistantComposer();
    toast('Új csevegés indult');
    if(state.assistantMode!=='silent')speakAssistantText(assistantOpeningSpeechText());
    return;
  }
  const answer=assistantVoiceAnswerFor(clean);
  addAssistantChatMessage('user',clean);
  addAssistantChatMessage('assistant',answer.speech,{
    title:answer.title,
    description:answer.description,
    source:'A helyi RSS-hírfolyam alapján',
    articleId:answer.articleId,
    articleIds:answer.articleIds
  });
  if(assistantTrialQuestion){
    state.subscription.assistantTrialRemaining=Math.max(0,state.subscription.assistantTrialRemaining-1);
    if(state.subscription.assistantTrialRemaining===0){
      addAssistantChatMessage('assistant','A heti 5 kérdéses AI Asszisztens próba most elfogyott. A folytatáshoz válaszd az AI Asszisztens előfizetést.',{source:'Hírbeszéd előfizetés'});
    }
    saveState();
  }
  assistantVoiceResult={title:answer.title,description:answer.description};
  renderAssistant();
  focusAssistantComposer();
  if(state.assistantMode==='voice')toast('Asszisztens válasz felolvasása indul');
  if(state.assistantMode!=='silent')speakAssistantText(answer.speech);
}
function assistantWaveState(mode=state.assistantMode){
  if(assistantSpeaking)return 'speaking';
  if(mode==='voice')return 'listening';
  return 'idle';
}
function assistantLiveLabel(mode=state.assistantMode){
  if(mode==='voice')return assistantSpeaking?'Felolvasok':'Figyelek';
  if(mode==='text')return assistantSpeaking?'Felolvasok':'Gépelés';
  return 'Néma';
}
function assistantTitle(mode=state.assistantMode){
  if(mode==='voice'){
    const latest=latestAssistantVoiceContext();
    return assistantVoiceResult?.title||latest?.title||currentAssistantPrompt().question;
  }
  return assistantOpeningQuestion;
}
function assistantSubtitle(mode=state.assistantMode){
  if(mode==='voice'){
    const latest=latestAssistantVoiceContext();
    return assistantVoiceResult?.description||latest?.description||currentAssistantPrompt().description;
  }
  if(mode==='text')return 'Írd be, mire vagy kíváncsi, a választ felolvassa.';
  return 'Írd be, mire vagy kíváncsi, a választ szövegben kapod.';
}
function assistantOpeningSpeechText(){
  const prompt=currentAssistantPrompt();
  return `${prompt.question} ${prompt.description}`;
}
function assistantEntrySpeechText(){
  const latest=latestAssistantVoiceContext();
  if(latest)return `${latest.title}. ${latest.description}`;
  return assistantOpeningSpeechText();
}
function nextAssistantMode(mode=state.assistantMode){
  return mode==='voice'?'text':mode==='text'?'silent':'voice';
}
function assistantModeIcon(mode,extraClass=''){
  const cls=`mode-icon mode-icon-${mode}${extraClass?` ${extraClass}`:''}`;
  if(mode==='voice'){
    return `<span class="${cls}" aria-hidden="true"><svg viewBox="0 0 32 32" focusable="false"><path class="mode-line" d="M7 18v-4"></path><path class="mode-line" d="M12 22V10"></path><path class="mode-accent" d="M16 25V7"></path><path class="mode-line" d="M20 22V10"></path><path class="mode-line" d="M25 18v-4"></path></svg></span>`;
  }
  if(mode==='text'){
    return `<span class="${cls}" aria-hidden="true"><svg viewBox="0 0 32 32" focusable="false"><rect class="mode-line" x="5.5" y="8.5" width="21" height="15" rx="4"></rect><path class="mode-accent" d="M11 19.5h10"></path><circle class="mode-dot" cx="10.5" cy="14" r="1.4"></circle><circle class="mode-dot" cx="16" cy="14" r="1.4"></circle><circle class="mode-dot" cx="21.5" cy="14" r="1.4"></circle></svg></span>`;
  }
  return `<span class="${cls}" aria-hidden="true"><svg viewBox="0 0 32 32" focusable="false"><path class="mode-line" d="M6 18v-4h5l6-5v14l-6-5H6Z"></path><path class="mode-accent" d="M22.5 12.5l4 7"></path><path class="mode-accent" d="M26.5 12.5l-4 7"></path></svg></span>`;
}
function assistantModeButtons(mode=state.assistantMode){
  const modes=[['voice','Beszéd'],['text','Gépelés'],['silent','Néma']];
  return `<div class="mode-switch" aria-label="Asszisztens mód">${modes.map(([id,label])=>`<button class="${mode===id?'active':''}" data-mode="${id}" aria-label="${label} mód">${assistantModeIcon(id)}<span class="mode-label">${label}</span></button>`).join('')}</div>`;
}
function assistantChatEntryMarkup(message){
  const classes=['bubble'];
  if(message.role==='user')classes.push('user');
  if(message.kind==='opening')classes.push('opening');
  const source=message.source&&message.role==='assistant'?`<span class="sources">${escapeHtml(message.source)}</span>`:'';
  return `<div class="${classes.join(' ')}" data-message-id="${escapeHtml(message.id)}">${escapeHtml(message.text)}${source}</div>`;
}
function assistantChatLogMarkup(){
  ensureAssistantConversation();
  return `<div id="chatLog" class="chat-log">${state.assistantChat.map(assistantChatEntryMarkup).join('')}</div>`;
}
function assistantComposerMarkup(){
  return `<form id="composer" class="composer"><input id="chatInput" autocomplete="off" placeholder="Írj egy üzenetet…"><button type="submit">➤</button></form>`;
}
function assistantFullChatMarkup(){
  return `<div class="assistant-chat-panel">${assistantChatLogMarkup()}</div>${assistantComposerMarkup()}`;
}
function assistantVoiceSummaryMarkup(){
  return `<div class="assistant-voice-summary" aria-live="polite"><h1>${escapeHtml(assistantTitle('voice'))}</h1><p>${escapeHtml(assistantSubtitle('voice'))}</p></div>`;
}
function scrollAssistantChatToEnd(){
  requestAnimationFrame(()=>{document.querySelectorAll('.assistant-chat-panel .chat-log').forEach(log=>{log.scrollTop=log.scrollHeight;});});
}
function focusAssistantComposer(){
  if(state.route!=='assistant'||state.assistantMode==='voice')return;
  requestAnimationFrame(()=>{
    const input=$('#chatInput');
    if(!input)return;
    input.focus({preventScroll:true});
    input.setSelectionRange?.(input.value.length,input.value.length);
  });
}
function updateAssistantDom(){
  if(state.route!=='assistant')return;
  setVoiceActivityState(document.querySelector('.assistant-voice-activity'),assistantWaveState());
  const live=document.querySelector('.assistant-view .live');
  if(live)live.textContent=assistantLiveLabel();
}
function finishAssistantSpeech(runId,restartAssistantListening){
  if(runId!==speechRunId)return;
  currentUtterance=null;
  assistantSpeaking=false;
  updateAssistantDom();
  if(restartAssistantListening&&state.route==='assistant'&&state.assistantMode==='voice')startAssistantListening();
}
function finishAssistantSpeechAfterMinimum(runId,restartAssistantListening,duration,startedAt){
  const delay=Math.max(0,duration-(Date.now()-startedAt));
  setTimeout(()=>finishAssistantSpeech(runId,restartAssistantListening),delay);
}
function runAssistantVisualSpeechFallback(runId,restartAssistantListening,message,duration=3600){
  assistantSpeaking=true;
  updateAssistantDom();
  if(message)toast(message);
  setTimeout(()=>finishAssistantSpeech(runId,restartAssistantListening),duration);
}
function configureAssistantUtterance(utterance){
  utterance.lang='hu-HU';
  utterance.rate=1;
  try{
    const voices=speechSynthesis.getVoices?.()||[];
    const huVoice=voices.find(voice=>/^hu[-_]?/i.test(voice.lang||''))||voices.find(voice=>/magyar|hungarian/i.test(`${voice.name} ${voice.lang}`));
    if(huVoice)utterance.voice=huVoice;
  }catch(_){}
}
function speakAssistantText(text){
  if(state.route!=='assistant'||state.assistantMode==='silent')return;
  const visualDuration=Math.min(6500,Math.max(3600,String(text||'').length*55));
  if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){
    const runId=++speechRunId;
    runAssistantVisualSpeechFallback(runId,state.assistantMode==='voice','A válasz felolvasása vizuális próba',visualDuration);
    return;
  }
  const restartAssistantListening=state.assistantMode==='voice';
  if(restartAssistantListening)stopVoiceListening();
  const runId=++speechRunId;
  const startedAt=Date.now();
  try{speechSynthesis.cancel();}catch(_){}
  const utterance=new SpeechSynthesisUtterance(text);
  configureAssistantUtterance(utterance);
  currentUtterance=utterance;
  assistantSpeaking=true;
  updateAssistantDom();
  utterance.onend=()=>finishAssistantSpeechAfterMinimum(runId,restartAssistantListening,visualDuration,startedAt);
  utterance.onerror=()=>runAssistantVisualSpeechFallback(runId,restartAssistantListening,'A böngésző hangmotorja nem indult el, vizuális próba fut',visualDuration);
  try{
    speechSynthesis.resume?.();
    speechSynthesis.speak(utterance);
    setTimeout(()=>{try{speechSynthesis.resume?.();}catch(_){}},80);
  }catch(_){
    runAssistantVisualSpeechFallback(runId,restartAssistantListening,'A böngésző hangmotorja nem indult el, vizuális próba fut',visualDuration);
  }
}
function renderAssistant(){
  if(!hasAssistantAccess()){
    setHeader('Asszisztens',subscriptionHeaderCta('assistant'));
    if(state.assistantPromoMode){
      view.innerHTML=assistantPromoMarkup();
      scrollAssistantChatToEnd();
      return;
    }
    view.innerHTML=subscriptionPromptMarkup('assistant','assistant-locked');
    return;
  }
  const nextMode=nextAssistantMode();
  const nextModeLabel=nextMode==='voice'?'Beszéd':nextMode==='text'?'Gépelés':'Néma';
  setHeader('Asszisztens',hasAssistantTrial()&&!hasAssistantSubscription()?subscriptionHeaderCta('assistant'):iconButton(assistantModeIcon(nextMode,'header-mode-icon'),`${nextModeLabel} mód megnyitása`,'assistant-toggle'));
  const mode=state.assistantMode;
  ensureAssistantConversation();
  const wave=voiceActivityMarkup(assistantWaveState(mode),'assistant-voice-activity');
  if(mode==='voice'){
    view.innerHTML=`<section class="assistant-view assistant-mode-voice">${assistantModeButtons(mode)}<div class="assistant-hero"><div class="live">${assistantLiveLabel(mode)}</div><button class="assistant-wave-button" type="button" data-action="voice-demo" aria-label="Asszisztens hangállapot">${wave}</button>${assistantVoiceSummaryMarkup()}</div></section>`;
    return;
  }
  if(mode==='text'){
    view.innerHTML=`<section class="assistant-view assistant-mode-text">${assistantModeButtons(mode)}<div class="assistant-hero assistant-fixed-hero"><div class="live">${assistantLiveLabel(mode)}</div><button class="assistant-wave-button" type="button" data-action="voice-demo" aria-label="Asszisztens hangállapot">${wave}</button></div>${assistantFullChatMarkup()}</section>`;
    scrollAssistantChatToEnd();
    return;
  }
  view.innerHTML=`<section class="assistant-view assistant-mode-silent">${assistantModeButtons(mode)}<div class="assistant-silent-header"><div class="live">${assistantLiveLabel(mode)}</div></div>${assistantFullChatMarkup()}</section>`;
  scrollAssistantChatToEnd();
}

function activateRouteAudio(route=state.route){
  if(route==='car'){
    stopVoiceListening();
    if(state.readerPromoMode&&!hasReaderAccess()&&!state.playing){
      state.playing=true;
      speakCurrent();
    }
    return;
  }
  if(route==='assistant'){
    if(!hasAssistantAccess())return;
    ensureAssistantConversation();
    if(state.assistantMode==='voice')speakAssistantText(assistantEntrySpeechText());
    else stopVoiceListening();
    if(state.assistantMode==='silent')stopSpeech(false);
    return;
  }
  enforceSilentRoute();
}
function changeRoute(nextRoute){
  if(!nextRoute||state.route===nextRoute)return;
  const previousRoute=state.route;
  if(previousRoute==='car')stopReaderSession(true);
  if(previousRoute==='assistant')stopAssistantSession();
  if(nextRoute==='feed'||nextRoute==='settings')enforceSilentRoute();
  if(nextRoute==='car'){
    state.readerPromoMode=!hasReaderAccess();
    if(state.readerPromoMode)state.carIndex=0;
  }else{
    state.readerPromoMode=false;
  }
  if(nextRoute==='assistant')state.assistantPromoMode=!hasAssistantAccess();
  else state.assistantPromoMode=false;
  state.route=nextRoute;
  render();
  activateRouteAudio(nextRoute);
  saveState();
}
function setAssistantMode(mode){
  if(!['voice','text','silent'].includes(mode))return;
  if(state.assistantMode===mode){
    renderAssistant();
    activateRouteAudio('assistant');
    return;
  }
  stopAssistantSession();
  state.assistantMode=mode;
  renderAssistant();
  activateRouteAudio('assistant');
  saveState();
}

function subscriptionLabel(){
  const sub=state.subscription;
  const scheduled=subscriptionScheduledPlan();
  const scheduledText=scheduled?` · következő: ${PLAN_CATALOG[scheduled]?.shortName||planName(scheduled)}`:'';
  if(sub.status==='trial'&&sub.plan==='reader') return `AI Felolvasó próba · ${sub.trialDays} nap van hátra${scheduledText}`;
  if(sub.status==='active') return `${PLAN_CATALOG[sub.plan]?.shortName||'Ingyenes csomag'} · aktív${scheduledText}`;
  if(isTrialExpired()) return 'Ingyenes hírfolyam · AI Felolvasó próba lejárt';
  return 'Ingyenes hírfolyam · AI Felolvasó próba elérhető';
}
function settingsItems(){
  const activeSources=Object.values(state.sources).filter(Boolean).length;
  const activeTopics=state.enabledTopics.length;
  return [
    ['◉','RSS-források',`${activeSources} bekapcsolva`,'sources'],['#','Témák és érdeklődés',`${activeTopics} kiválasztva`,'topics'],['🔔','Értesítések',state.notifications?'Bekapcsolva':'Kikapcsolva','notifications'],['◐','Megjelenés',state.theme==='system'?'Rendszer szerint':state.theme==='dark'?'Sötét':'Világos','appearance'],['◉','Hang és felolvasó','Magyar hang · 1,0×','voice'],['⇅','Mobiladat és tárhely',state.mobileData?'Mobilnet engedélyezve':'Csak Wi-Fi','data'],['⌖','Helyi hírek',state.location?'Budapest környéke':'Kikapcsolva','location'],['♙','Fiók és biztonság','Prototípus-fiók','account'],['↺','Prototípus','Fejlesztési beállítások','prototype']
  ];
}
function renderSettings(){
  const items=settingsItems();
  setHeader('Beállítások'); view.innerHTML=`<div class="settings-group subscription-entry">${settingRow(['✦','Csomagok és előfizetés',subscriptionLabel(),'subscription'])}</div><div class="settings-group">${items.slice(0,4).map(settingRow).join('')}</div><div class="settings-group">${items.slice(4,8).map(settingRow).join('')}</div><div class="settings-group">${items.slice(8).map(settingRow).join('')}</div>`;
}
function settingRow(item){return `<button class="settings-row" data-setting="${item[3]}"><span class="row-icon">${item[0]}</span><span class="row-copy"><strong>${item[1]}</strong><small>${item[2]}</small></span><span class="row-end">›</span></button>`;}

function render(){
  stopSpeech(false);
  if(state.route!=='car'){stopVoiceListening();state.detailedRead=false;}
  document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.route===state.route));
  view.classList.toggle('feed-route-view',state.route==='feed');
  view.classList.toggle('car-route-view',state.route==='car');
  view.classList.toggle('assistant-route-view',state.route==='assistant');
  ({feed:renderFeed,car:renderCar,assistant:renderAssistant,settings:renderSettings}[state.route]||renderCar)();
  if(window.HB_SYNC_RESPONSIVE_PREVIEW_MODE)window.HB_SYNC_RESPONSIVE_PREVIEW_MODE();
  view.scrollTop=0; saveState(); renderSubscriptionGate(); renderDeviceSessionGate(); scheduleAssistantKeyboardUpdate();
}
function renderSubscriptionGate(){
}

function openSheet(title,subtitle,html,renderer=null){ $('#sheetTitle').textContent=title; $('#sheetSubtitle').textContent=subtitle||''; sheetBody.innerHTML=html; activeSheetRenderer=renderer; sheet.classList.remove('sheet-no-header','detail-sheet'); delete sheet.dataset.sheetKind; sheet.classList.add('open'); sheet.setAttribute('aria-hidden','false'); }
function closeSheet(){ clearAssistantTrialPromptTimer(); sheet.classList.remove('open','sheet-no-header','detail-sheet'); sheet.setAttribute('aria-hidden','true'); delete sheet.dataset.sheetKind; activeSheetRenderer=null; if(state.route==='feed')renderFeed(); if(state.route==='settings')renderSettings(); }
function renderArticleDetail(id,markRead=false){
  const a=articleById(id);
  if(!a)return;
  if(markRead)recordRead(id);
  const originalButton=a.url?`<button class="primary-button detail-original-button" data-original="${escapeHtml(a.id)}">Eredeti cikk megnyitása</button>`:'';
  openSheet('Részletes hír',`${a.source} · ${a.time}`,`<article class="detail detail-carded"><section class="detail-lead-card"><div class="detail-hero"><img src="${escapeHtml(a.image)}" alt="A hír illusztrációja"></div><div class="detail-title-block"><div class="meta-line detail-meta"><span>${escapeHtml(a.category)}</span><span class="meta-time">· ${escapeHtml(a.source)} · ${escapeHtml(a.time)}</span></div><h1>${escapeHtml(a.title)}</h1></div></section><section class="detail-content-column">${newsActionButtons(a,{detail:true})}<section class="detail-content-card"><p class="detail-copy">${escapeHtml(a.body)}</p>${originalButton}</section></section></article>`);
  sheet.classList.add('detail-sheet');
}
function openArticle(id){renderArticleDetail(id,true);}
function searchSheet(){ openSheet('Keresés','Hírek, témák és források',`<input id="searchInput" class="search-input" type="search" placeholder="Keresés…" autofocus><div id="searchResults">${articles.map(a=>articleCard(a,true)).join('')}</div>`); }
function librarySheet(tab='saved'){
  const ids=tab==='saved'?[...state.saved]:state.history; const items=ids.map(articleById).filter(Boolean);
  openSheet('Könyvtár',tab==='saved'?'Kedvelt hírek':'Előzmények',`<div class="sheet-tabs"><button data-library="saved" class="${tab==='saved'?'active':''}">Kedveltek</button><button data-library="history" class="${tab==='history'?'active':''}">Előzmények</button></div><div>${items.length?items.map(a=>articleCard(a,true)).join(''):`<div class="empty"><div class="empty-icon">♡</div><h2>Még nincs itt semmi</h2><p>A hírkártyák Kedvelés gombjával gyűjtheted ide a híreket.</p></div>`}</div>`,()=>librarySheet(tab));
}
function planName(plan){return PLAN_CATALOG[normalizePlanId(plan)]?.name||PLAN_CATALOG.reader.name;}
function planPrice(plan){return PLAN_CATALOG[normalizePlanId(plan)]?.price||PLAN_CATALOG.reader.price;}
function usageSheet(){
  const sub=state.subscription; const remaining=Math.max(0,sub.assistantTrialRemaining||0);
  openSheet('AI Asszisztens próba','Heti 5 kérdés',`<section class="subscription-screen"><div class="minutes-ring" style="--usage:${Math.round(((5-remaining)/5)*360)}deg"><div><strong>${remaining}</strong><span>kérdés maradt</span></div></div><h2 class="center-title">Próbáld ki a csevegéses hírmustrát</h2><p class="center-copy">Az AI Felolvasó előfizetők hetente egyszer 5 kérdés erejéig kipróbálhatják az AI Asszisztenst.</p><button class="primary-button coral-button" data-sub-action="assistant-weekly-trial">Próba indítása</button><button class="secondary-button" data-sub-action="subscription-home">Vissza az előfizetéshez</button></section>`);
}
function activatePlan(planId,options={}){
  const previousRoute=options.returnRoute||subscriptionStayRoute(state.route);
  const nextPlan=normalizePlanId(planId);
  state.subscription=normalizeSubscription({...state.subscription,status:'active',plan:nextPlan,trialDays:0,activeDaysLeft:nextPlan==='free'?0:30,scheduledPlan:'',scheduledDays:0,assistantTrialActive:false,assistantTrialRemaining:0,readerArticlesSinceAssistantOffer:0});
  state.route=options.stayOnSubscription?previousRoute:subscriptionHomeRoute(state.subscription);
  state.readerPromoMode=false;
  state.assistantPromoMode=false;
  saveState();
  if(options.stayOnSubscription){
    render();
    subscriptionSheet('overview','',options.entry||'menu');
  }else{
    if(sheet.classList.contains('open'))closeSheet();
    render();
  }
  if(options.activateAudio===true)activateRouteAudio(state.route);
  toast(`${planName(nextPlan)} aktiválva`);
}
function startReaderTrial(options={}){
  const previousRoute=options.returnRoute||subscriptionStayRoute(state.route);
  state.subscription=normalizeSubscription({...state.subscription,status:'trial',plan:'reader',trialDays:14,activeDaysLeft:0,scheduledPlan:'',scheduledDays:0,assistantTrialActive:false,assistantTrialRemaining:0,readerArticlesSinceAssistantOffer:0});
  state.route=options.stayOnSubscription?previousRoute:'car';
  state.readerPromoMode=false;
  state.assistantPromoMode=false;
  state.autoNext=true;
  state.mic=true;
  saveState();
  if(options.stayOnSubscription){
    render();
    subscriptionSheet('overview','',options.entry||'menu');
  }else{
    if(sheet.classList.contains('open'))closeSheet();
    render();
  }
  if(options.activateAudio===true)activateRouteAudio('car');
  toast('A 14 napos AI Felolvasó próba elindult');
}
function startAssistantWeeklyTrial(){
  if(state.subscription.plan!=='reader'||state.subscription.status!=='active'){
    subscriptionSheet('plans');
    toast('Az 5 kérdéses próba az AI Felolvasó előfizetőknek jár');
    return;
  }
  state.subscription.assistantTrialWeek=currentWeekKey();
  state.subscription.assistantTrialPromoClickedWeek=currentWeekKey();
  state.subscription.assistantTrialActive=true;
  state.subscription.assistantTrialRemaining=5;
  state.subscription.assistantTrialPromptAttempts=0;
  state.subscription.readerArticlesSinceAssistantOffer=0;
  saveState();
  closeSheet();
  changeRoute('assistant');
  toast('AI Asszisztens próba: 5 kérdés elérhető');
}

function isKnownPlan(planId){
  return ['free','reader','assistant'].includes(planId);
}
function normalizePlanChoice(planId){
  const mapped=planId==='basic'?'reader':planId==='pro'?'assistant':planId;
  return isKnownPlan(mapped)?mapped:'';
}
function subscriptionPlanRank(planId){
  return ({free:0,reader:1,assistant:2})[normalizePlanChoice(planId)] ?? -1;
}
function subscriptionEffectivePlan(){
  const sub=state.subscription||{};
  if((sub.status==='active'||sub.status==='trial')&&isKnownPlan(sub.plan))return sub.plan;
  return 'free';
}
function subscriptionScheduledPlan(){
  const sub=state.subscription||{};
  const scheduled=normalizePlanChoice(sub.scheduledPlan);
  return scheduled&&scheduled!==subscriptionEffectivePlan()?scheduled:'';
}
function visibleRouteFallback(){
  const title=$('#pageTitle')?.textContent?.trim();
  if(title==='Hírfolyam')return 'feed';
  if(title==='Felolvasó')return 'car';
  if(title==='Asszisztens')return 'assistant';
  if(title==='Beállítások')return 'settings';
  return state.route;
}
function subscriptionStayRoute(fallbackRoute=state.route){
  const center=sheetBody.querySelector('.subscription-center');
  if(center?.dataset.entry==='menu')return 'settings';
  return state.subscriptionReturnRoute||fallbackRoute;
}
function currentEntitlementDaysLeft(){
  const sub=state.subscription||{};
  if(sub.status==='trial'&&sub.plan==='reader')return Math.max(0,Number(sub.trialDays)||0);
  if(sub.status==='active'&&sub.plan!=='free')return Math.max(0,Number(sub.activeDaysLeft)||0);
  return 0;
}
function currentEntitlementTimeText(){
  const sub=state.subscription||{};
  if(sub.status==='active'&&sub.plan!=='free')return 'Az előfizetés fordulónapjáig';
  const days=currentEntitlementDaysLeft();
  return days?`Még ${days} napig`:'Az aktuális időszak végéig';
}
function subscriptionNextPlan(){
  const sub=state.subscription||{};
  const scheduled=subscriptionScheduledPlan();
  if(scheduled)return scheduled;
  if(sub.status==='payment_failed')return normalizePlanChoice(sub.plan)||'reader';
  if(hasAssistantSubscription())return 'assistant';
  if(isReaderLikeSubscription()||hasAssistantTrial())return 'assistant';
  return 'reader';
}
function subscriptionCtaTarget(route){
  const sub=state.subscription||{};
  if(hasAssistantSubscription())return '';
  if(sub.status==='payment_failed')return normalizePlanChoice(sub.plan)||'reader';
  if(route==='car')return isReaderLikeSubscription()||hasAssistantTrial()?'assistant':'reader';
  if(route==='assistant')return 'assistant';
  return subscriptionNextPlan();
}
function headerCtaButton(label,ariaLabel='Csomagok és előfizetés megnyitása',targetPlan='',className='header-cta-button'){
  const target=normalizePlanChoice(targetPlan);
  return `<button class="${escapeHtml(className)}" type="button" data-action="plans" ${target?`data-sub-target="${target}"`:''} aria-label="${escapeHtml(ariaLabel)}">${escapeHtml(label)}</button>`;
}
function subscriptionCtaLabel(route){
  const sub=state.subscription;
  if(hasAssistantSubscription())return '';
  if(sub.status==='payment_failed')return 'Előfizetési hiba';
  if(route==='car'){
    if(isReaderLikeSubscription()||hasAssistantTrial())return 'Aktiváld az Asszisztens funkciót';
    return 'Aktiváld a Felolvasó funkciót';
  }
  if(route==='assistant')return 'Aktiváld az Asszisztens funkciót';
  return '';
}
function subscriptionHeaderCta(route){
  const label=subscriptionCtaLabel(route);
  const target=subscriptionCtaTarget(route);
  return label?headerCtaButton(label,`${label} - Csomagok és előfizetés megnyitása`,target):'';
}
function canStartReaderTrialForSelection(planId){
  const sub=state.subscription||{};
  return planId==='reader'
    && isPrototypeReaderTrialAvailable()
    && sub.status!=='expired'
    && sub.status!=='payment_failed'
    && !hasAssistantSubscription()
    && !(sub.status==='trial'&&sub.plan==='reader')
    && !(sub.status==='active'&&sub.plan==='reader');
}
function subscriptionActionLabel(selectedPlan,entry='menu'){
  if(entry==='onboarding'&&selectedPlan==='free')return 'Tovább az ingyenes hírfolyamra';
  return 'Módosítás jóváhagyása';
}
function readerTrialDaysLeft(){
  return Math.max(0,Number(state.subscription?.trialDays)||0);
}
function clampReaderTrialDays(value){
  return Math.max(1,Math.min(READER_TRIAL_DEFAULT_DAYS,Math.round(Number(value)||READER_TRIAL_DEFAULT_DAYS)));
}
function prototypeReaderTrialDaysLeft(){
  return clampReaderTrialDays(state.prototypeReaderTrialDaysLeft);
}
function isPrototypeReaderTrialAvailable(){
  const sub=state.subscription||{};
  return state.prototypeReaderTrialAvailable!==false && sub.status!=='expired' && sub.status!=='payment_failed';
}
function freeReaderTrialDaysLeft(){
  return prototypeReaderTrialDaysLeft();
}
function planDescription(planId){
  return PLAN_CATALOG[planId]?.description||'';
}
function planFeatures(planId){
  if(planId==='free'){
    const features=[...PLAN_CATALOG.free.features];
    features.push(isPrototypeReaderTrialAvailable()
      ? `AI Felolvasó próba: még ${freeReaderTrialDaysLeft()} nap`
      : 'AI Felolvasó próbaidő már nem elérhető');
    return features;
  }
  return PLAN_CATALOG[planId]?.features||[];
}
function currentPackageStatusLine(){
  return '<span class="plan-status-line">Jelenleg ezt használod.</span>';
}
function freeTrialStatusLine(){
  return isPrototypeReaderTrialAvailable()
    ? `<span class="plan-status-line trial"><strong class="trial-days-left">Még ${freeReaderTrialDaysLeft()} nap</strong><span> az AI Felolvasó próbaidőből.</span></span>`
    : '<span class="plan-status-line">Az AI Felolvasó próbaidő már nem elérhető.</span>';
}
function planStateBadge(planId,activePlan,selectedPlan,entry='menu'){
  const scheduled=subscriptionScheduledPlan();
  if(activePlan===planId)return '<span class="plan-state-badge active">AKTÍV</span>';
  if(scheduled===planId)return '<span class="plan-state-badge next">KÖVETKEZŐ</span>';
  return '<span class="plan-state-badge inactive">NEM AKTÍV</span>';
}
function planStatusLine(planId,selected,active,entry='menu'){
  const scheduled=subscriptionScheduledPlan();
  const isScheduled=scheduled===planId;
  let text='';
  let tone='';
  if(planId==='free'){
    if(entry==='onboarding'){
      return freeTrialStatusLine();
    }
    else if(active&&scheduled)text=`${currentEntitlementTimeText()} ezt használod. Utána ${PLAN_CATALOG[scheduled]?.shortName||planName(scheduled)} indul.`;
    else if(active){
      return `${currentPackageStatusLine()}${freeTrialStatusLine()}`;
    }
    else if(isScheduled)text='A jelenlegi időszak után az ingyenes csomag indul.';
    else return freeTrialStatusLine();
  }
  if(planId==='reader'){
    if(active&&scheduled)return `<span class="plan-status-line"><strong class="trial-days-left">${currentEntitlementTimeText()}</strong><span> ezt használod. Utána ${PLAN_CATALOG[scheduled]?.shortName||planName(scheduled)} indul.</span></span>`;
    if(active)text='Jelenleg ezt használod.';
    else if(isScheduled)text='A jelenlegi időszak után az AI Felolvasó előfizetés indul.';
    else if(selected)text='Jóváhagyás után az AI Felolvasó előfizetés indul.';
  }
  if(planId==='assistant'){
    if(active&&scheduled)text=`${currentEntitlementTimeText()} ezt használod. Utána ${PLAN_CATALOG[scheduled]?.shortName||planName(scheduled)} indul.`;
    else if(active)text='Jelenleg ezt használod.';
    else if(isScheduled)text='A jelenlegi időszak után az AI Asszisztens előfizetés indul.';
    else if(selected)text='Jóváhagyás után az AI Asszisztens előfizetés indul.';
  }
  return text?`<span class="plan-status-line ${tone}">${escapeHtml(text)}</span>`:'';
}
function planCards(selectedPlan=subscriptionNextPlan(),entry='menu'){
  const activePlan=subscriptionEffectivePlan();
  const scheduledPlan=subscriptionScheduledPlan();
  return `<div class="plan-list subscription-plan-list">${['free','reader','assistant'].map(planId=>{
    const plan=PLAN_CATALOG[planId];
    const selected=selectedPlan===planId;
    const active=entry!=='onboarding'&&activePlan===planId;
    const scheduled=scheduledPlan===planId;
    return `<button class="plan-card ${planId==='assistant'?'assistant-plan':''} ${selected?'selected pending':''} ${active?'active':''} ${scheduled?'scheduled':''}" data-plan="${planId}" type="button">
      ${planStateBadge(planId,activePlan,selectedPlan,entry)}
      <span class="plan-check">${selected?'✓':''}</span>
      <span class="plan-copy"><span class="plan-title">${escapeHtml(plan.name)}</span><span class="plan-price">${escapeHtml(plan.monthlyPrice)}</span><span class="plan-description">${escapeHtml(planDescription(planId))}</span>${planStatusLine(planId,selected,active,entry)}<span class="plan-features">${planFeatureHtml(planId)}</span></span>
    </button>`;
  }).join('')}</div>`;
}
function resolveSubscriptionSelection(screen,targetPlan){
  const explicit=normalizePlanChoice(targetPlan);
  if(explicit)return explicit;
  if(screen==='onboarding')return 'free';
  if(screen==='overview'){
    return subscriptionScheduledPlan()||subscriptionEffectivePlan();
  }
  if(['plans','confirm','onboarding','menu'].includes(screen)){
    return subscriptionNextPlan();
  }
  const pending=normalizePlanChoice(state.subscription?.pendingPlan);
  return pending||subscriptionNextPlan();
}
function subscriptionSummary(selectedPlan,entry){
  const activePlan=subscriptionEffectivePlan();
  const comparisonPlan=subscriptionScheduledPlan()||activePlan;
  const changed=state.subscription.status!=='payment_failed'&&(selectedPlan!==comparisonPlan||['inactive','expired'].includes(state.subscription.status));
  const requiresConfirmation=entry==='onboarding'||changed||state.subscription.status==='payment_failed';
  return requiresConfirmation?`<div class="subscription-confirm-bar"><button class="primary-button coral-button" data-sub-action="confirm-subscription-change">${escapeHtml(subscriptionActionLabel(selectedPlan,entry))}</button></div>`:'';
}
function subscriptionSheet(screen='overview',targetPlan='',entry='menu'){
  if(!sheet.classList.contains('open')||!sheetBody.querySelector('.subscription-center')){
    state.subscriptionReturnRoute=visibleRouteFallback();
  }
  const selectedPlan=resolveSubscriptionSelection(screen,targetPlan);
  state.subscription.pendingPlan=selectedPlan;
  const assistantTrialHtml=state.subscription.status==='active'&&state.subscription.plan==='reader'
    ? `<button class="usage-panel subscription-trial-panel" data-sub-action="assistant-weekly-trial" type="button"><span><strong>AI Asszisztens heti próba</strong><small>${state.subscription.assistantTrialWeek===currentWeekKey()?'Erre a hétre már felajánlva':'5 kérdéses próba elérhető'}</small></span><span>${state.subscription.assistantTrialRemaining||5} kérdés</span><i><b style="width:${state.subscription.assistantTrialWeek===currentWeekKey()?100:0}%"></b></i></button>`
    : '';
  return openSheet('Csomagok és előfizetés','Aktív csomag és váltási opciók',`<section class="subscription-screen subscription-center" data-selected-plan="${escapeHtml(selectedPlan)}" data-entry="${escapeHtml(entry)}">
    ${assistantTrialHtml}
    <div class="subscription-hero compact"><h1>Válaszd ki az általad használni kívánt csomagot vagy előfizetést</h1></div>
    ${planCards(selectedPlan,entry)}
    ${subscriptionSummary(selectedPlan,entry)}
    <div class="subscription-tools">
      <button class="text-button" data-sub-action="restore-purchase" type="button">Vásárlás visszaállítása</button>
      <p class="subscription-restore-note">Akkor használd, ha már előfizettél az áruházban, de az app még nem látja az aktív csomagot.</p>
    </div>
  </section>`,()=>subscriptionSheet(screen,state.subscription.pendingPlan,entry));
}
function openSubscriptionCenter(targetPlan='',entry='menu'){
  return subscriptionSheet('overview',normalizePlanChoice(targetPlan),entry);
}
function completeOnboardingSubscription(planId,status){
  state.subscription=normalizeSubscription({...state.subscription,status,plan:planId,trialDays:status==='trial'&&planId==='reader'?14:0,activeDaysLeft:status==='active'&&planId!=='free'?30:0,scheduledPlan:'',scheduledDays:0,assistantTrialActive:false,assistantTrialRemaining:0,readerArticlesSinceAssistantOffer:0});
  state.onboarding={...(state.onboarding||{}),required:true,introSeen:true,authDone:true,subscriptionDone:true,rssDone:false,privacyAccepted:true,completed:false};
  state.route=subscriptionHomeRoute(state.subscription);
  state.autoNext=true;
  state.mic=true;
  state.playing=false;
  saveState();
  closeSheet();
  if(typeof window.hirbeszedShowOnboardingSources==='function')window.hirbeszedShowOnboardingSources();
  else render();
  toast(status==='trial'?'A 14 napos AI Felolvasó próba elindult':planId==='free'?'Ingyenes csomag elindítva':'A csomag kiválasztva');
}
function shouldScheduleSubscriptionChange(selectedPlan){
  const activePlan=subscriptionEffectivePlan();
  const sub=state.subscription||{};
  if(state.prototypeImmediateSubscriptionChange)return false;
  return selectedPlan!==activePlan
    && activePlan!=='free'
    && ['active','trial'].includes(sub.status)
    && subscriptionPlanRank(selectedPlan)<subscriptionPlanRank(activePlan);
}
function scheduleSubscriptionChange(planId){
  const nextPlan=normalizePlanChoice(planId);
  if(!nextPlan)return;
  const days=currentEntitlementDaysLeft();
  state.subscription=normalizeSubscription({...state.subscription,scheduledPlan:nextPlan,scheduledDays:days||30,pendingPlan:nextPlan});
  saveState();
  subscriptionSheet('overview',nextPlan);
  toast(nextPlan==='free'?'Előfizetés lemondása beállítva az időszak végére':'Csomagváltás beállítva az aktuális időszak végére');
}
function clearScheduledSubscriptionChange(){
  const activePlan=subscriptionEffectivePlan();
  state.subscription=normalizeSubscription({...state.subscription,scheduledPlan:'',scheduledDays:0,pendingPlan:activePlan});
  saveState();
  subscriptionSheet('overview',activePlan);
  toast('Következő csomag törölve');
}
function confirmSubscriptionSelection(){
  const selectedPlan=normalizePlanChoice(state.subscription.pendingPlan)||subscriptionNextPlan();
  if(state.onboarding?.required){
    const status=canStartReaderTrialForSelection(selectedPlan)?'trial':'active';
    completeOnboardingSubscription(selectedPlan,status);
    return;
  }
  if(subscriptionScheduledPlan()&&selectedPlan===subscriptionEffectivePlan()){clearScheduledSubscriptionChange();return;}
  if(shouldScheduleSubscriptionChange(selectedPlan)){scheduleSubscriptionChange(selectedPlan);return;}
  if(selectedPlan==='free'){
    const previousRoute=subscriptionStayRoute(state.route);
    setFreeAccess();
    state.route=previousRoute;
    saveState();
    render();
    subscriptionSheet('overview','');
    toast('Ingyenes csomag aktív a prototípusban');
    return;
  }
  if(canStartReaderTrialForSelection(selectedPlan)){startReaderTrial({stayOnSubscription:true});return;}
  activatePlan(selectedPlan,{stayOnSubscription:true});
}
function restorePurchasePrototype(){
  const plan=normalizePlanChoice(state.subscription.pendingPlan)||normalizePlanChoice(state.subscription.plan)||'reader';
  activatePlan(plan==='free'?'reader':plan,{stayOnSubscription:true});
  toast('Vásárlás visszaállítva a prototípusban');
}
function subscriptionPromptMarkup(planId,context='screen'){
  const plan=PLAN_CATALOG[planId];
  const title=planId==='reader'?'Az AI Felolvasóval a hírek akkor is mennek veled, amikor nem nézed a kijelzőt.':'Az AI Asszisztenssel beszélgethetsz a hírfolyam híreiről.';
  const subtitle=planId==='reader'?'A funkció aktiválása az előfizetés oldalon történik.':'A teljes csevegéses hírasszisztens az előfizetés oldalon aktiválható.';
  return `<section class="subscription-screen route-subscription-prompt ${context}">
    <div class="subscription-hero"><span class="subscription-kicker">${escapeHtml(plan.name)}</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div>
    <div class="plan-card selected pending"><span class="plan-copy"><span class="plan-title">${escapeHtml(plan.name)}</span><span class="plan-price">${escapeHtml(plan.monthlyPrice)}</span><span class="plan-description">${escapeHtml(planDescription(planId))}</span><span class="plan-features">${planFeatureHtml(planId)}</span></span></div>
    <button class="primary-button coral-button" data-sub-action="plans" data-sub-target="${escapeHtml(planId)}">Csomagok és előfizetés</button>
    <button class="text-button" data-route="feed">Vissza az ingyenes hírfolyamhoz</button>
  </section>`;
}
document.addEventListener('click',event=>{
  const planButton=event.target.closest('.subscription-center [data-plan]');
  if(planButton){
    event.preventDefault();
    event.stopImmediatePropagation();
    const center=planButton.closest('.subscription-center');
    const entry=center?.dataset.entry==='onboarding'?'onboarding':'selection';
    state.subscription.pendingPlan=normalizePlanChoice(planButton.dataset.plan)||subscriptionNextPlan();
    saveState();
    subscriptionSheet('overview',state.subscription.pendingPlan,entry);
    return;
  }
  const subscriptionAction=event.target.closest('[data-sub-action]');
  if(subscriptionAction){
    const action=subscriptionAction.dataset.subAction;
    if(['plans','review','subscription-home'].includes(action)){
      event.preventDefault();
      event.stopImmediatePropagation();
      openSubscriptionCenter(subscriptionAction.dataset.subTarget,subscriptionAction.dataset.subTarget?'cta':'menu');
      return;
    }
    if(subscriptionAction.closest('.subscription-center')){
      event.preventDefault();
      event.stopImmediatePropagation();
      if(action==='confirm-subscription-change'){confirmSubscriptionSelection();return;}
      if(action==='restore-purchase'||action==='restore'){restorePurchasePrototype();return;}
      if(action==='assistant-weekly-trial'){startAssistantWeeklyTrial();return;}
    }
  }
  const headerPlans=event.target.closest('[data-action="plans"]');
  if(headerPlans){
    event.preventDefault();
    event.stopImmediatePropagation();
    openSubscriptionCenter(headerPlans.dataset.subTarget,'cta');
    return;
  }
},true);
function addSourceSheet(){
  const recommendations=['444','G7','Hírstart','Index','Népszava'];
  openSheet('Új RSS-forrás','Ajánlásból vagy RSS-linkkel',`<section class="source-add-screen"><h3 class="section-label">Ajánlott magyar források</h3><div class="settings-group">${recommendations.map(name=>`<button class="settings-row" data-recommended-source="${name}"><span class="row-icon">${name[0]}</span><span class="row-copy"><strong>${name}</strong><small>Ellenőrzött RSS-ajánlás</small></span><span class="row-end">＋</span></button>`).join('')}</div><h3 class="section-label">Hozzáadás RSS-linkkel</h3><form id="rssSourceForm" class="source-form"><label for="rssSourceUrl">RSS-csatorna címe</label><input id="rssSourceUrl" class="search-input" type="url" inputmode="url" placeholder="https://pelda.hu/rss" required><button class="primary-button" type="submit">RSS-forrás hozzáadása</button></form><button class="text-button" data-source-back>Vissza az RSS-forrásokhoz</button></section>`);
}
function topicSettingsSheet(){
  const topicButtons=topics.map(topic=>`<button class="chip ${topic.id==='fresh'||state.enabledTopics.includes(topic.id)?'active':''}" data-topic-toggle="${topic.id}">${topic.name}</button>`).join('');
  const topicRows=topics.map(topic=>{
    const active=topic.id==='fresh'||state.enabledTopics.includes(topic.id);
    return `<button class="settings-row topic-row ${topic.id==='fresh'?'fixed-topic':''}" data-topic-toggle="${topic.id}"><span class="row-icon">${topic.name[0]}</span><span class="row-copy"><strong>${topic.name}</strong><small>${topic.description}</small></span><span class="toggle ${active?'on':''}"></span></button>`;
  }).join('');
  openSheet('Témák és érdeklődés','A hírfolyam és a keresés témái',`<p class="settings-intro">A felső témasor oldalra görgethető. Kapcsold ki azokat a témákat, amelyeket nem szeretnél látni.</p><div class="chips topic-strip topic-settings-strip">${topicButtons}</div><div class="settings-group topic-settings-list">${topicRows}</div><div class="settings-group">${settingRow(['✦','Személyre szabott sorrend','Bekapcsolva','personal'])}${settingRow(['↺','Érdeklődési profil törlése','A kedvelések megmaradnak','reset-profile'])}</div>`);
}
function settingsSheet(type){
  if(type==='subscription') return subscriptionSheet();
  if(type==='appearance') return openSheet('Megjelenés','Téma és hozzáférhetőség',`<div class="theme-grid"><button class="theme-card ${state.theme==='light'?'active':''}" data-theme="light">Világos</button><button class="theme-card dark-preview ${state.theme==='dark'?'active':''}" data-theme="dark">Sötét</button><button class="theme-card system-preview ${state.theme==='system'?'active':''}" data-theme="system">Rendszer</button></div><div class="settings-group" style="margin-top:15px">${settingRow(['A','Betűméret','Rendszer szerint','font'])}${settingRow(['◌','Kontraszt növelése','Kikapcsolva','contrast'])}</div>`);
  if(type==='sources') return openSheet('RSS-források','Közvetlenül a készüléken',`<button class="primary-button" data-add-source>＋ Új RSS-forrás</button><div class="settings-group" style="margin-top:13px">${Object.entries(state.sources).map(([name,on])=>`<button class="settings-row" data-source="${name}"><span class="row-icon">${name[0]}</span><span class="row-copy"><strong>${name}</strong><small>${on?'Bekapcsolva':'Kikapcsolva'}</small></span><span class="toggle ${on?'on':''}"></span></button>`).join('')}</div>`);
  if(type==='topics') return topicSettingsSheet();
  if(type==='promotions') return settingsSheet('prototype');
  if(type==='notifications') return openSheet('Értesítések','Helyi prototípus-beállítás',`<div class="settings-group"><button class="settings-row" data-toggle-setting="notifications"><span class="row-icon">!</span><span class="row-copy"><strong>Rendkívüli hírek</strong><small>${state.notifications?'Bekapcsolva':'Kikapcsolva'}</small></span><span class="toggle ${state.notifications?'on':''}"></span></button>${settingRow(['☀','Napi összefoglaló','Minden nap 07:30','digest'])}${settingRow(['☾','Csendes időszak','22:00–07:00','quiet'])}</div>`);
  if(type==='voice') return openSheet('Hang és felolvasó','Felolvasás és viselkedés',`<div class="settings-group">${settingRow(['A','Felolvasóhang','Magyar rendszerhang','voice-name'])}${settingRow(['↔','Beszédsebesség','1,0×','rate'])}<button class="settings-row" data-toggle-setting="autoNext"><span class="row-icon">⇥</span><span class="row-copy"><strong>Automatikus következő</strong><small>${state.autoNext?'Bekapcsolva':'Kikapcsolva'}</small></span><span class="toggle ${state.autoNext?'on':''}"></span></button></div>`);
  if(type==='data') return openSheet('Mobiladat és tárhely','Hálózati beállítások',`<div class="settings-group"><button class="settings-row" data-toggle-setting="mobileData"><span class="row-icon">⇅</span><span class="row-copy"><strong>RSS-frissítés mobilneten</strong><small>${state.mobileData?'Engedélyezve':'Csak Wi-Fi'}</small></span><span class="toggle ${state.mobileData?'on':''}"></span></button>${settingRow(['▧','Képek mobilneten','Engedélyezve','images'])}${settingRow(['⌫','Gyorsítótár törlése','A kedvelések megmaradnak','cache'])}</div>`);
  if(type==='location') return openSheet('Helyi hírek','Hozzávetőleges hely',`<div class="empty" style="padding-top:28px"><div class="empty-icon">⌖</div><h2>Helyi hírek a közeledből</h2><p>A prototípus nem kér valódi helyadatot.</p></div><button class="primary-button" data-toggle-setting="location">${state.location?'Helyi hírek kikapcsolása':'Budapest kiválasztása'}</button>`);
  if(type==='account') return openSheet('Fiók és biztonság','Prototípus',`<div class="settings-group">${settingRow(['♙','Profil','Anna · anna@pelda.hu','profile'])}${settingRow(['A','Kapcsolt fiókok','Apple, Google, Facebook','accounts'])}${settingRow(['✦','Kétlépcsős védelem','Nincs bekapcsolva','2fa'])}</div>`);
  if(type==='prototype') return openSheet('Prototípus','Fejlesztési beállítások',prototypeSettingsContent());
  if(type==='device-session') return deviceSessionSimulationSheet();
  openSheet('Beállítás','Prototípus',`<div class="empty"><div class="empty-icon">⚙</div><h2>Ez a rész a prototípusban bemutató jellegű</h2></div>`);
}

document.addEventListener('click',event=>{
  const deviceSessionAction=event.target.closest('[data-device-session-action]');
  if(deviceSessionAction){
    event.preventDefault();
    event.stopPropagation();
    const action=deviceSessionAction.dataset.deviceSessionAction;
    if(action==='take-over'){takeOverDeviceSession();return;}
    if(action==='stay-locked'){toast('A használat ezen az eszközön továbbra is szünetel',{allowInCar:true});return;}
  }
  const deviceSessionSim=event.target.closest('[data-device-session-sim]');
  if(deviceSessionSim){
    event.preventDefault();
    event.stopPropagation();
    const status=deviceSessionSim.dataset.deviceSessionSim;
    if(status==='active'){
      setDeviceSessionState('active','Normál eszközhasználat visszaállítva');
      deviceSessionSimulationSheet();
      return;
    }
    closeSheet();
    setDeviceSessionState(status,status==='detached'?'Ez az eszköz leválasztva szimulációban':'Másik eszköz aktív szimulációban');
    return;
  }
  const route=event.target.closest('[data-route]'); if(route){changeRoute(route.dataset.route);return;}
  const save=event.target.closest('[data-save]'); if(save){event.preventDefault();event.stopPropagation();const id=save.dataset.save;toggleSaved(id);refreshArticleViews(id);return;}
  const share=event.target.closest('[data-share]'); if(share){event.preventDefault();event.stopPropagation();shareArticle(share.dataset.share);return;}
  const readToggle=event.target.closest('[data-read-toggle]'); if(readToggle){event.preventDefault();event.stopPropagation();const id=readToggle.dataset.readToggle;toggleReadState(id);refreshArticleViews(id);return;}
  const promoAction=event.target.closest('[data-promo-action]');
  if(promoAction){
    event.preventDefault();event.stopPropagation();
    const action=promoAction.dataset.promoAction;
    if(action==='reader-promo'){state.readerPromoMode=true;state.carIndex=0;changeRoute('car');return;}
    if(action==='assistant-promo'){state.assistantPromoMode=true;changeRoute('assistant');return;}
    if(action==='assistant-trial'){state.subscription.assistantTrialPromoClickedWeek=currentWeekKey();startAssistantWeeklyTrial();return;}
  }
  const card=event.target.closest('[data-article]'); if(card&&!event.target.closest('.news-actions')){openArticle(card.dataset.article);return;}
  const sort=event.target.closest('[data-sort]'); if(sort){state.sort=sort.dataset.sort;renderFeed();saveState();return;}
  const category=event.target.closest('[data-category]'); if(category){state.category=category.dataset.category;renderFeed();saveState();return;}
  const action=event.target.closest('[data-action]'); if(action){const a=action.dataset.action;if(a==='close-sheet'){closeSheet();return;}if(a==='search')searchSheet();if(a==='library')librarySheet('saved');if(a==='toggle-read-feed'){state.showReadInFeed=!state.showReadInFeed;saveState();renderFeed();toast(state.showReadInFeed?'Olvasott hírek láthatók':'Olvasott hírek elrejtve');}if(a==='plans')openSubscriptionCenter(action.dataset.subTarget,'menu');if(a==='assistant-toggle')setAssistantMode(nextAssistantMode());if(a==='voice-demo')toast(state.assistantMode==='voice'?'Beszéd mód: mondd el a kérdésed':state.assistantMode==='text'?'Gépelés mód: a válasz felolvasva érkezik':'Néma mód: csak szöveges válasz');return;}
  const car=event.target.closest('[data-car]'); if(car){
    const carAction=car.dataset.car;
    if(carAction==='mic'){
      const nextMic=!state.mic;
      transitionCarControl(car,!nextMic,()=>{state.mic=nextMic;clearCarMicWindow();toast(state.mic?(state.autoNext?'Mikrofon bekapcsolva: hír végén 3 mp':'Mikrofon bekapcsolva: hír végén nyitva marad'):'Mikrofon kikapcsolva');updateCarDom();saveState();});
      return;
    }
    if(carAction==='auto'){
      const wasOn=state.autoNext;
      const nextAuto=!state.autoNext;
      transitionCarControl(car,!nextAuto,()=>{state.autoNext=nextAuto;if(!state.autoNext)clearCarMicWindow();if(!wasOn&&state.autoNext){saveState();goToAdjacentArticle(1);return;}updateCarDom();saveState();});
      return;
    }
    if(carAction==='play'){toggleCarPlayback();saveState();return;}
    if(carAction==='prev'){goToAdjacentArticle(-1);return;}
    if(carAction==='next'){goToAdjacentArticle(1);return;}
    if(carAction==='details'){transitionCarControl(car,!state.detailedRead,()=>toggleDetailedRead());return;}
    saveState();return;
  }
  const mode=event.target.closest('[data-mode]'); if(mode){setAssistantMode(mode.dataset.mode);return;}
  const question=event.target.closest('[data-question]'); if(question){handleAssistantQuestion(question.dataset.question);return;}
  const setting=event.target.closest('[data-setting]'); if(setting){settingsSheet(setting.dataset.setting);return;}
  const assistantTrial=event.target.closest('[data-assistant-trial]'); if(assistantTrial){assistantTrial.dataset.assistantTrial==='accept'?acceptAssistantTrialOffer():dismissAssistantTrialOffer(true);return;}
  const source=event.target.closest('[data-source]'); if(source){state.sources[source.dataset.source]=!state.sources[source.dataset.source];saveState();settingsSheet('sources');return;}
  const recommendedSource=event.target.closest('[data-recommended-source]'); if(recommendedSource){const name=recommendedSource.dataset.recommendedSource;state.sources[name]=true;saveState();settingsSheet('sources');toast(`${name} hozzáadva`);return;}
  const topicToggle=event.target.closest('[data-topic-toggle]'); if(topicToggle){const id=topicToggle.dataset.topicToggle;if(id==='fresh'){toast('A Friss összesítő mindig elérhető');return;}state.enabledTopics=state.enabledTopics.includes(id)?state.enabledTopics.filter(topicId=>topicId!==id):[...state.enabledTopics,id];if(state.category===id&&!state.enabledTopics.includes(id))state.category='fresh';saveState();topicSettingsSheet();return;}
  const lib=event.target.closest('[data-library]'); if(lib){librarySheet(lib.dataset.library);return;}
  const theme=event.target.closest('button[data-theme]'); if(theme){state.theme=theme.dataset.theme;applyTheme();saveState();settingsSheet('appearance');return;}
  const original=event.target.closest('[data-original]'); if(original){const article=articleById(original.dataset.original); if(article?.url)window.open(article.url,'_blank','noopener'); else toast('Ehhez a hírhez nincs eredeti link'); return;}
  const toggleSetting=event.target.closest('[data-toggle-setting]'); if(toggleSetting){const key=toggleSetting.dataset.toggleSetting;state[key]=!state[key];saveState();settingsSheet(key==='autoNext'?'voice':key==='mobileData'?'data':key==='location'?'location':['promoFeedPriority','prototypeImmediateSubscriptionChange','prototypeReaderTrialAvailable'].includes(key)?'prototype':'notifications');return;}
  if(event.target.closest('[data-add-source]')){addSourceSheet();return;}
  if(event.target.closest('[data-source-back]')){settingsSheet('sources');return;}
  if(event.target.closest('[data-demo-reset]')){resetPrototypeToFirstLaunch(500);}
});

document.addEventListener('input',event=>{
  const prototypeTrialDaysInput=event.target.closest?.('[data-prototype-trial-days]');
  if(prototypeTrialDaysInput){
    const raw=String(prototypeTrialDaysInput.value||'').trim();
    if(raw){
      const next=clampReaderTrialDays(raw);
      state.prototypeReaderTrialDaysLeft=next;
      prototypeTrialDaysInput.value=String(next);
      saveState();
    }
    return;
  }
  if(event.target.id==='searchInput'){const q=event.target.value.toLowerCase();$('#searchResults').innerHTML=articles.filter(a=>(a.title+' '+a.excerpt+' '+a.source+' '+a.category).toLowerCase().includes(q)).map(a=>articleCard(a,true)).join('')||`<div class="empty"><p>Nincs találat.</p></div>`;}
});
document.addEventListener('change',event=>{
  const prototypeTrialDaysInput=event.target.closest?.('[data-prototype-trial-days]');
  if(!prototypeTrialDaysInput)return;
  const next=clampReaderTrialDays(prototypeTrialDaysInput.value);
  state.prototypeReaderTrialDaysLeft=next;
  prototypeTrialDaysInput.value=String(next);
  saveState();
});
document.addEventListener('submit',event=>{
  if(event.target.id==='composer'){event.preventDefault();const input=$('#chatInput');if(input.value.trim()){handleAssistantQuestion(input.value.trim());input.value='';}}
  if(event.target.id==='promoComposer'){event.preventDefault();const input=$('#promoChatInput');if(input.value.trim()){handleAssistantPromoQuestion(input.value.trim());input.value='';}}
  if(event.target.id==='rssSourceForm'){event.preventDefault();const input=$('#rssSourceUrl');try{const url=new URL(input.value.trim());const name=url.hostname.replace(/^www\./,'');state.sources[name]=true;saveState();settingsSheet('sources');toast(`${name} hozzáadva`);}catch{toast('Adj meg egy érvényes RSS-linket');}}
});
function appendChat(question){handleAssistantQuestion(question);}

$('#sheetBack').addEventListener('click',event=>{event.preventDefault();event.stopPropagation();closeSheet();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&sheet.classList.contains('open'))closeSheet();});
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(state.theme==='system')applyTheme();});
async function startApp(){
  applyTheme();
  setupAssistantKeyboardHandling();
  await loadNewsArticles();
  await loadAssistantPromptProvider();
  if(state.route==='assistant'&&!state.assistantChat.length)prepareAssistantVoiceOpening();
  render();
  activateRouteAudio(state.route);
}
startApp();
if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(()=>{});
