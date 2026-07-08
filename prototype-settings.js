(function(){
  const topicCatalog=[
    {id:'fresh',name:'Friss',description:'Legfrissebb és vezető hírek'},{id:'domestic',name:'Belföld',description:'Magyar közélet, politika és társadalom'},{id:'foreign',name:'Külföld',description:'Nemzetközi hírek, EU, világpolitika'},{id:'economy',name:'Gazdaság',description:'Infláció, árak, forint, cégek és ipar'},{id:'money',name:'Pénz',description:'Adózás, bank, hitel, nyugdíj és bérek'},{id:'business',name:'Vállalkozás',description:'KKV, pályázatok, támogatások és üzleti trendek'},{id:'tech_ai',name:'Tech & AI',description:'Mesterséges intelligencia, technológia és kiberbiztonság'},{id:'weather',name:'Időjárás',description:'Előrejelzés, riasztások és időjárási események'},{id:'traffic',name:'Közlekedés',description:'Útinform, balesetek, tömegközlekedés és üzemanyagár'},{id:'real_estate',name:'Ingatlan',description:'Lakásárak, albérlet, lakáshitel és építőipar'},{id:'career',name:'Munka',description:'Álláspiac, karrier, HR és munkajog'},{id:'health',name:'Egészség',description:'Egészségügy, gyógyszer, életmód és járványok'},{id:'education',name:'Oktatás',description:'Iskola, egyetem, felvételi és érettségi'},{id:'sport',name:'Sport',description:'Foci, Forma–1, kézilabda, olimpia és magyar sport'},{id:'culture',name:'Kultúra',description:'Film, zene, könyv, színház és programok'},{id:'tabloid',name:'Bulvár',description:'Celebek, TV, szórakozás és könnyed hírek'},{id:'auto',name:'Autó',description:'Autópiac, elektromos autók, KRESZ és bírságok'},{id:'green',name:'Zöld',description:'Környezet, klíma, energia és fenntarthatóság'},{id:'law',name:'Jog',description:'Törvények, rendeletek, fogyasztóvédelem és adatvédelem'},{id:'local',name:'Helyi',description:'Budapest, vármegyék, városi és helyi hírek'}
  ];
  const defaults={
    personalized:true,
    voiceName:'Magyar rendszerhang',speechRate:'1.0',
    imagesMobile:true,profileName:'Anna',profileEmail:'anna@pelda.hu',
    linkedAccounts:{Apple:true,Google:true,Facebook:true},twoFactor:true,twoFactorMethod:'E-mail'
  };
  state.settingsPrefs={...defaults,...(state.settingsPrefs||{}),linkedAccounts:{...defaults.linkedAccounts,...(state.settingsPrefs?.linkedAccounts||{})}};
  ['digestEnabled','digestTime','quietEnabled','quietPeriod'].forEach(key=>delete state.settingsPrefs[key]);
  if(state.settingsPrefs.twoFactorMethod!=='E-mail')state.settingsPrefs.twoFactorMethod='E-mail';

  let currentPanel=null;
  let panelStack=[];

  function valueLabel(value,labels){return labels[value]||value;}
  function optionButtons(key,options){
    return `<div class="choice-list">${options.map(option=>`<button class="choice-button ${String(state.settingsPrefs[key])===String(option.value)?'active':''}" data-pref-option="${key}" data-value="${option.value}"><span><strong>${option.label}</strong>${option.copy?`<small>${option.copy}</small>`:''}</span><b>${String(state.settingsPrefs[key])===String(option.value)?'✓':''}</b></button>`).join('')}</div>`;
  }
  function toggleRow(icon,title,copy,key,value=state.settingsPrefs[key]){
    return `<button class="settings-row" data-pref-toggle="${key}"><span class="row-icon">${icon}</span><span class="row-copy"><strong>${title}</strong><small>${copy}</small></span><span class="toggle ${value?'on':''}"></span></button>`;
  }
  function applyPreferences(){
    document.documentElement.removeAttribute('data-font-size');
    document.documentElement.removeAttribute('data-high-contrast');
  }
  function showPanel(id,renderer,push=true){
    if(push&&currentPanel)panelStack.push(currentPanel);
    currentPanel={id,renderer};
    renderer();
  }
  function showRoot(type){
    panelStack=[];
    const renderer=()=>renderRoot(type);
    currentPanel={id:`root-${type}`,renderer};
    renderer();
  }
  function goBack(){
    if(panelStack.length){
      currentPanel=panelStack.pop();
      currentPanel.renderer();
      return true;
    }
    currentPanel=null;
    return false;
  }
  function sectionIntro(text){return `<p class="settings-intro">${text}</p>`;}

  function renderSources(){
    openSheet('RSS-források','Közvetlenül a készüléken',`<button class="primary-button" data-settings-action="add-source">＋ Új RSS-forrás</button><div class="settings-group" style="margin-top:13px">${Object.entries(state.sources).map(([name,on])=>`<button class="settings-row" data-source="${name}"><span class="row-icon">${name[0]}</span><span class="row-copy"><strong>${name}</strong><small>${on?'Bekapcsolva':'Kikapcsolva'}</small></span><span class="toggle ${on?'on':''}"></span></button>`).join('')}</div>`);
  }
  function renderTopics(){
    const chips=topicCatalog.map(topic=>`<button class="chip ${topic.id==='fresh'||state.enabledTopics.includes(topic.id)?'active':''}" data-settings-topic="${topic.id}">${topic.name}</button>`).join('');
    const rows=topicCatalog.map(topic=>{const active=topic.id==='fresh'||state.enabledTopics.includes(topic.id);return `<button class="settings-row ${topic.id==='fresh'?'fixed-topic':''}" data-settings-topic="${topic.id}"><span class="row-icon">${topic.name[0]}</span><span class="row-copy"><strong>${topic.name}</strong><small>${topic.description}</small></span><span class="toggle ${active?'on':''}"></span></button>`;}).join('');
    openSheet('Témák és érdeklődés','A hírfolyam és a keresés témái',`${sectionIntro('A felső témasor oldalra görgethető. Kapcsold ki azokat a témákat, amelyeket nem szeretnél látni.')}<div class="chips topic-strip topic-settings-strip">${chips}</div><div class="settings-group topic-settings-list">${rows}</div><div class="settings-group">${settingRow(['✦','Személyre szabott sorrend',state.settingsPrefs.personalized?'Bekapcsolva':'Kikapcsolva','personal'])}${settingRow(['↺','Érdeklődési profil törlése','A kedvelések megmaradnak','reset-profile'])}</div>`);
  }
  function renderNotifications(){
    openSheet('Értesítések','Riasztások és hírösszefoglaló',typeof notificationSettingsContent==='function'?notificationSettingsContent():sectionIntro('Az értesítési beállítások betöltése folyamatban van.'));
  }
  function renderAppearance(){
    openSheet('Megjelenés','Téma',`<div class="theme-grid"><button class="theme-card ${state.theme==='light'?'active':''}" data-theme="light">Világos</button><button class="theme-card dark-preview ${state.theme==='dark'?'active':''}" data-theme="dark">Sötét</button><button class="theme-card system-preview ${state.theme==='system'?'active':''}" data-theme="system">Rendszer</button></div>`);
  }
  function renderVoice(){
    openSheet('Hang és felolvasó','Felolvasás és viselkedés',`<div class="settings-group">${settingRow(['A','Felolvasóhang',state.settingsPrefs.voiceName,'voice-name'])}${settingRow(['↔','Beszédsebesség',`${state.settingsPrefs.speechRate.replace('.',',')}×`,'rate'])}<button class="settings-row" data-toggle-setting="autoNext"><span class="row-icon">⇥</span><span class="row-copy"><strong>Automatikus következő</strong><small>${state.autoNext?'Bekapcsolva':'Kikapcsolva'}</small></span><span class="toggle ${state.autoNext?'on':''}"></span></button></div>`);
  }
  function renderData(){
    openSheet('Mobiladat és tárhely','Hálózati beállítások',`<div class="settings-group"><button class="settings-row" data-toggle-setting="mobileData"><span class="row-icon">⇅</span><span class="row-copy"><strong>RSS-frissítés mobilneten</strong><small>${state.mobileData?'Engedélyezve':'Csak Wi-Fi'}</small></span><span class="toggle ${state.mobileData?'on':''}"></span></button>${settingRow(['▧','Képek mobilneten',state.settingsPrefs.imagesMobile?'Engedélyezve':'Csak Wi-Fi','images'])}${settingRow(['⌫','Gyorsítótár törlése','A kedvelések megmaradnak','cache'])}</div>`);
  }
  function renderLocation(){
    openSheet('Helyi hírek','Hozzávetőleges hely',`<div class="empty compact-empty"><div class="empty-icon">⌖</div><h2>${state.location?'Budapest környéke':'Helyi hírek a közeledből'}</h2><p>A végleges alkalmazás csak hozzávetőleges helyet használ, és engedély nélkül nem követi a tartózkodási helyedet.</p></div><button class="primary-button" data-toggle-setting="location">${state.location?'Helyi hírek kikapcsolása':'Budapest kiválasztása'}</button>`);
  }
  function renderAccount(){
    const linked=Object.values(state.settingsPrefs.linkedAccounts).filter(Boolean).length;
    openSheet('Fiók és biztonság','Profil és bejelentkezés',`<div class="settings-group">${settingRow(['♙','Profil',`${state.settingsPrefs.profileName} · ${state.settingsPrefs.profileEmail}`,'profile'])}${settingRow(['A','Kapcsolt fiókok',`${linked} szolgáltató kapcsolva`,'accounts'])}${settingRow(['✦','Kétlépcsős védelem',state.settingsPrefs.twoFactor?state.settingsPrefs.twoFactorMethod:'Nincs bekapcsolva','2fa'])}</div>`);
  }
  function renderPrototype(){
    openSheet('Prototípus','Fejlesztési beállítások',prototypeSettingsContent());
  }
  function renderRoot(type){
    if(type==='subscription')return subscriptionSheet();
    if(type==='sources')return renderSources();
    if(type==='topics')return renderTopics();
    if(type==='promotions')return renderPrototype();
    if(type==='notifications')return renderNotifications();
    if(type==='appearance')return renderAppearance();
    if(type==='voice')return renderVoice();
    if(type==='data')return renderData();
    if(type==='location')return renderLocation();
    if(type==='account')return renderAccount();
    if(type==='prototype')return renderPrototype();
  }

  function renderChild(type){
    if(type==='personal')return openSheet('Személyre szabott sorrend','Érdeklődés alapján',`${sectionIntro('A készüléken tárolt olvasási, hallgatási, kedvelési és megnyitási előzmények alapján rendezi előrébb a várhatóan érdekes híreket.')}<div class="settings-group">${toggleRow('✦','Személyre szabás',state.settingsPrefs.personalized?'Bekapcsolva':'Kikapcsolva','personalized')}</div>`);
    if(type==='reset-profile')return openSheet('Érdeklődési profil törlése','A kedvelt hírek megmaradnak',`<div class="confirm-panel"><span class="confirm-icon">↺</span><h2>Újrakezdjük a személyre szabást?</h2><p>Az olvasási és hallgatási előzményekből kialakított érdeklődési sorrend törlődik. A kedvelt híreid és RSS-forrásaid megmaradnak.</p></div><button class="primary-button danger-button" data-settings-action="confirm-reset-profile">Érdeklődési profil törlése</button>`);
    if(type==='voice-name')return openSheet('Felolvasóhang','Magyar hang kiválasztása',optionButtons('voiceName',[{value:'Magyar rendszerhang',label:'Magyar rendszerhang',copy:'A készülék alapértelmezett hangja'},{value:'Eszter',label:'Eszter',copy:'Női mintahang'},{value:'Tamás',label:'Tamás',copy:'Férfi mintahang'}]));
    if(type==='rate')return openSheet('Beszédsebesség','Felolvasás tempója',optionButtons('speechRate',[{value:'0.8',label:'0,8×',copy:'Lassabb'},{value:'1.0',label:'1,0×',copy:'Normál'},{value:'1.2',label:'1,2×',copy:'Gyorsabb'},{value:'1.5',label:'1,5×',copy:'Nagyon gyors'}]));
    if(type==='images')return openSheet('Képek mobilneten','Adatforgalom szabályozása',`<div class="settings-group">${toggleRow('▧','Hírképek letöltése',state.settingsPrefs.imagesMobile?'Mobilneten is':'Csak Wi-Fi-n','imagesMobile')}</div>${sectionIntro('Kikapcsolva mobilhálózaton csak a címek és a szöveges hírelőzetesek töltődnek le.')}`);
    if(type==='cache')return openSheet('Gyorsítótár törlése','Ideiglenes fájlok',`<div class="confirm-panel"><span class="confirm-icon">⌫</span><h2>Tárhely felszabadítása</h2><p>Az ideiglenesen letöltött képek és fájlok törlődnek. A kedvelt hírek, beállítások és előzmények megmaradnak.</p></div><button class="primary-button" data-settings-action="clear-cache">Gyorsítótár törlése</button>`);
    if(type==='profile')return openSheet('Profil','Személyes adatok',`<form id="profileSettingsForm" class="settings-form"><label>Név<input name="profileName" value="${state.settingsPrefs.profileName}" required></label><label>E-mail<input name="profileEmail" type="email" value="${state.settingsPrefs.profileEmail}" required></label><button class="primary-button" type="submit">Módosítások mentése</button></form>`);
    if(type==='accounts')return openSheet('Kapcsolt fiókok','Bejelentkezési lehetőségek',`<div class="settings-group">${Object.entries(state.settingsPrefs.linkedAccounts).map(([name,on])=>`<button class="settings-row" data-linked-account="${name}"><span class="row-icon">${name[0]}</span><span class="row-copy"><strong>${name}</strong><small>${on?'Kapcsolva':'Nincs kapcsolva'}</small></span><span class="toggle ${on?'on':''}"></span></button>`).join('')}</div>`);
    if(type==='2fa')return openSheet('Kétlépcsős védelem','Fiókbiztonság',`<div class="settings-group">${toggleRow('✦','Kétlépcsős azonosítás',state.settingsPrefs.twoFactor?'Bekapcsolva':'Kikapcsolva','twoFactor')}</div><h3 class="section-label">Ellenőrzés módja</h3>${optionButtons('twoFactorMethod',[{value:'E-mail',label:'Kód e-mailben'}])}`);
    if(type==='device-session')return deviceSessionSimulationSheet();
    if(type==='reset-app')return openSheet('Prototípusadatok törlése','Visszaállítás alaphelyzetbe',`<div class="confirm-panel"><span class="confirm-icon">!</span><h2>Minden helyi adat törlődik</h2><p>Ez csak a prototípusban tárolt beállításokat, olvasási előzményeket és kedveléseket érinti.</p></div><button class="primary-button danger-button" data-settings-action="confirm-reset-app">Minden prototípusadat törlése</button>`);
  }

  settingsSheet=function(type){showRoot(type);};

  document.addEventListener('click',event=>{
    const back=event.target.closest('#sheetBack');
    if(back&&sheet.classList.contains('open')&&panelStack.length){
      event.preventDefault();event.stopImmediatePropagation();goBack();return;
    }
    const child=event.target.closest('#sheetBody [data-setting]');
    if(child&&['personal','reset-profile','voice-name','rate','images','cache','profile','accounts','2fa','device-session','reset-app'].includes(child.dataset.setting)){
      event.preventDefault();event.stopImmediatePropagation();
      const type=child.dataset.setting;
      showPanel(type,()=>renderChild(type));
      return;
    }
    const action=event.target.closest('[data-settings-action]');
    if(action){
      event.preventDefault();event.stopImmediatePropagation();
      const type=action.dataset.settingsAction;
      if(type==='add-source')showPanel('add-source',()=>openSheet('Új RSS-forrás','Ajánlásból vagy RSS-linkkel',`<section><h3 class="section-label">Ajánlott magyar források</h3><div class="settings-group">${['444','G7','Hírstart','Index','Népszava'].map(name=>`<button class="settings-row" data-settings-recommended="${name}"><span class="row-icon">${name[0]}</span><span class="row-copy"><strong>${name}</strong><small>Ellenőrzött RSS-ajánlás</small></span><span class="row-end">＋</span></button>`).join('')}</div><h3 class="section-label">Hozzáadás RSS-linkkel</h3><form id="rssSettingsForm" class="source-form"><label for="rssSettingsUrl">RSS-csatorna címe</label><input id="rssSettingsUrl" class="search-input" type="url" inputmode="url" placeholder="https://pelda.hu/rss" required><button class="primary-button" type="submit">RSS-forrás hozzáadása</button></form></section>`));
      if(type==='confirm-reset-profile'){state.history=[];state.read=new Set();state.category='fresh';state.enabledTopics=topicCatalog.map(topic=>topic.id);state.settingsPrefs.personalized=true;saveState();toast('Az érdeklődési profil törölve');goBack();}
      if(type==='clear-cache'){if('caches'in window)caches.keys().then(keys=>Promise.all(keys.map(key=>caches.delete(key))));toast('A gyorsítótár törölve');goBack();}
      if(type==='confirm-reset-app'){
        if(typeof window.hirbeszedResetToFirstLaunch==='function')window.hirbeszedResetToFirstLaunch(500);
        else{localStorage.removeItem('hirbeszed-state');toast('A prototípusadatok törölve');setTimeout(()=>location.reload(),500);}
      }
      return;
    }
    const recommended=event.target.closest('[data-settings-recommended]');
    if(recommended){event.preventDefault();event.stopImmediatePropagation();const name=recommended.dataset.settingsRecommended;state.sources[name]=true;saveState();toast(`${name} hozzáadva`);goBack();return;}
    const topic=event.target.closest('[data-settings-topic]');
    if(topic){event.preventDefault();event.stopImmediatePropagation();const id=topic.dataset.settingsTopic;if(id==='fresh'){toast('A Friss összesítő mindig elérhető');return;}state.enabledTopics=state.enabledTopics.includes(id)?state.enabledTopics.filter(item=>item!==id):[...state.enabledTopics,id];if(state.category===id&&!state.enabledTopics.includes(id))state.category='fresh';saveState();renderTopics();return;}
    const rootToggle=event.target.closest('[data-toggle-setting]');
    if(rootToggle){
      event.preventDefault();event.stopImmediatePropagation();
      const key=rootToggle.dataset.toggleSetting;
      state[key]=!state[key];
      saveState();
      showRoot(key==='autoNext'?'voice':key==='mobileData'?'data':key==='location'?'location':['promoFeedPriority','prototypeImmediateSubscriptionChange','prototypeReaderTrialAvailable','prototypeAutoFillData'].includes(key)?'prototype':'notifications');
      return;
    }
    const prefToggle=event.target.closest('[data-pref-toggle]');
    if(prefToggle){event.preventDefault();event.stopImmediatePropagation();const key=prefToggle.dataset.prefToggle;state.settingsPrefs[key]=!state.settingsPrefs[key];saveState();applyPreferences();renderChild(currentPanel.id);return;}
    const prefOption=event.target.closest('[data-pref-option]');
    if(prefOption){event.preventDefault();event.stopImmediatePropagation();const key=prefOption.dataset.prefOption;state.settingsPrefs[key]=prefOption.dataset.value;saveState();applyPreferences();renderChild(currentPanel.id);return;}
    const linked=event.target.closest('[data-linked-account]');
    if(linked){event.preventDefault();event.stopImmediatePropagation();const name=linked.dataset.linkedAccount;state.settingsPrefs.linkedAccounts[name]=!state.settingsPrefs.linkedAccounts[name];saveState();renderChild('accounts');return;}
    const subAction=event.target.closest('[data-sub-action]');
    if(subAction){
      const actionName=subAction.dataset.subAction;
      if(actionName==='plans'){event.preventDefault();event.stopImmediatePropagation();if(currentPanel?.id==='subscription-confirm')goBack();else showPanel('subscription-plans',()=>subscriptionSheet('plans'));return;}
      if(actionName==='review'){event.preventDefault();event.stopImmediatePropagation();showPanel('subscription-confirm',()=>subscriptionSheet('confirm'));return;}
      if(actionName==='usage'){event.preventDefault();event.stopImmediatePropagation();showPanel('subscription-usage',()=>usageSheet());return;}
      if(actionName==='subscription-home'){event.preventDefault();event.stopImmediatePropagation();showRoot('subscription');return;}
    }
  },true);

  document.addEventListener('submit',event=>{
    if(event.target.id==='rssSettingsForm'){
      event.preventDefault();event.stopImmediatePropagation();
      const input=document.querySelector('#rssSettingsUrl');
      try{const url=new URL(input.value.trim());const name=url.hostname.replace(/^www\./,'');state.sources[name]=true;saveState();toast(`${name} hozzáadva`);goBack();}catch{toast('Adj meg egy érvényes RSS-linket');}
    }
    if(event.target.id==='profileSettingsForm'){
      event.preventDefault();event.stopImmediatePropagation();
      const name=event.target.elements.profileName.value.trim();
      const email=event.target.elements.profileEmail.value.trim();
      if(name&&email){state.settingsPrefs.profileName=name;state.settingsPrefs.profileEmail=email;saveState();toast('A profil mentve');goBack();}
    }
  },true);

  applyPreferences();
  saveState();
})();
