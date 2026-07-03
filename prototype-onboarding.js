(function(){
  if(window.__hirbeszedOnboardingLoaded)return;
  window.__hirbeszedOnboardingLoaded=true;

  const STORE='hirbeszed-state';
  const LAUNCH='hirbeszed-default-launch';

  function ensureOnboardingStyle(){
    if(document.getElementById('prototypeOnboardingStyle'))return;
    const style=document.createElement('style');
    style.id='prototypeOnboardingStyle';
    style.textContent=`
      .welcome-card{
        background:radial-gradient(circle at 18% 10%,rgba(242,91,69,.34),transparent 27%),linear-gradient(145deg,#061216 0%,#0D242B 54%,#153841 100%)!important;
        color:#F6FBFA!important;
        border:1px solid rgba(246,251,250,.12)!important;
        box-shadow:0 22px 52px rgba(0,0,0,.32)!important;
      }
      .welcome-card h1,.welcome-card p{color:#F6FBFA!important;text-shadow:0 1px 12px rgba(0,0,0,.18)}
      .welcome-card .welcome-brand{
        width:max-content;max-width:100%;margin:0 auto 18px!important;padding:8px 12px;border-radius:999px;
        background:rgba(6,18,22,.62);border:1px solid rgba(246,251,250,.12)
      }
      .welcome-card .welcome-features{justify-content:center}
      .welcome-card .welcome-features span{background:rgba(246,251,250,.10)!important;color:#F6FBFA!important;border-color:rgba(246,251,250,.15)!important}
      .provider-list,.auth-actions{display:flex!important;flex-direction:column!important;align-items:center!important;gap:10px!important}
      .auth-social,.auth-screen .primary-button,.auth-screen .secondary-button,.auth-screen .text-button{
        width:min(292px,100%)!important;max-width:292px!important;margin-left:auto!important;margin-right:auto!important;
      }
      .auth-social{text-align:center!important;justify-content:center!important}
      .plan-hero{
        padding:22px 18px 18px;border-radius:28px;text-align:center;color:#F6FBFA;
        background:radial-gradient(circle at 84% 5%,rgba(242,91,69,.28),transparent 28%),linear-gradient(145deg,#061216,#0D242B 58%,#143640);
        border:1px solid rgba(246,251,250,.12);box-shadow:0 18px 48px rgba(0,0,0,.25);margin-bottom:14px;
      }
      .plan-hero .welcome-brand{
        width:max-content;max-width:100%;margin:0 auto 14px;padding:8px 12px;border-radius:999px;
        background:rgba(246,251,250,.08);border:1px solid rgba(246,251,250,.12)
      }
      .plan-hero h1{font-size:clamp(1.45rem,6vw,2rem);line-height:1.04;margin:8px 0 8px;color:#F6FBFA}
      .plan-hero p{margin:0;color:rgba(246,251,250,.78);line-height:1.45}
      .plan-list-v4{display:grid;gap:10px;margin:14px 0}
      .plan-choice{
        width:100%;border:1px solid rgba(92,199,189,.18);border-radius:21px;background:var(--surface-2,#10262C);
        color:var(--text,#F4F8F7);padding:15px 14px;display:grid;grid-template-columns:28px 1fr auto;gap:11px;align-items:center;text-align:left;
      }
      .plan-choice.selected{border-color:rgba(242,91,69,.86);box-shadow:0 0 0 2px rgba(242,91,69,.14);background:linear-gradient(135deg,rgba(242,91,69,.12),rgba(92,199,189,.08))}
      .choice-dot{width:24px;height:24px;border-radius:999px;border:1px solid rgba(246,251,250,.22);display:grid;place-items:center;color:#F25B45;font-weight:900}
      .plan-choice.selected .choice-dot{background:#F25B45;color:white;border-color:#F25B45}
      .choice-copy{display:grid;gap:4px}
      .choice-copy em{font-style:normal;font-size:.66rem;letter-spacing:.1em;color:#F25B45;font-weight:900}
      .choice-copy strong{font-size:.98rem}
      .choice-copy small{line-height:1.35;color:var(--muted,#A8B7B6)}
      .choice-price{font-size:.82rem;white-space:nowrap;color:var(--text,#F4F8F7)}
      .plan-note-box{border:1px solid rgba(92,199,189,.16);border-radius:18px;background:rgba(92,199,189,.08);padding:12px 14px;color:var(--muted,#A8B7B6);line-height:1.45;font-size:.9rem;margin-bottom:14px}
      .onboarding-source-intro{
        border:1px solid rgba(92,199,189,.16);border-radius:20px;background:rgba(92,199,189,.08);
        padding:14px;margin:0 0 13px;color:var(--muted,#A8B7B6);line-height:1.45;font-size:.9rem;
      }
      .onboarding-source-intro strong{display:block;color:var(--text,#F4F8F7);font-size:1rem;margin-bottom:4px}
      .onboarding-source-actions{position:sticky;bottom:0;display:grid;gap:9px;margin-top:13px;padding-top:12px;background:linear-gradient(180deg,transparent,var(--surface,#10262C) 22%)}
    `;
    document.head.appendChild(style);
  }

  function liveState(){
    try{
      if(typeof state!=='undefined'&&state)return state;
    }catch(_){}
    return null;
  }

  function storedState(){
    try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{};}catch(_){return {};}
  }

  function persist(partial){
    const live=liveState();
    if(live){
      if(partial.auth)live.auth=partial.auth;
      if(partial.onboarding)live.onboarding=partial.onboarding;
      if(partial.subscription)live.subscription=partial.subscription;
      if(partial.route)live.route=partial.route;
      if(typeof partial.playing==='boolean')live.playing=partial.playing;
      if(typeof partial.autoNext==='boolean')live.autoNext=partial.autoNext;
      if(typeof partial.mic==='boolean')live.mic=partial.mic;
      try{if(typeof saveState==='function')saveState();}catch(_){}
      return live;
    }
    const current=storedState();
    const next={...current,...partial};
    localStorage.setItem(STORE,JSON.stringify(next));
    return next;
  }

  function notify(message){
    try{if(typeof toast==='function'){toast(message);return;}}catch(_){}
    const el=document.getElementById('toast');
    if(el){el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1800);}
  }

  function packageHomeRoute(subscription){
    try{
      if(typeof subscriptionHomeRoute==='function')return subscriptionHomeRoute(subscription);
    }catch(_){}
    const sub=subscription||{};
    if(sub.status==='active'&&sub.plan==='assistant')return 'assistant';
    if((sub.status==='active'||sub.status==='trial')&&sub.plan==='reader')return 'car';
    return 'feed';
  }

  function setOnboardingLayout(active){
    const phone=document.getElementById('phone');
    phone?.classList.remove('startup-locked');
    phone?.classList.toggle('onboarding-active',!!active);
    document.documentElement.classList.remove('startup-locked');
    document.documentElement.classList.toggle('onboarding-active',!!active);
  }

  function closeOnboardingSheet(){
    const activeSheet=document.getElementById('sheet');
    const body=document.getElementById('sheetBody');
    if(body)body.scrollTop=0;
    activeSheet?.classList.remove('open');
    activeSheet?.setAttribute('aria-hidden','true');
  }

  function privacyAccepted(){
    const box=document.getElementById('privacyAccepted');
    if(box&&!box.checked){
      notify('Az adatvédelmi tájékoztatót el kell fogadni');
      box.closest('.privacy-check')?.classList.add('pulse');
      setTimeout(()=>box.closest('.privacy-check')?.classList.remove('pulse'),600);
      return false;
    }
    return true;
  }

  function setAuth(provider){
    const live=liveState();
    const current=live||storedState();
    const regName=document.getElementById('authRegName')?.value?.trim();
    const regEmail=document.getElementById('authRegEmail')?.value?.trim();
    const regPhone=document.getElementById('authRegPhone')?.value?.trim();
    const loginId=document.getElementById('authLoginId')?.value?.trim();
    const auth={
      ...(current.auth||{}),
      loggedIn:true,
      name:regName||current.auth?.name||'Hírbeszéd felhasználó',
      email:regEmail||(loginId&&loginId.includes('@')?loginId:current.auth?.email)||'',
      phone:regPhone||(loginId&&!loginId.includes('@')?loginId:current.auth?.phone)||'',
      provider,
      twoFactor:provider==='Email / telefon'
    };
    const onboarding={...(current.onboarding||{}),required:true,introSeen:true,authDone:true,privacyAccepted:true};
    persist({auth,onboarding});
  }

  function twoFactorSheet(){
    ensureOnboardingStyle();
    if(typeof openSheet!=='function')return;
    openSheet('Kétlépcsős azonosítás','Regisztráció megerősítése',`
      <section class="auth-screen">
        <div class="auth-hero">
          <span class="auth-badge">✦</span>
          <div class="auth-kicker">BIZTONSÁGI KÓD</div>
          <h1>Írd be a 6 jegyű kódot.</h1>
          <p>A prototípusban bármilyen kód elfogadott. A végleges appban SMS-ben vagy emailben érkezne.</p>
        </div>
        <div class="auth-form">
          <label for="authCode">Ellenőrző kód</label>
          <input id="authCode" class="auth-code" inputmode="numeric" maxlength="6" placeholder="123456">
        </div>
        <button class="primary-button coral-button" data-auth-action="complete-2fa">Megerősítés</button>
      </section>
    `);
  }

  function escapeHtml(value){
    return String(value).replace(/[&<>"']/g,character=>({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      '"':'&quot;',
      "'":'&#39;'
    }[character]));
  }

  function sourceCount(sources){
    return Object.values(sources||{}).filter(Boolean).length;
  }

  function saveLiveState(){
    try{if(typeof saveState==='function')saveState();else localStorage.setItem(STORE,JSON.stringify(liveState()||storedState()));}catch(_){}
  }

  function sourceRowsHtml(){
    const live=liveState()||storedState();
    return Object.entries(live.sources||{}).map(([name,on])=>{
      const safeName=escapeHtml(name);
      return `<button class="settings-row" data-onboarding-source="${encodeURIComponent(name)}"><span class="row-icon">${safeName.charAt(0)}</span><span class="row-copy"><strong>${safeName}</strong><small>${on?'Bekapcsolva':'Kikapcsolva'}</small></span><span class="toggle ${on?'on':''}"></span></button>`;
    }).join('');
  }

  function showOnboardingSources(){
    ensureOnboardingStyle();
    setOnboardingLayout(true);
    const live=liveState()||storedState();
    const count=sourceCount(live.sources);
    if(typeof openSheet!=='function')return;
    openSheet('RSS-források beállítása','Mielőtt elindul a felolvasás',`
      <section class="onboarding-sources-screen">
        <div class="onboarding-source-intro">
          <strong>Válaszd ki, honnan olvassuk fel a híreket.</strong>
          Ezekből a forrásokból épül fel a hírfolyam és a Felolvasó első felolvasása. Legalább egy RSS-forrás maradjon bekapcsolva.
        </div>
        <button class="primary-button" data-onboarding-add-source>＋ Új RSS-forrás</button>
        <div class="settings-group" style="margin-top:13px">${sourceRowsHtml()}</div>
        <div class="onboarding-source-actions">
          <button class="primary-button coral-button" data-onboarding-sources-done>${count} forrás mentése és felolvasás indítása</button>
        </div>
      </section>
    `);
  }

  function showOnboardingAddSource(){
    ensureOnboardingStyle();
    setOnboardingLayout(true);
    if(typeof openSheet!=='function')return;
    const recommendations=['444','G7','Hírstart','Index','Népszava'];
    openSheet('Új RSS-forrás','Ajánlásból vagy RSS-linkkel',`
      <section class="onboarding-source-add-screen">
        <h3 class="section-label">Ajánlott magyar források</h3>
        <div class="settings-group">${recommendations.map(name=>`<button class="settings-row" data-onboarding-recommended="${encodeURIComponent(name)}"><span class="row-icon">${escapeHtml(name.charAt(0))}</span><span class="row-copy"><strong>${escapeHtml(name)}</strong><small>Ellenőrzött RSS-ajánlás</small></span><span class="row-end">＋</span></button>`).join('')}</div>
        <h3 class="section-label">Hozzáadás RSS-linkkel</h3>
        <form id="onboardingRssForm" class="source-form">
          <label for="onboardingRssUrl">RSS-csatorna címe</label>
          <input id="onboardingRssUrl" class="search-input" type="url" inputmode="url" placeholder="https://pelda.hu/rss" required>
          <button class="primary-button" type="submit">RSS-forrás hozzáadása</button>
        </form>
        <button class="text-button" data-onboarding-sources-back>Vissza az RSS-forrásokhoz</button>
      </section>
    `);
  }

  function finishOnboardingToCar(){
    const live=liveState()||storedState();
    if(sourceCount(live.sources)<1){
      notify('Legalább egy RSS-forrást válassz ki');
      return;
    }
    live.onboarding={
      ...(live.onboarding||{}),
      required:false,
      introSeen:true,
      authDone:true,
      subscriptionDone:true,
      rssDone:true,
      privacyAccepted:true,
      completed:true
    };
    const targetRoute=packageHomeRoute(live.subscription);
    live.route=targetRoute;
    live.mic=true;
    live.autoNext=true;
    live.playing=false;
    saveLiveState();
    try{sessionStorage.removeItem(LAUNCH);}catch(_){}
    setOnboardingLayout(false);
    closeOnboardingSheet();
    requestAnimationFrame(()=>{
      try{if(typeof render==='function')render();}catch(_){}
      if(targetRoute==='feed')return;
      requestAnimationFrame(()=>{
        try{
          if(targetRoute==='assistant'&&typeof activateRouteAudio==='function')activateRouteAudio('assistant');
          else if(typeof speakCurrent==='function')speakCurrent();
          else if(live){live.playing=true;saveLiveState();if(typeof renderCar==='function')renderCar();}
        }catch(_){
          if(targetRoute==='car'){
            live.playing=true;
            saveLiveState();
            try{if(typeof renderCar==='function')renderCar();}catch(__){}
          }
        }
      });
    });
    setTimeout(()=>{
      const current=liveState();
      if(current?.route==='car'&&!current.playing&&!current.onboarding?.required){
        current.playing=true;
        saveLiveState();
        try{if(typeof renderCar==='function')renderCar();}catch(_){}
      }
    },120);
    notify(targetRoute==='feed'?'RSS-források mentve, indul a hírfolyam':targetRoute==='assistant'?'RSS-források mentve, indul az Asszisztens':'RSS-források mentve, indul a felolvasás');
  }

  function showPlans(){
    ensureOnboardingStyle();
    if((liveState()||storedState()).onboarding?.required)setOnboardingLayout(true);
    if(typeof subscriptionSheet==='function'){
      subscriptionSheet('onboarding','free','onboarding');
      return;
    }
    notify('A csomagválasztó oldal nem érhető el');
  }

  function showPlanChange(){
    ensureOnboardingStyle();
    if(typeof subscriptionSheet==='function')subscriptionSheet('overview','','menu');
  }

  function normalizeOnboardingPlan(plan){
    if(plan==='basic')return 'reader';
    if(plan==='pro')return 'assistant';
    return ['free','reader','assistant'].includes(plan)?plan:'reader';
  }

  function applyOnboardingSubscription(live,plan,status='active'){
    const normalized=normalizeOnboardingPlan(plan);
    live.subscription={
      ...(live.subscription||{}),
      status,
      plan:normalized,
      trialDays:status==='trial'&&normalized==='reader'?14:0,
      activeDaysLeft:status==='active'&&normalized!=='free'?30:0,
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
      promoInterval:20
    };
    delete live.subscription.proPreviewAvailable;
    delete live.subscription.proPreviewRemaining;
    delete live.subscription.proPreviewActive;
    return normalized;
  }

  function redrawSubscription(screen){
    patchSubscriptionState();
    try{
      if(typeof renderSubscriptionGate==='function')renderSubscriptionGate();
      if(typeof subscriptionSheet==='function')subscriptionSheet(screen);
    }catch(_){}
    setTimeout(patchSubscriptionState,0);
  }

  function handleSubscriptionAction(action){
    const live=liveState();
    if(!live?.subscription)return false;
    if(action==='review'){
      try{if(typeof subscriptionSheet==='function')subscriptionSheet('confirm');}catch(_){}
      return true;
    }
    if(action==='plans'){
      if(live.subscription.status&&live.subscription.status!=='inactive'){
        showPlanChange();
      }else{
        try{if(typeof subscriptionSheet==='function')subscriptionSheet('plans');}catch(_){}
      }
      setTimeout(patchSubscriptionState,0);
      return true;
    }
    if(action==='usage'){
      try{if(typeof usageSheet==='function')usageSheet();}catch(_){}
      setTimeout(patchSubscriptionState,0);
      return true;
    }
    if(action==='subscription-home'){
      redrawSubscription();
      return true;
    }
    return false;
  }

  function normalizeText(root=document.body){
    if(!root)return;
    root.querySelectorAll('button,.settings-row,.plan-card,.usage-panel,.auth-screen').forEach(el=>{
      if(el.childElementCount===0){
        el.textContent=el.textContent.replace(/^\s*/,'');
      }
    });
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      const next=node.nodeValue.replace(/\s*(Apple)/g,'$1');
      if(next!==node.nodeValue)node.nodeValue=next;
    });
  }

  function patchSubscriptionState(){
    const clean=subscription=>{
      if(!subscription)return false;
      let changed=false;
      if(subscription.plan==='basic'){subscription.plan='reader';changed=true;}
      if(subscription.plan==='pro'){subscription.plan='assistant';changed=true;}
      if(!['free','reader','assistant'].includes(subscription.plan)){subscription.plan='reader';changed=true;}
      if(subscription.aiMinutesUsed!==0){subscription.aiMinutesUsed=0;changed=true;}
      if(subscription.aiMinutesLimit!==0){subscription.aiMinutesLimit=0;changed=true;}
      ['proPreviewAvailable','proPreviewRemaining','proPreviewActive'].forEach(key=>{
        if(key in subscription){delete subscription[key];changed=true;}
      });
      subscription.promoInterval=Math.max(8,Number(subscription.promoInterval)||20);
      subscription.assistantTrialAvailable=subscription.assistantTrialAvailable!==false;
      subscription.assistantTrialPromptAttempts=Math.max(0,Number(subscription.assistantTrialPromptAttempts)||0);
      subscription.readerArticlesSinceAssistantOffer=Math.max(0,Number(subscription.readerArticlesSinceAssistantOffer)||0);
      return changed;
    };
    const live=liveState();
    if(clean(live?.subscription))saveLiveState();
    const stored=storedState();
    if(clean(stored.subscription)){
      localStorage.setItem(STORE,JSON.stringify(stored));
    }
    normalizeText();
  }

  function maybeReplaceOldPlans(){
    const sheet=document.getElementById('sheet');
    if(!sheet?.classList.contains('open'))return;
    if(document.querySelector('.plan-list-v4'))return;
    const title=document.getElementById('sheetTitle')?.textContent||'';
    const body=document.getElementById('sheetBody');
    if(!body)return;
    const subscriptionStatus=(liveState()||storedState()).subscription?.status||'inactive';
    const isManagingSubscription=subscriptionStatus!=='inactive';
    if(!isManagingSubscription&&/előfizetés|csomag/i.test(title)&&/próba|hó|Ft/.test(body.textContent)){
      showPlans();
    }
  }

  document.addEventListener('click',event=>{
    const subscriptionAction=event.target.closest('[data-sub-action]');
    if(subscriptionAction&&handleSubscriptionAction(subscriptionAction.dataset.subAction)){
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    const onboardingSource=event.target.closest('[data-onboarding-source]');
    if(onboardingSource){
      event.preventDefault();
      event.stopImmediatePropagation();
      const live=liveState()||storedState();
      const name=decodeURIComponent(onboardingSource.dataset.onboardingSource||'');
      if(!name||!live.sources)return;
      if(live.sources[name]&&sourceCount(live.sources)<=1){
        notify('Legalább egy RSS-forrás maradjon bekapcsolva');
        return;
      }
      live.sources[name]=!live.sources[name];
      saveLiveState();
      showOnboardingSources();
      return;
    }

    const onboardingAdd=event.target.closest('[data-onboarding-add-source]');
    if(onboardingAdd){
      event.preventDefault();
      event.stopImmediatePropagation();
      showOnboardingAddSource();
      return;
    }

    const onboardingRecommended=event.target.closest('[data-onboarding-recommended]');
    if(onboardingRecommended){
      event.preventDefault();
      event.stopImmediatePropagation();
      const live=liveState()||storedState();
      const name=decodeURIComponent(onboardingRecommended.dataset.onboardingRecommended||'');
      if(name){
        live.sources={...(live.sources||{}),[name]:true};
        saveLiveState();
        notify(`${name} hozzáadva`);
      }
      showOnboardingSources();
      return;
    }

    if(event.target.closest('[data-onboarding-sources-back]')){
      event.preventDefault();
      event.stopImmediatePropagation();
      showOnboardingSources();
      return;
    }

    if(event.target.closest('[data-onboarding-sources-done]')){
      event.preventDefault();
      event.stopImmediatePropagation();
      finishOnboardingToCar();
      return;
    }

    const closeOnboardingSources=event.target.closest('#sheetBack,[data-action="close-sheet"]');
    if(closeOnboardingSources&&document.querySelector('.onboarding-sources-screen,.onboarding-source-add-screen')){
      event.preventDefault();
      event.stopImmediatePropagation();
      if(document.querySelector('.onboarding-source-add-screen'))showOnboardingSources();
      else notify('Előbb válaszd ki az RSS-forrásokat');
      return;
    }

    const authAction=event.target.closest('[data-auth-action]');
    if(authAction){
      const action=authAction.dataset.authAction;
      if(action==='social-apple'||action==='social-facebook'||action==='social-google'){
        event.preventDefault();
        event.stopImmediatePropagation();
        if(!privacyAccepted())return;
        setAuth(action==='social-apple'?'Apple':action==='social-facebook'?'Facebook':'Google');
        showPlans();
        return;
      }
      if(action==='start-login'){
        event.preventDefault();
        event.stopImmediatePropagation();
        if(!privacyAccepted())return;
        setAuth('Email / telefon');
        showPlans();
        return;
      }
      if(action==='start-register'){
        event.preventDefault();
        event.stopImmediatePropagation();
        if(!privacyAccepted())return;
        setAuth('Email / telefon');
        twoFactorSheet();
        return;
      }
      if(action==='complete-2fa'){
        event.preventDefault();
        event.stopImmediatePropagation();
        setAuth('Email / telefon');
        showPlans();
      }
    }
  },true);

  document.addEventListener('submit',event=>{
    if(event.target.id==='onboardingRssForm'){
      event.preventDefault();
      event.stopImmediatePropagation();
      const input=document.getElementById('onboardingRssUrl');
      const live=liveState()||storedState();
      try{
        const url=new URL(input.value.trim());
        const name=url.hostname.replace(/^www\./,'');
        live.sources={...(live.sources||{}),[name]:true};
        saveLiveState();
        notify(`${name} hozzáadva`);
        showOnboardingSources();
      }catch(_){
        notify('Adj meg egy érvényes RSS-linket');
      }
    }
  },true);

  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    if(document.querySelector('.onboarding-sources-screen,.onboarding-source-add-screen')){
      event.preventDefault();
      event.stopImmediatePropagation();
      if(document.querySelector('.onboarding-source-add-screen'))showOnboardingSources();
      else notify('Előbb válaszd ki az RSS-forrásokat');
    }
  },true);

  document.addEventListener('click',event=>{
    if(event.target.closest('[data-sub-action],.subscription-center [data-plan]')){
      setTimeout(patchSubscriptionState,0);
      setTimeout(patchSubscriptionState,80);
    }
  });

  let onboardingSyncScheduled=false;
  function runOnboardingSync(){
    onboardingSyncScheduled=false;
    ensureOnboardingStyle();
    normalizeText(document.getElementById('sheet')||document.body);
    maybeReplaceOldPlans();
  }

  const observer=new MutationObserver(()=>{
    if(onboardingSyncScheduled)return;
    onboardingSyncScheduled=true;
    requestAnimationFrame(runOnboardingSync);
  });

  window.hirbeszedShowOnboardingSources=showOnboardingSources;
  window.hirbeszedSetOnboardingLayout=setOnboardingLayout;

  function boot(){
    ensureOnboardingStyle();
    normalizeText();
    patchSubscriptionState();
    observer.observe(document.body,{subtree:true,childList:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
