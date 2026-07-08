(function(){
  if(window.__hirbeszedAuthLoaded&&window.__hirbeszedAuthValidationVersion==='release-v2.1-v317')return;
  window.__hirbeszedAuthLoaded=true;
  window.__hirbeszedAuthValidationVersion='release-v2.1-v317';

  const STORE='hirbeszed-state';
  const LAUNCH='hirbeszed-default-launch';
  const PROTOTYPE_AUTH_CODE='123456';
  const PROTOTYPE_EXPIRED_CODE='000000';
  const CODE_MAX_ATTEMPTS=3;
  const CODE_RESEND_COOLDOWN_MS=15000;
  const CODE_EXPIRES_MS=5*60*1000;
  const PROTOTYPE_LOGIN_EMAIL='teszt.prototipus@example.com';
  const PROTOTYPE_LOGIN_PASSWORD='Hirbeszed1!';
  const PROTOTYPE_UNVERIFIED_EMAIL='nincs.megerositve@example.com';
  const PROTOTYPE_LOCKED_EMAIL='zarolt.fiok@example.com';
  const PROTOTYPE_SERVER_ERROR_EMAIL='szerverhiba@example.com';
  const LOGIN_MAX_ATTEMPTS=3;
  const LOGIN_LOCK_MS=15000;
  const PASSWORD_RESET_COOLDOWN_MS=15000;

  function ensureAuthStyle(){
    let style=document.getElementById('prototypeAuthStyle');
    if(!style){
      style=document.createElement('style');
      style.id='prototypeAuthStyle';
      document.head.appendChild(style);
    }
    style.textContent=`
      .auth-screen{display:flex;flex-direction:column;gap:13px}
      .welcome-screen{display:flex;flex-direction:column;gap:14px}
      .welcome-card{position:relative;overflow:hidden;border:1px solid color-mix(in srgb,var(--coral) 42%,var(--border));border-radius:30px;padding:23px 18px 18px;background:radial-gradient(circle at 20% 5%,color-mix(in srgb,var(--coral) 22%,transparent),transparent 34%),linear-gradient(145deg,var(--primary),color-mix(in srgb,var(--primary) 72%,var(--accent)));color:#fff;box-shadow:var(--shadow)}
      .welcome-card:after{content:"";position:absolute;right:-45px;bottom:-55px;width:170px;height:170px;border-radius:50%;border:30px solid rgba(255,255,255,.08)}
      .welcome-brand{display:flex;align-items:center;gap:12px;position:relative;z-index:1}
      .welcome-brand img{width:46px;height:46px;filter:drop-shadow(0 8px 18px rgba(0,0,0,.18))}
      .welcome-wordmark{font-size:24px;font-weight:900;letter-spacing:-.8px}
      .welcome-wordmark span{color:#FF755F}
      .welcome-card h1{position:relative;z-index:1;font-size:27px;line-height:31px;letter-spacing:-.7px;margin:23px 0 9px}
      .welcome-card p{position:relative;z-index:1;font-size:12px;line-height:18px;color:rgba(255,255,255,.76);margin:0}
      .welcome-features{position:relative;z-index:1;display:flex;flex-wrap:wrap;gap:7px;margin-top:16px}
      .welcome-features span{border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.1);border-radius:999px;padding:7px 9px;font-size:9px;font-weight:850}
      .welcome-wave{position:relative;z-index:1;display:flex;gap:5px;align-items:end;height:34px;margin-top:16px}
      .welcome-wave i{display:block;width:6px;border-radius:999px;background:#72C8BC}
      .welcome-wave i:nth-child(2),.welcome-wave i:nth-child(5){height:28px;background:#FF755F}
      .welcome-wave i:nth-child(1),.welcome-wave i:nth-child(7){height:12px}
      .welcome-wave i:nth-child(3),.welcome-wave i:nth-child(6){height:22px}
      .welcome-wave i:nth-child(4){height:34px}
      .auth-hero{padding:20px 16px;border:1px solid color-mix(in srgb,var(--coral) 35%,var(--border));border-radius:24px;background:linear-gradient(145deg,color-mix(in srgb,var(--coral) 10%,var(--surface)),var(--surface));text-align:left}
      .auth-hero h1{font-size:23px;line-height:28px;margin:8px 0 7px}
      .auth-hero p{font-size:12px;line-height:18px;color:var(--muted);margin:0}
      .auth-kicker{font-size:9px;font-weight:900;letter-spacing:1px;color:var(--coral)}
      .auth-badge{display:inline-grid;place-items:center;width:42px;height:42px;border-radius:15px;background:var(--coral);color:white;font-size:19px}
      .auth-form{display:grid;gap:9px}
      .auth-form label{font-size:10px;font-weight:800;color:var(--muted);margin-left:3px}
      .auth-form input{width:100%;height:46px;border:1px solid var(--border);border-radius:15px;background:var(--surface);color:var(--text);padding:0 13px;outline:none}
      .auth-form input:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 14%,transparent)}
      .auth-actions,.provider-list{display:grid;gap:9px}
      .social-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}
      .auth-social{height:50px;border:1px solid var(--border);border-radius:16px;background:var(--surface);color:var(--text);font-weight:850}
      .provider-list .auth-social{display:flex;align-items:center;justify-content:center;gap:8px}
      .auth-social.facebook{border-color:color-mix(in srgb,#1877F2 55%,var(--border));color:#1877F2}
      .auth-social.google{border-color:color-mix(in srgb,var(--coral) 45%,var(--border));color:var(--coral)}
      .auth-social.apple{background:#101418;border-color:rgba(246,251,250,.78);color:#F6FBFA}
      .auth-social.apple:active{background:#171D23}
      .community-auth-buttons{display:grid;gap:9px;width:100%}
      .auth-social.community-auth-button{width:100%;max-width:330px;height:var(--hb-button-height,50px);min-height:var(--hb-button-height,50px);padding:0 14px;border-radius:var(--hb-radius-button,16px);display:flex;align-items:center;justify-content:center;font-size:var(--hb-font-button,13px);line-height:var(--hb-line-button,15px);font-weight:750;text-align:center}
      .community-auth-button .auth-social-content{display:inline-flex;align-items:center;justify-content:center;gap:12px;min-width:0;max-width:100%}
      .community-auth-button .auth-social-icon{width:20px;height:20px;flex:0 0 20px;display:grid;place-items:center}
      .community-auth-button .auth-social-icon svg{width:20px;height:20px;display:block}
      .community-auth-button .auth-social-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .auth-social.google.community-auth-button{background:#FFFFFF;border-color:#747775;color:#1F1F1F}
      .auth-social.facebook.community-auth-button{background:#1877F2;border-color:#1877F2;color:#FFFFFF}
      .auth-social.apple.community-auth-button{background:#000000;border-color:#000000;color:#FFFFFF}
      [data-theme="dark"] .auth-social.google.community-auth-button,.phone-shell.onboarding-active .auth-social.google.community-auth-button{background:#131314;border-color:#8E918F;color:#E3E3E3}
      [data-theme="dark"] .auth-social.apple.community-auth-button,.phone-shell.onboarding-active .auth-social.apple.community-auth-button{border-color:rgba(255,255,255,.92)}
      .auth-social.community-auth-button:active{transform:translateY(1px)}
      .auth-divider{text-align:center;color:var(--muted);font-size:10px}
      .auth-code{letter-spacing:10px;text-align:center;font-size:22px;font-weight:900}
      .auth-note{font-size:10px;line-height:15px;color:var(--muted);text-align:center;margin:0 8px}
      .auth-profile-card{border-radius:24px;padding:18px;background:linear-gradient(145deg,var(--primary),color-mix(in srgb,var(--primary) 72%,var(--accent)));color:#fff}
      .auth-profile-card h1{font-size:22px;margin:10px 0 4px}
      .auth-profile-card p{font-size:11px;color:rgba(255,255,255,.74);margin:0}
      .auth-status{display:inline-flex;gap:6px;align-items:center;border:1px solid rgba(255,255,255,.24);border-radius:999px;padding:6px 9px;font-size:9px;font-weight:850}
      .auth-provider-row{display:flex;gap:7px;flex-wrap:wrap;margin-top:13px}
      .auth-provider-row span{border-radius:999px;background:rgba(255,255,255,.12);padding:6px 9px;font-size:9px;font-weight:800}
      .danger-button{width:100%;height:46px;border:1px solid color-mix(in srgb,var(--coral) 50%,var(--border));border-radius:15px;background:transparent;color:var(--coral);font-weight:850}
      .privacy-check{display:flex;align-items:flex-start;gap:9px;border:1px solid var(--border);border-radius:16px;background:var(--surface);padding:12px;font-size:11px;line-height:16px;color:var(--text)}
      .privacy-check input{width:18px;height:18px;flex:0 0 18px;accent-color:var(--coral)}
      .privacy-link{margin-top:-7px}
      .legal-placeholder{display:grid;gap:11px}
      .legal-placeholder h3{font-size:13px;margin:0}
      .legal-placeholder p,.legal-placeholder li{font-size:11px;line-height:17px;color:var(--muted)}
      .onboarding-plan{width:100%;border:1px solid var(--border);border-radius:20px;background:var(--surface);color:var(--text);padding:16px;text-align:left;display:flex;justify-content:space-between;gap:12px}
      .onboarding-plan.featured{border:2px solid var(--coral);padding:15px}
      .onboarding-plan span strong,.onboarding-plan span small,.onboarding-plan em{display:block}
      .onboarding-plan span strong{font-size:15px}
      .onboarding-plan span small{font-size:10px;line-height:15px;color:var(--muted);margin-top:5px}
      .onboarding-plan em{font-style:normal;color:var(--coral);font-size:8px;font-weight:900;letter-spacing:.8px;margin-bottom:5px}
      .onboarding-plan b{font-size:12px;color:var(--coral);white-space:nowrap}
      .reset-warning{border:1px solid color-mix(in srgb,var(--coral) 42%,var(--border));background:color-mix(in srgb,var(--coral) 8%,var(--surface));border-radius:22px;padding:18px}
      .reset-warning h1{font-size:21px;line-height:26px;margin:8px 0}
      .reset-warning p{font-size:12px;line-height:18px;color:var(--muted);margin:0}
      .account-summary{border:1px solid var(--border);border-radius:18px;background:var(--surface);padding:14px;display:grid;gap:5px}
      .account-summary-title{color:var(--muted);font-size:10px;line-height:14px;font-weight:900;text-transform:uppercase;letter-spacing:.7px}
      .account-summary strong{font-size:15px;line-height:20px}
      .account-summary span{color:var(--muted);font-size:11px;line-height:16px}
      .account-summary p,.account-section-note{margin:4px 0 0;color:var(--muted);font-size:11px;line-height:16px}
      .account-methods{display:grid;gap:10px}
      .account-method-card{border:1px solid var(--border);border-radius:18px;background:var(--surface);padding:13px;display:grid;gap:10px}
      .account-method-head{display:grid;grid-template-columns:34px 1fr auto;gap:10px;align-items:center}
      .account-method-icon{width:34px;height:34px;border-radius:11px;background:var(--surface-2);color:var(--accent);display:grid;place-items:center;font-weight:900}
      .account-method-icon svg{width:18px;height:18px;display:block}
      .account-method-icon.google{background:#fff;color:#1f1f1f;border:1px solid #747775}
      .account-method-icon.facebook{background:#1877F2;color:#fff}
      .account-method-icon.apple{background:#000;color:#fff}
      .account-method-icon.email{background:color-mix(in srgb,var(--accent) 18%,var(--surface));color:var(--accent)}
      .account-method-copy strong,.account-method-copy small{display:block}
      .account-method-copy strong{font-size:13px;line-height:17px}
      .account-method-copy small{font-size:10px;line-height:14px;color:var(--muted);margin-top:3px}
      .account-current-note{display:block;margin-top:5px;color:var(--muted);font-size:10px;line-height:14px;font-style:normal;font-weight:850}
      .account-method-status{border-radius:999px;padding:5px 8px;font-size:9px;font-weight:900;background:color-mix(in srgb,var(--surface-2) 75%,transparent);color:var(--muted);white-space:nowrap}
      .account-method-status.active{background:color-mix(in srgb,var(--accent) 16%,transparent);color:var(--accent)}
      .account-method-status.current{background:color-mix(in srgb,var(--surface-2) 82%,transparent);color:var(--muted)}
      .account-method-actions{display:grid;gap:8px}
      .account-method-actions .auth-social.community-auth-button{max-width:none}
      .account-method-actions .secondary-button,.account-method-actions .text-button{min-height:42px}
      .account-security-group{margin-top:2px}
      .account-session-actions{display:grid;gap:9px}
      .auth-screen.account-security-screen .account-session-actions .secondary-button{width:100%!important;max-width:none!important;margin-left:0!important;margin-right:0!important}
      .account-action-note{margin:0;color:var(--muted);font-size:10px;line-height:15px}
      .account-danger-zone{border-top:1px solid var(--border);padding-top:13px;display:grid;gap:7px}
      .auth-screen.account-security-screen .account-danger-zone .danger-button{width:100%!important;max-width:none!important;margin-left:0!important;margin-right:0!important}
    `;
  }

  function ensureSubscriptionStyle(){
    let style=document.getElementById('prototypeSubscriptionStyle');
    if(!style){
      style=document.createElement('style');
      style.id='prototypeSubscriptionStyle';
      document.head.appendChild(style);
    }
    style.textContent='.welcome-card{background:radial-gradient(circle at 18% 8%,rgba(255,117,95,.38),transparent 36%),linear-gradient(145deg,#061216,#0D242B 58%,#153841)!important;color:#fff!important}.welcome-brand{background:rgba(0,0,0,.18);border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:9px 10px;width:max-content;max-width:100%}.welcome-card p{color:rgba(255,255,255,.84)!important}.provider-list,.auth-actions{width:min(100%,330px);margin-left:auto;margin-right:auto}.provider-list .auth-social,.auth-actions button,.welcome-screen>.primary-button,.welcome-screen>.secondary-button,.auth-screen>.primary-button,.auth-screen>.secondary-button{width:100%;max-width:330px;margin-left:auto;margin-right:auto}.plan-hero{position:relative;overflow:hidden;border-radius:28px;padding:22px 17px;background:radial-gradient(circle at 18% 4%,rgba(255,117,95,.34),transparent 35%),linear-gradient(145deg,#061216,#0D242B 62%,#153841);color:#fff;box-shadow:var(--shadow)}.plan-hero:after{content:"";position:absolute;right:-48px;bottom:-58px;width:170px;height:170px;border-radius:50%;border:30px solid rgba(255,255,255,.07)}.plan-hero h1{position:relative;z-index:1;font-size:25px;line-height:30px;margin:9px 0 7px}.plan-hero p{position:relative;z-index:1;font-size:12px;line-height:18px;color:rgba(255,255,255,.8);margin:0}.plan-hero .welcome-brand{position:relative;z-index:1;margin-bottom:16px}.plan-list-v4{display:grid;gap:10px}.plan-choice{position:relative;width:100%;border:1px solid var(--border);border-radius:20px;background:var(--surface);color:var(--text);padding:15px;text-align:left;display:grid;grid-template-columns:28px 1fr auto;gap:11px;align-items:start}.plan-choice.selected{border:2px solid var(--coral);padding:14px;background:color-mix(in srgb,var(--coral) 7%,var(--surface))}.choice-dot{width:24px;height:24px;border-radius:50%;border:2px solid var(--border);display:grid;place-items:center;font-size:13px;font-weight:900;color:#fff}.plan-choice.selected .choice-dot{background:var(--coral);border-color:var(--coral)}.choice-copy strong,.choice-copy small,.choice-copy em{display:block}.choice-copy strong{font-size:14px}.choice-copy small{font-size:10px;line-height:15px;color:var(--muted);margin-top:5px}.choice-copy em{font-style:normal;color:var(--coral);font-size:8px;font-weight:900;letter-spacing:.8px;margin-bottom:4px}.choice-price{font-size:11px;font-weight:900;color:var(--coral);white-space:nowrap}.plan-note-box{border:1px solid color-mix(in srgb,var(--accent) 28%,var(--border));background:color-mix(in srgb,var(--accent) 7%,var(--surface));border-radius:18px;padding:12px 13px;font-size:10px;line-height:15px;color:var(--muted)}';
  }

  function authState(){
    if(!state.auth)state.auth={loggedIn:false,name:'',email:'',phone:'',provider:'',linkedProviders:{Email:false,Google:false,Facebook:false,Apple:false},twoFactor:true,authGate:false};
    if(state.auth.provider==='Email / telefon')state.auth.provider='Email';
    state.auth.linkedProviders=normalizeLinkedProviders(state.auth);
    if(typeof state.auth.twoFactor==='undefined')state.auth.twoFactor=true;
    if(typeof state.auth.authGate==='undefined')state.auth.authGate=false;
    if(state.settingsPrefs&&typeof state.settingsPrefs.twoFactor==='undefined')state.settingsPrefs.twoFactor=state.auth.twoFactor;
    syncSettingsLinkedAccounts(state.auth);
    return state.auth;
  }

  function normalizeLinkedProviders(auth){
    const linked={Email:false,Google:false,Facebook:false,Apple:false,...(auth.linkedProviders||{})};
    ['Email','Google','Facebook','Apple'].forEach(provider=>{
      linked[provider]=!!linked[provider];
    });
    if(auth.loggedIn&&auth.provider&&linked[auth.provider]===false)linked[auth.provider]=true;
    if(auth.loggedIn&&auth.provider==='Email')linked.Email=true;
    return linked;
  }

  function linkedProviderNames(auth=authState()){
    const linked=normalizeLinkedProviders(auth);
    return ['Email','Google','Facebook','Apple'].filter(provider=>linked[provider]);
  }

  function ensureCurrentProvider(auth=authState()){
    const linked=linkedProviderNames(auth);
    if(auth.provider&&linked.includes(auth.provider))return auth.provider;
    auth.provider=linked[0]||auth.provider||'';
    return auth.provider;
  }

  function syncSettingsLinkedAccounts(auth=authState()){
    if(!state.settingsPrefs)return;
    const linked=normalizeLinkedProviders(auth);
    state.settingsPrefs.linkedAccounts={Apple:!!linked.Apple,Google:!!linked.Google,Facebook:!!linked.Facebook};
    state.settingsPrefs.profileName=auth.name||state.settingsPrefs.profileName||'';
    state.settingsPrefs.profileEmail=auth.email||state.settingsPrefs.profileEmail||'';
    state.settingsPrefs.twoFactor=auth.twoFactor;
    state.settingsPrefs.twoFactorMethod='E-mail';
  }

  function onboardingState(){
    if(!state.onboarding)state.onboarding={required:false,introSeen:false,authDone:false,subscriptionDone:false,privacyAccepted:false,completed:false};
    if(typeof state.onboarding.introSeen==='undefined')state.onboarding.introSeen=false;
    if(typeof state.onboarding.authDone==='undefined')state.onboarding.authDone=false;
    if(typeof state.onboarding.subscriptionDone==='undefined')state.onboarding.subscriptionDone=false;
    if(typeof state.onboarding.rssDone==='undefined')state.onboarding.rssDone=false;
    if(typeof state.onboarding.completed==='undefined')state.onboarding.completed=false;
    return state.onboarding;
  }

  function isAuthGateActive(){
    const onboarding=onboardingState();
    const auth=authState();
    return !!auth.authGate&&!auth.loggedIn&&!onboarding.required;
  }

  function clearAuthGate(){
    authState().authGate=false;
  }

  function openLoggedOutAuthGate(){
    safeStopSpeech(false);
    if(typeof window.hirbeszedResetAccountScopedStateForLogout==='function'){
      window.hirbeszedResetAccountScopedStateForLogout();
    }else{
      const auth=authState();
      const onboarding=onboardingState();
      auth.loggedIn=false;
      auth.name='';
      auth.email='';
      auth.phone='';
      auth.provider='';
      auth.linkedProviders={Email:false,Google:false,Facebook:false,Apple:false};
      auth.twoFactor=true;
      auth.authGate=true;
      auth.pendingMode='';
      auth.draftName='';
      auth.draftEmail='';
      auth.draftPhone='';
      onboarding.required=false;
      onboarding.introSeen=false;
      onboarding.privacyAccepted=false;
      state.route='feed';
      state.playing=false;
      state.paused=false;
      try{sessionStorage.removeItem(LAUNCH);}catch(_){}
      saveState();
    }
    setOnboardingLayout(true);
    welcomeSheet();
  }

  function resetIncompleteOnboardingProgress(){
    const onboarding=onboardingState();
    if(!onboarding.required||onboarding.completed)return false;
    const initial=typeof window.hirbeszedCreateInitialState==='function'?window.hirbeszedCreateInitialState():null;
    state.onboarding={required:true,introSeen:false,authDone:false,subscriptionDone:false,rssDone:false,privacyAccepted:false,completed:false};
    state.auth=initial&&initial.auth?{...initial.auth}:{loggedIn:false,name:'',email:'',phone:'',provider:'',linkedProviders:{Email:false,Google:false,Facebook:false,Apple:false},twoFactor:true,authGate:false};
    state.auth.authGate=false;
    if(initial&&initial.subscription)state.subscription={...initial.subscription};
    else state.subscription={status:'active',plan:'free',trialDays:0,activeDaysLeft:0,scheduledPlan:'',scheduledDays:0};
    if(initial&&initial.sources)state.sources={...initial.sources};
    if(initial&&Array.isArray(initial.enabledTopics))state.enabledTopics=[...initial.enabledTopics];
    state.route='feed';
    state.playing=false;
    state.paused=false;
    state.autoNext=true;
    state.mic=true;
    try{sessionStorage.removeItem(LAUNCH);}catch(_){}
    saveState();
    return true;
  }

  function isSubscriptionReady(){
    return state.subscription&&['active','trial'].includes(state.subscription.status);
  }

  function hasStoreManagedSubscription(){
    const sub=state.subscription||{};
    const plan=sub.plan||'free';
    return plan!=='free'&&['active','trial'].includes(sub.status);
  }

  function neutralizeSpeechCallbacks(){
    try{
      if(typeof currentUtterance!=='undefined'&&currentUtterance){
        currentUtterance.onend=null;
        currentUtterance.onerror=null;
      }
    }catch(e){}
  }

  function safeStopSpeech(update){
    neutralizeSpeechCallbacks();
    try{if('speechSynthesis' in window)speechSynthesis.cancel();}catch(e){}
    try{currentUtterance=null;}catch(e){}
    state.playing=false;
    if(update&&state.route==='car')renderCar();
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
    activeSheet?.classList.remove('open','sheet-no-header');
    activeSheet?.setAttribute('aria-hidden','true');
    try{activeSheetRenderer=null;}catch(_){}
  }

  function enterNormalApp(withSpeech){
    setOnboardingLayout(false);
    closeOnboardingSheet();
    requestAnimationFrame(function(){
      startCarExperience(withSpeech);
    });
  }

  function packageHomeRoute(){
    try{
      if(typeof subscriptionHomeRoute==='function')return subscriptionHomeRoute(state.subscription);
    }catch(_){}
    const sub=state.subscription||{};
    if(sub.status==='active'&&sub.plan==='assistant')return 'assistant';
    if((sub.status==='active'||sub.status==='trial')&&sub.plan==='reader')return 'car';
    return 'feed';
  }

  if(typeof stopSpeech==='function'&&!stopSpeech.__safeRoutePatch){
    const originalStopSpeech=stopSpeech;
    stopSpeech=function(update=true){
      neutralizeSpeechCallbacks();
      return originalStopSpeech.call(this,update);
    };
    stopSpeech.__safeRoutePatch=true;
  }

  function statusLabel(){return authState().loggedIn?'Bejelentkezve':'Kijelentkezve';}

  function privacyHtml(){
    const checked=onboardingState().privacyAccepted?'checked':'';
    return `<div class="privacy-check"><label class="privacy-check-label" for="privacyAccepted"><input id="privacyAccepted" type="checkbox" ${checked}><span>Elfogadom az adatvédelmi tájékoztatót és a Hírbeszéd használati feltételeit.</span></label><button class="privacy-inline-link" type="button" data-auth-action="privacy">Adatvédelmi tájékoztató és használati feltételek</button></div>`;
  }

  function socialBrandIcon(provider){
    const icons={
      Google:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path fill="#4285F4" d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.482h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.258h2.909c1.702-1.567 2.683-3.874 2.683-6.615z"></path><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.258c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.583-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"></path><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.594.102-1.171.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"></path><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.346l2.582-2.582C13.463.892 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.162 6.656 3.58 9 3.58z"></path></svg>',
      Facebook:'<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path fill="#FFFFFF" d="M16 8.049C16 3.603 12.418 0 8 0S0 3.603 0 8.049c0 4.017 2.926 7.347 6.75 7.951v-5.625H4.719V8.049H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"></path></svg>',
      Apple:'<svg viewBox="0 0 15 18" aria-hidden="true" focusable="false"><path fill="#FFFFFF" d="M11.182.008c-.034-.038-1.259.015-2.325 1.172-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.188 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282z"></path></svg>'
    };
    return icons[provider]||'';
  }

  function shieldIcon(){
    return '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-2.8 8.2-7 10-4.2-1.8-7-5.5-7-10V6l7-3z"></path><path d="M12 7v10"></path></svg>';
  }

  function socialButtons(){
    const button=(provider,action,label)=>`<button class="auth-social community-auth-button ${provider.toLowerCase()}" data-auth-action="${action}"><span class="auth-social-content"><span class="auth-social-icon">${socialBrandIcon(provider)}</span><span class="auth-social-label">${label}</span></span></button>`;
    return `<div class="provider-list community-auth-buttons" data-component="kozossegi-gombkeszlet">${button('Google','social-google','Folytat&aacute;s Google-fi&oacute;kkal')}${button('Facebook','social-facebook','Folytat&aacute;s Facebook-fi&oacute;kkal')}${button('Apple','social-apple','Folytat&aacute;s Apple-fi&oacute;kkal')}</div>`;
  }

  function esc(value){
    if(typeof escapeHtml==='function')return escapeHtml(value);
    return String(valur??'').replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lw;','>':'&gw;','"':'&quot;',"'":'&#39;'}[character]));
  }

  function providerConfig(provider){
    const configs={
      Email:{icon:'@',label:'E-mailes belépés',className:'email',connectLabel:'E-mailes belépés hozzáadása'},
      Google:{icon:'G',label:'Google',className:'google',connectLabel:'Google-fiók kapcsolása'},
      Facebook:{icon:'f',label:'Facebook',className:'facebook',connectLabel:'Facebook-fiók kapcsolása'},
      Apple:{icon:'A',label:'Apple',className:'apple',connectLabel:'Apple-fiók kapcsolása'}
    };
    return configs[provider]||configs.Email;
  }

  function socialConnectButton(provider){
    const config=providerConfig(provider);
    return `<button class="auth-social community-auth-button ${config.className}" data-auth-action="connect-${provider.toLowerCase()}"><span class="auth-social-content"><span class="auth-social-icon">${socialBrandIcon(provider)}</span><span class="auth-social-label">${esc(config.connectLabel)}</span></span></button>`;
  }

  function connectedProviderText(auth=authState()){
    const linked=linkedProviderNames(auth).map(provider=>providerConfig(provider).label);
    return linked.length?linked.join(', '):'Nincs kapcsolt belépési mód';
  }

  function accountProviderIcon(provider){
    const config=providerConfig(provider);
    return provider==='Email'?esc(config.icon):socialBrandIcon(provider);
  }

  function accountMethodCard(provider,auth=authState()){
    const config=providerConfig(provider);
    const linked=!!auth.linkedProviders?.[provider];
    const current=ensureCurrentProvider(auth)===provider;
    const status=linked?'Kapcsolva':'Nincs kapcsolva';
    const currentNote=current?'<em class="account-current-note">Most ezzel vagy belépve</em>':'';
    let copy='';
    if(provider==='Email'){
      copy=linked?`${auth.email||'E-mail cím beállítva'} · e-mail + jelszó`:(auth.email?`Átvehető e-mail: ${auth.email}`:'Add meg az e-mail címet és a jelszót.');
    }else{
      copy=linked?'Belépésre használható.':'Kapcsolható a meglévő Hírbeszéd-fiókhoz.';
    }
    const actions=linked
      ? `<button class="text-button" data-auth-action="disconnect-${provider.toLowerCase()}">${provider==='Email'?'E-mailes belépés leválasztása':`${config.label} leválasztása`}</button>`
      : provider==='Email'
        ? `<button class="secondary-button" data-auth-action="add-email-login">${esc(config.connectLabel)}</button>`
        : socialConnectButton(provider);
    return `<article class="account-method-card" data-account-provider="${provider}"><div class="account-method-head"><span class="account-method-icon ${config.className}">${accountProviderIcon(provider)}</span><span class="account-method-copy"><strong>${esc(config.label)}</strong><small>${esc(copy)}</small>${currentNote}</span><span class="account-method-status ${linked?(current?'current':'active'):''}">${esc(status)}</span></div><div class="account-method-actions">${actions}</div></article>`;
  }

  function accountMethodsHtml(auth=authState()){
    return ['Google','Facebook','Apple','Email'].map(provider=>accountMethodCard(provider,auth)).join('');
  }

  function beginAddEmailLogin(){
    const auth=authState();
    auth.pendingMode='add-email-login';
    auth.draftEmail=auth.email||'';
    auth.draftName=auth.name||'';
    saveState();
    registerSheet('add-email-login');
  }

  function connectSocialProvider(provider){
    const auth=authState();
    auth.linkedProviders=normalizeLinkedProviders(auth);
    auth.linkedProviders[provider]=true;
    if(!auth.provider)auth.provider=provider;
    if(!auth.name)auth.name=`${provider} felhasználó`;
    if(!auth.email)auth.email=`${provider.toLowerCase()}@hirbeszed.hu`;
    syncSettingsLinkedAccounts(auth);
    saveState();
    toast(`${providerConfig(provider).label} kapcsolva`);
    accountSheet();
  }

  function showLastProviderError(){
    if(typeof window.showAppMessage==='function'){
      window.showAppMessage({type:'error',title:'Nem választható le az utolsó belépési mód',message:'Előbb kapcsolj hozzá e-mailes belépést vagy egy másik szolgáltatót, hogy később is be tudj lépni a Hírbeszéd-fiókodba.',primaryText:'Rendben'});
      return;
    }
    toast('Az utolsó belépési mód nem választható le',{type:'warning'});
  }

  function disconnectProvider(provider){
    const auth=authState();
    auth.linkedProviders=normalizeLinkedProviders(auth);
    const linked=linkedProviderNames(auth);
    if(!auth.linkedProviders[provider]){
      accountSheet();
      return;
    }
    if(linked.length<=1){
      showLastProviderError();
      return;
    }
    auth.linkedProviders[provider]=false;
    if(auth.provider===provider)auth.provider=linked.find(item=>item!==provider)||'';
    syncSettingsLinkedAccounts(auth);
    saveState();
    toast(`${providerConfig(provider).label} leválasztva`);
    accountSheet();
  }

  function deleteAccountPrototype(){
    safeStopSpeech(false);
    if(typeof window.hirbeszedResetAccountScopedStateForLogout==='function'){
      window.hirbeszedResetAccountScopedStateForLogout();
    }else{
      const auth=authState();
      const onboarding=onboardingState();
      auth.loggedIn=false;
      auth.name='';
      auth.email='';
      auth.phone='';
      auth.provider='';
      auth.linkedProviders={Email:false,Google:false,Facebook:false,Apple:false};
      auth.twoFactor=true;
      auth.authGate=true;
      auth.pendingMode='';
      onboarding.required=false;
      onboarding.completed=false;
      state.route='feed';
      state.playing=false;
      state.paused=false;
      try{sessionStorage.removeItem(LAUNCH);}catch(_){}
      saveState();
    }
    toast('Fiók törölve');
    setOnboardingLayout(true);
    welcomeSheet();
  }

  function confirmFinalAccountDeletion(){
    if(typeof window.showAppMessage==='function'){
      window.showAppMessage({
        type:'warning',
        title:'Fiók törlése?',
        message:'A fiók törlése végleges. A Hírbeszéd-fiókod, a kapcsolt belépési módjaid, a felhőben mentett beállításaid, RSS-forrásaid és érdeklődési adataid törlésre kerülnek, és később nem állíthatók vissza. Ha App Store- vagy Google Play-előfizetésed van, azt külön le kell mondanod az áruházban.',
        primaryText:'Fiók törlése',
        secondaryText:'Mégsem',
        onPrimary:deleteAccountPrototype
      });
      return;
    }
    deleteAccountPrototype();
  }

  function confirmAccountDeletion(){
    if(hasStoreManagedSubscription()&&typeof window.showAppMessage==='function'){
      window.showAppMessage({
        type:'warning',
        title:'Előfizetés lemondása',
        message:'A fiók törlése előtt mondd le az App Store-ban vagy a Google Play-ben kezelt Hírbeszéd-előfizetésedew. A fiók törlése önmagában nem garantálja, hogy az áruházi számlázás megszűnik.',
        primaryText:'Lemondásw ellenőriztem',
        secondaryText:'Mégsem',
        onPrimary:confirmFinalAccountDeletion
      });
      return;
    }
    confirmFinalAccountDeletion();
  }

  function welcomeSheet(){
    ensureAuthStyle();
    ensureSubscriptionStyle();
    openSheet('Hírbeszéd','Üdvözlő képernyő',`<section class="welcome-screen"><div class="welcome-card"><div class="welcome-brand"><img src="assets/brand/hirbeszed-mark-light.svg" alt=""><div class="welcome-wordmark"><span>Hír</span>beszéd</div></div><h1>Üdvözlünk a jövő hírapplikációjában.</h1><p>Maradj képben a friss magyar hírekkel akkor is, amikor nem a kijelzőt nézed. Hallgasd a felolvasást, vezéreld hanggal az appot, és kérdezz rá az aktualitásokra az asszisztenstől.</p><div class="welcome-features"><span>Friss hírek</span><span>Felolvasás</span><span>Hírasszisztens</span></div><div class="welcome-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div><p class="welcome-registration-note">Az alkalmazás használata regisztrációhoz kötött. Kérlek, jelentkezz be vagy regisztrálj.</p>${privacyHtml()}${socialButtons()}<button class="secondary-button" data-auth-action="choose-register">Regisztráció e-mail címmel</button><button class="secondary-button" data-auth-action="login">Már van fiókom, belépek</button></section>`);
    document.getElementById('sheet')?.classList.add('sheet-no-header');
  }

  function accountSheet(){
    ensureAuthStyle();
    ensureSubscriptionStyle();
    const auth=authState();
    if(auth.loggedIn){
      ensureCurrentProvider(auth);
      saveState();
      openSheet('Fiók és biztonság','Bejelentkezési módok és fiókvédelem',`<section class="auth-screen account-security-screen"><div class="account-summary"><span class="account-summary-title">Fiók adatai</span><strong>${esc(auth.name||'Hírbeszéd felhasználó')}</strong><span>${esc(auth.email||'Nincs mentett e-mail cím')}</span><p>Ez a Hírbeszéd-profilod. A kapcsolt belépési módok mind ehhez a fiókhoz tartoznak.</p></div><h3 class="section-label">Kapcsolt belépési módok</h3><p class="account-section-note">Ezekkel a módokkal ugyanabba a Hírbeszéd-fiókba tudsz belépni. Több belépési mód is lehet kapcsolva egyszerre; a „Most ezzel vagy belépve” jelzés csak az aktuális munkamenetet mutatja.</p><div class="account-methods">${accountMethodsHtml(auth)}</div><h3 class="section-label">Biztonság</h3><div class="settings-group account-security-group">${settingRow([shieldIcon(),'Kétlépcsős védelem',auth.twoFactor?'Bekapcsolva':'Kikapcsolva','auth-security'])}</div><div class="account-session-actions"><p class="account-action-note">A kijelentkezés csak ezen az eszközön léptet ki. A fiókod, előfizetésed és felhőben mentett beállításaid megmaradnak.</p><button class="secondary-button" data-auth-action="logout">Kijelentkezés</button></div><div class="account-danger-zone"><p class="account-action-note">A fiók törlése törli a felhőben tárolt fiókadataidaw, beállításaidaw, RSS-forrásaidaw, érdeklődési adataidat és kapcsolt belépési módjaidaw. Ez a művelet nem állítható vissza. Ha App Store- vagy Google Play-előfizetésed van, azt törlés előtt külön le kell mondanod az áruházban.</p><button class="danger-button account-delete-button" data-auth-action="delete-account">Fiók törlése</button></div></section>`);
      return;
    }
    openLoggedOutAuthGate();
  }

  function loginSheet(){
    ensureAuthStyle();
    ensureSubscriptionStyle();
    openSheet('Belépés','Belépés e-mail címmel',`<section class="auth-screen login-screen"><div class="auth-hero"><h1>E-mailes belépés</h1><p>Add meg az e-mail címedet és a jelszavadat. Ha a fiókodnál szükséges, a következő lépésben 6 jegyű kódot kérünk az e-mail címedre küldött megerősítéshez.</p></div><div class="auth-form"><label for="authLoginId">E-mail cím</label><input id="authLoginId" autocomplete="email" inputmode="email" placeholder="anna@pelda.hu" aria-describedby="authLoginIdError" data-error-id="authLoginIdError"><p id="authLoginIdError" class="field-error" hidden>Adj meg egy érvényes e-mail címet.</p><label for="authLoginPass">Jelszó</label><input id="authLoginPass" type="password" autocomplete="current-password" placeholder="••••••••" aria-describedby="authLoginPassError" data-error-id="authLoginPassError"><p id="authLoginPassError" class="field-error" hidden>Add meg a jelszavadat.</p></div><button class="primary-button coral-button" data-auth-action="start-login">Belépés</button><button class="text-button" data-auth-action="forgot">Elfelejtett jelszó</button></section>`);
  }

  function registerSheet(mode){
    ensureAuthStyle();
    ensureSubscriptionStyle();
    const auth=authState();
    const first=onboardingState().required;
    const addEmailMode=mode==='add-email-login'||auth.pendingMode==='add-email-login';
    if(addEmailMode)auth.pendingMode='add-email-login';
    const needsName=addEmailMode&&!normalizeRegistrationName(auth.name);
    const emailValue=addEmailMode?(auth.draftEmail||auth.email||''):'';
    const nameField=(!addEmailMode||needsName)?`<label for="authRegName">${addEmailMode?'Megjelenített név':'Név'}</label><input id="authRegName" autocomplete="name" placeholder="Teljes név" value="${esc(addEmailMode?(auth.draftName||auth.name||''):'')}" aria-describedby="authRegNameError" data-error-id="authRegNameError"><p id="authRegNameError" class="field-error" hidden>Adj meg legalább 2 karaktert.</p>`:'';
    const title=addEmailMode?'E-mailes belépés hozzáadása':'E-mail regisztráció';
    const intro=addEmailMode?'Add meg az e-mail címet és a jelszót, majd erősítsd meg a címet a 6 jegyű kóddal. Ez nem hoz létre új Hírbeszéd-fiókot, csak új belépési módot kapcsol a meglévő profilhoz.':'Töltsd ki az űrlapot, majd erősítsd meg a fiókod. A következő lépésben 6 jegyű kódot küldünk az e-mail címedre. Írd be ezt a kódot a felugró ablakba.';
    const sheetTitle=addEmailMode?'E-mailes belépés hozzáadása':(first?'Fiók létrehozása':'Regisztráció');
    const sheetSubtitle=addEmailMode?'Meglévő fiókhoz':'Regisztráció e-mail címmel';
    const buttonLabel=addEmailMode?'E-mailes belépés hozzáadása':'Regisztráció';
    openSheet(sheetTitle,sheetSubtitle,`<section class="auth-screen register-screen" data-validation-version="register-validation-v284" data-auth-mode="${addEmailMode?'add-email-login':'register'}"><div class="auth-hero"><h1>${title}</h1><p>${intro}</p></div><div class="auth-form">${nameField}<label for="authRegEmail">E-mail cím</label><input id="authRegEmail" autocomplete="email" inputmode="email" placeholder="email@pelda.hu" value="${esc(emailValue)}" aria-describedby="authRegEmailError" data-error-id="authRegEmailError"><p id="authRegEmailError" class="field-error" hidden>Adj meg egy érvényes e-mail címet.</p><label for="authRegPass">Jelszó</label><input id="authRegPass" type="password" autocomplete="new-password" placeholder="Jelszó" aria-describedby="authRegPassError authPasswordRules" data-error-id="authRegPassError"><p id="authRegPassError" class="field-error" hidden>A jelszó még nem felel meg a szabályoknak.</p><div id="authPasswordRules" class="auth-password-rules" aria-live="polite"><p>A jelszó tartalmazzon:</p><ul><li data-password-rule="length">Legalább 8 karakter</li><li data-password-rule="lower">Kisbetű</li><li data-password-rule="upper">Nagybetű</li><li data-password-rule="number">Szám</li><li data-password-rule="special">Különleges karakter</li></ul></div></div><button class="primary-button coral-button" data-auth-action="start-register">${buttonLabel}</button></section>`);
    updatePasswordRules('');
    saveState();
  }

  function twoFactorSheet(mode){
    ensureAuthStyle();
    const auth=authState();
    const target=auth.draftEmail||auth.email||'a megadott e-mail cím';
    const registerMode=mode==='register';
    const addEmailMode=mode==='add-email-login';
    auth.pendingMode=mode||auth.pendingMode||'login';
    auth.pendingCode=PROTOTYPE_AUTH_CODE;
    auth.codeAttempts=0;
    auth.codeLocked=false;
    auth.codeIssuedAt=Date.now();
    auth.codeExpiresAt=Date.now()+CODE_EXPIRES_MS;
    auth.codeLastResentAt=0;
    saveState();
    openSheet(registerMode||addEmailMode?'E-mail cím megerősítése':'Belépés megerősítése',addEmailMode?'Belépési mód megerősítése':registerMode?'Regisztráció megerősítése':'Biztonsági kód',`<section class="auth-screen code-confirm-screen"><div class="auth-hero"><h1>${addEmailMode?'E-mailes belépés megerősítése':registerMode?'E-mail cím megerősítése':'Belépés megerősítése'}</h1><p>Írd be az e-mailben kapott 6 jegyű kódot. A kódot ide küldjük: ${target}.</p></div><div class="auth-form"><label for="authCode">Ellenőrző kód</label><input id="authCode" class="auth-code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]*" placeholder="------" aria-describedby="authCodeError" data-error-id="authCodeError"><p id="authCodeError" class="field-error" hidden>A kód 6 számjegyből áll.</p></div><button class="primary-button coral-button code-confirm-button" data-auth-action="complete-2fa" hidden disabled>Megerősítés</button><button class="text-button" data-auth-action="resend-2fa">Kód újraküldése</button></section>`);
  }

  function forgotSheet(){
    ensureAuthStyle();
    ensureSubscriptionStyle();
    openSheet('Jelszó visszaállítása','E-mail cím alapján',`<section class="auth-screen reset-screen"><div class="auth-hero"><h1>Jelszó visszaállítása</h1><p>Add meg a fiókodhoz tartozó e-mail címet. Ha találunk hozzá Hírbeszéd-fiókot, elküldjük a jelszó-visszaállító linket.</p></div><div class="auth-form"><label for="authResetId">E-mail cím</label><input id="authResetId" autocomplete="email" inputmode="email" placeholder="anna@pelda.hu" aria-describedby="authResetIdError" data-error-id="authResetIdError"><p id="authResetIdError" class="field-error" hidden>Adj meg egy érvényes e-mail címet.</p></div><button class="primary-button coral-button" data-auth-action="send-reset">Visszaállító link küldése</button><button class="text-button" data-auth-action="login">Vissza a belépéshez</button></section>`);
  }

  function privacySheet(){
    ensureAuthStyle();
    openSheet('Adatvédelmi tájékoztató','Ideiglenes prototípus-oldal',`<section class="auth-screen legal-placeholder"><div class="auth-hero"><span class="auth-badge">§</span><div class="auth-kicker">JOGI SZÖVEG KÉSZÜL</div><h1>Adatkezelési alapelvek</h1><p>Ez egy ideiglenes prototípus-oldal. A végleges jogi szöveget később készítjük el.</p></div><h3>Mit fog tartalmazni?</h3><ul><li>Fiókadatok kezelése: email, Apple/Facebook/Google folytatás.</li><li>Hírhasználati adatok: kedvelések, előzmények, érdeklődési témák.</li><li>Helyi hírekhez használt hozzávetőleges helyadatok.</li><li>Előfizetési státusz kezelése az Apple vagy Google áruházon keresztül.</li></ul><p>A prototípus jelenleg nem küld valódi regisztrációs adatot külső szerverre.</p><button class="primary-button" data-auth-action="welcome">Vissza az üdvözlő oldalra</button></section>`);
  }

  function securitySheet(){
    ensureAuthStyle();
    const auth=authState();
    openSheet('Kétlépcsős védelem','Fiókbiztonság',`<section class="auth-screen"><div class="settings-group"><button class="settings-row" data-auth-action="toggle-2fa"><span class="row-icon">${shieldIcon()}</span><span class="row-copy"><strong>Kétlépcsős azonosítás</strong><small>${auth.twoFactor?'Bekapcsolva':'Kikapcsolva'}</small></span><span class="toggle ${auth.twoFactor?'on':''}"></span></button></div><p class="auth-note">E-mailes belépésnél bekapcsolt állapotban 6 jegyű e-mail kódot kérünk. Közösségi belépésnél a szolgáltató saját védelme érvényes.</p></section>`);
  }

  function plansSheet(){
    ensureAuthStyle();
    ensureSubscriptionStyle();
    if(typeof subscriptionSheet==='function'){
      subscriptionSheet('onboarding','free','onboarding');
      return;
    }
    toast('A csomagválasztó oldal nem érhető el');
  }

  function isValidEmail(value){
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value||'').trim());
  }

  function normalizeRegistrationName(value){
    return String(value||'').trim().replace(/\s+/g,' ');
  }

  function passwordChecks(value){
    const password=String(value||'');
    return {
      filled:password.trim().length>0,
      length:password.length>=8,
      lower:/\p{Ll}/u.test(password),
      upper:/\p{Lu}/u.test(password),
      number:/\p{N}/u.test(password),
      special:/[^\p{L}\p{N}\s]/u.test(password)
    };
  }

  function missingPasswordRules(checks){
    const rules=[
      ['length','legalább 8 karakter'],
      ['lower','kisbetű'],
      ['upper','nagybetű'],
      ['number','szám'],
      ['special','különleges karakter']
    ];
    return rules.filter(([key])=>!checks[key]).map(([,label])=>label);
  }

  function passwordFieldMessage(checks){
    if(!checks.filled)return 'Adj meg jelszót a fiókodhoz.';
    if(!checks.length)return 'A jelszó legyen legalább 8 karakter hosszú.';
    if(!checks.lower)return 'A jelszó tartalmazzon legalább egy kisbetűw.';
    if(!checks.upper)return 'A jelszó tartalmazzon legalább egy nagybetűw.';
    if(!checks.number)return 'A jelszó tartalmazzon legalább egy számot.';
    if(!checks.special)return 'A jelszó tartalmazzon legalább egy különleges karaktert.';
    return '';
  }

  function updatePasswordRules(value){
    const checks=passwordChecks(value);
    const ruleMap={length:checks.length,lower:checks.lower,upper:checks.upper,number:checks.number,special:checks.special};
    Object.entries(ruleMap).forEach(([rule,ok])=>{
      const item=document.querySelector(`[data-password-rule="${rule}"]`);
      if(!item)return;
      item.classList.toggle('rule-ok',!!ok);
      item.classList.toggle('rule-missing',!!value&&!ok);
    });
  }

  function validateNameValue(value){
    const name=normalizeRegistrationName(value);
    if(!name)return {valid:false,value:name,title:'Hiányzó név',message:'Add meg a nevedet a fiók létrehozásához.',fieldMessage:'Add meg a nevedet a fiók létrehozásához.'};
    if(name.length<2)return {valid:false,value:name,title:'Túl eövid név',message:'A név legyen legalább 2 karakter hosszú.',fieldMessage:'A név legyen legalább 2 karakter hosszú.'};
    if(name.length>80)return {valid:false,value:name,title:'Túl hosszú név',message:'A név túl hosszú. Adj meg eövidebb nevet.',fieldMessage:'A név túl hosszú.'};
    if(!/[\p{L}\p{N}]/u.test(name)||!/^[\p{L}\p{N} '\-’]+$/u.test(name)){
      return {valid:false,value:name,title:'Nem használható név',message:'A név betűket, számokat, szóközw, köwőjelet vagy aposztrófow tartalmazhat.',fieldMessage:'Csak betű, szám, szóköz, köwőjel vagy aposztróf használható.'};
    }
    return {valid:true,value:name};
  }

  function validateEmailValue(value){
    const email=String(value||'').trim();
    if(!email)return {valid:false,value:email,title:'Hiányzó e-mail cím',message:'Add meg az e-mail címedet a regisztrációhoz.',fieldMessage:'Add meg az e-mail címedet.'};
    if(email.length>254)return {valid:false,value:email,title:'Túl hosszú e-mail cím',message:'Ez az e-mail cím nem használható ebben a formában.',fieldMessage:'Az e-mail cím túl hosszú.'};
    if(!isValidEmail(email))return {valid:false,value:email,title:'Hibás e-mail cím',message:'Úgy tűnik, ez nem érvényes e-mail cím. Ellenőrizd, majd próbáld újra.',fieldMessage:'Adj meg egy érvényes e-mail címet.'};
    return {valid:true,value:email};
  }

  function validatePasswordValue(value){
    const password=String(value||'');
    const checks=passwordChecks(password);
    const missing=missingPasswordRules(checks);
    if(!checks.filled)return {valid:false,value:password,title:'Hiányzó jelszó',message:'Adj meg jelszót a fiókodhoz.',fieldMessage:'Adj meg jelszót a fiókodhoz.'};
    if(missing.length){
      const message=missing.length===1?passwordFieldMessage(checks):`A jelszóból még hiányzik: ${missing.join(', ')}.`;
      return {valid:false,value:password,title:'Hiányos jelszó',message,fieldMessage:passwordFieldMessage(checks)};
    }
    return {valid:true,value:password};
  }

  function validateLoginEmailValue(value){
    const email=String(value||'').trim();
    if(!email)return {valid:false,value:email,title:'Hiányzó e-mail cím',message:'A belépéshez add meg a fiókodhoz tartozó e-mail címet.',fieldMessage:'Add meg az e-mail címedet.'};
    if(email.length>254)return {valid:false,value:email,title:'Túl hosszú e-mail cím',message:'Ez az e-mail cím nem használható ebben a formában.',fieldMessage:'Az e-mail cím túl hosszú.'};
    if(!isValidEmail(email))return {valid:false,value:email,title:'Hibás e-mail cím',message:'A megadott e-mail cím formátuma nem megfelelő. Ellenőrizd, majd próbáld újra.',fieldMessage:'Adj meg egy érvényes e-mail címet.'};
    return {valid:true,value:email};
  }

  function validateLoginPasswordValue(value){
    const password=String(value||'');
    if(!password)return {valid:false,value:password,title:'Hiányzó jelszó',message:'A belépéshez add meg a jelszavadat.',fieldMessage:'Add meg a jelszavadat.'};
    return {valid:true,value:password};
  }

  function validateResetEmailValue(value){
    const email=String(value||'').trim();
    if(!email)return {valid:false,value:email,title:'Hiányzó e-mail cím',message:'A jelszó visszaállításához add meg a fiókodhoz tartozó e-mail címet.',fieldMessage:'Add meg az e-mail címedet.'};
    if(email.length>254)return {valid:false,value:email,title:'Túl hosszú e-mail cím',message:'Ez az e-mail cím nem használható ebben a formában.',fieldMessage:'Az e-mail cím túl hosszú.'};
    if(!isValidEmail(email))return {valid:false,value:email,title:'Hibás e-mail cím',message:'A megadott e-mail cím formátuma nem megfelelő. Ellenőrizd, majd próbáld újra.',fieldMessage:'Adj meg egy érvényes e-mail címet.'};
    return {valid:true,value:email};
  }

  function setFieldError(input,message){
    if(!input)return;
    const errorId=input.dataset.errorId||(input.getAttribute('aria-describedby')||'').split(/\s+/).find(id=>document.getElementById(id)?.classList.contains('field-error'));
    const error=errorId?document.getElementById(errorId):null;
    input.classList.add('field-invalid');
    input.setAttribute('aria-invalid','true');
    if(error){
      error.textContent=message;
      error.hidden=false;
    }
  }

  function clearFieldError(input){
    if(!input)return;
    const errorId=input.dataset.errorId||(input.getAttribute('aria-describedby')||'').split(/\s+/).find(id=>document.getElementById(id)?.classList.contains('field-error'));
    const error=errorId?document.getElementById(errorId):null;
    input.classList.remove('field-invalid');
    input.removeAttribute('aria-invalid');
    if(error)error.hidden=true;
  }

  function focusAuthField(input){
    if(!input)return;
    setTimeout(()=>{
      input.scrollIntoView({block:'center',inline:'nearest'});
      input.focus({preventScroll:true});
    },40);
  }

  function showAuthError(title,message,focusTarget){
    if(typeof window.showAppMessage==='function'){
      window.showAppMessage({type:'error',title,message,primaryText:'Rendben',onPrimary:()=>focusAuthField(focusTarget)});
      return;
    }
    toast(message);
    focusAuthField(focusTarget);
  }

  function showLoginError(error){
    (error.inputs||[]).forEach(input=>{
      if(input&&error.fieldMessage)setFieldError(input,error.fieldMessage);
    });
    if(error.input&&error.fieldMessage)setFieldError(error.input,error.fieldMessage);
    const focusTarget=error.focusTarget||error.input||(error.inputs&&error.inputs[0]);
    const primaryText=error.primaryText||'Rendben';
    const onPrimary=error.onPrimary||(()=>focusAuthField(focusTarget));
    if(typeof window.showAppMessage==='function'){
      window.showAppMessage({type:'error',title:error.title,message:error.message,primaryText,onPrimary});
      return;
    }
    toast(error.message,{type:'warning'});
    onPrimary();
  }

  function codeInput(){
    return document.querySelector('#authCode');
  }

  function showCodeError(title,message,fieldMessage,options={}){
    const input=codeInput();
    if(input&&fieldMessage)setFieldError(input,fieldMessage);
    const primaryText=options.primaryText||'Rendben';
    const onPrimary=options.onPrimary||(()=>focusAuthField(input));
    if(typeof window.showAppMessage==='function'){
      window.showAppMessage({type:'error',title,message,primaryText,onPrimary});
      return;
    }
    toast(message,{type:'warning'});
    onPrimary();
  }

  function resetCodeChallenge(){
    const auth=authState();
    auth.pendingCode=PROTOTYPE_AUTH_CODE;
    auth.codeAttempts=0;
    auth.codeLocked=false;
    auth.codeIssuedAt=Date.now();
    auth.codeExpiresAt=Date.now()+CODE_EXPIRES_MS;
    auth.codeLastResentAt=Date.now();
    const input=codeInput();
    if(input){
      input.value='';
      clearFieldError(input);
      syncCodeConfirmButton(input);
    }
    saveState();
  }

  function clearCodeChallenge(auth=authState()){
    delete auth.pendingCode;
    delete auth.codeAttempts;
    delete auth.codeLocked;
    delete auth.codeIssuedAt;
    delete auth.codeExpiresAt;
    delete auth.codeLastResentAt;
  }

  function handleResendCode(){
    const auth=authState();
    if(!auth.pendingMode){
      showCodeError('A regisztráció megszakadt','A megerősítéshez tartozó folyamat már nem aktív. Indítsd újra a regisztrációt.','A regisztrációs folyamat nem aktív.',{primaryText:'Vissza a regisztrációhoz',onPrimary:()=>registerSheet()});
      return false;
    }
    if(typeof navigator!=='undefined'&&navigator.onLine===false){
      showCodeError('Nem sikerült elküldeni a kódot','Most nem tudtunk új ellenőrző kódot küldeni. Ellenőrizd az internetkapcsolatot, majd próbáld újra.','Nem sikerült új kódot küldeni.');
      return false;
    }
    const now=Date.now();
    if(auth.codeLastResentAt&&now-auth.codeLastResentAt<CODE_RESEND_COOLDOWN_MS){
      showCodeError('Várj egy kicsit','Rövid időn belül már kértél új kódot. Kérlek, várj egy kicsit, mielőtt újra próbálod.','Túl gyorsan kértél új kódot.');
      return false;
    }
    resetCodeChallenge();
    toast('Új kód elküldve a prototípusban',{type:'info'});
    return true;
  }

  function validateCodeEntry(codeValue){
    const auth=authState();
    const input=codeInput();
    if(!auth.pendingMode){
      return {valid:false,title:'A regisztráció megszakadt',message:'A megerősítéshez tartozó folyamat már nem aktív. Indítsd újra a regisztrációt.',fieldMessage:'A regisztrációs folyamat nem aktív.',primaryText:'Vissza a regisztrációhoz',onPrimary:()=>registerSheet()};
    }
    if(auth.codeLocked){
      return {valid:false,title:'Túl sok próbálkozás',message:'Biztonsági okból most nem lehet több kódot kipróbálni. Kéej új ellenőrző kódot, vagy próbáld újra később.',fieldMessage:'Túl sok hibás próbálkozás.',primaryText:'Új kód kérése',onPrimary:()=>handleResendCode()};
    }
    if(!/^\d{6}$/.test(codeValue)){
      return {valid:false,title:'Hiányos kód',message:'Az ellenőrző kód 6 számjegyből áll. Írd be mind a hat számjegyet az e-mailből.',fieldMessage:'A kód 6 számjegyből áll.'};
    }
    if(codeValue===PROTOTYPE_EXPIRED_CODE||Number(auth.codeExpiresAt||0)<Date.now()){
      auth.codeAttempts=Number(auth.codeAttempts||0)+1;
      if(auth.codeAttempts>=CODE_MAX_ATTEMPTS)auth.codeLocked=true;
      saveState();
      return {valid:false,title:'Lejárt kód',message:'Ez az ellenőrző kód már lejárt. Kéej új kódot, majd add meg az e-mailben kapott friss kódot.',fieldMessage:'Ez a kód már lejárt.',primaryText:'Új kód kérése',onPrimary:()=>handleResendCode()};
    }
    if(codeValue!==String(auth.pendingCode||PROTOTYPE_AUTH_CODE)){
      auth.codeAttempts=Number(auth.codeAttempts||0)+1;
      if(auth.codeAttempts>=CODE_MAX_ATTEMPTS){
        auth.codeLocked=true;
        saveState();
        return {valid:false,title:'Túl sok próbálkozás',message:'Biztonsági okból most nem lehet több kódot kipróbálni. Kéej új ellenőrző kódot, vagy próbáld újra később.',fieldMessage:'Túl sok hibás próbálkozás.',primaryText:'Új kód kérése',onPrimary:()=>handleResendCode()};
      }
      saveState();
      return {valid:false,title:'Hibás kód',message:'A megadott ellenőrző kód nem egyezik az e-mailben küldöww kóddal. Ellenőrizd a számokat, majd próbáld újra.',fieldMessage:'Hibás ellenőrző kód.'};
    }
    clearFieldError(input);
    return {valid:true};
  }

  function validateRegistrationField(input,force){
    if(!input)return null;
    let result=null;
    if(input.id==='authRegName')result=validateNameValue(input.value);
    if(input.id==='authRegEmail')result=validateEmailValue(input.value);
    if(input.id==='authRegPass'){
      updatePasswordRules(input.value);
      result=validatePasswordValue(input.value);
    }
    if(!result)return null;
    if(result.valid){
      clearFieldError(input);
      return result;
    }
    if(force||input.value.length>0||input.classList.contains('field-invalid'))setFieldError(input,result.fieldMessage||result.message);
    return result;
  }

  function validateRegistrationForm(){
    const fields=[
      document.querySelector('#authRegName'),
      document.querySelector('#authRegEmail'),
      document.querySelector('#authRegPass')
    ].filter(Boolean);
    const results=fields.map(input=>({input,result:validateRegistrationField(input,true)}));
    return {
      values:{
        name:results.find(item=>item.input.id==='authRegName')?.result?.value||'',
        email:results.find(item=>item.input.id==='authRegEmail')?.result?.value||'',
        password:results.find(item=>item.input.id==='authRegPass')?.result?.value||''
      },
      errors:results.filter(item=>item.result&&!item.result.valid).map(item=>({input:item.input,...item.result}))
    };
  }

  function validateLoginField(input,force){
    if(!input)return null;
    let result=null;
    if(input.id==='authLoginId')result=validateLoginEmailValue(input.value);
    if(input.id==='authLoginPass')result=validateLoginPasswordValue(input.value);
    if(!result)return null;
    if(result.valid){
      clearFieldError(input);
      return result;
    }
    if(force||input.value.length>0||input.classList.contains('field-invalid'))setFieldError(input,result.fieldMessage||result.message);
    return result;
  }

  function validateLoginForm(){
    const fields=[
      document.querySelector('#authLoginId'),
      document.querySelector('#authLoginPass')
    ].filter(Boolean);
    const results=fields.map(input=>({input,result:validateLoginField(input,true)}));
    return {
      values:{
        email:results.find(item=>item.input.id==='authLoginId')?.result?.value||'',
        password:results.find(item=>item.input.id==='authLoginPass')?.result?.value||''
      },
      errors:results.filter(item=>item.result&&!item.result.valid).map(item=>({input:item.input,...item.result}))
    };
  }

  function validateResetField(input,force){
    if(!input)return null;
    const result=validateResetEmailValue(input.value);
    if(result.valid){
      clearFieldError(input);
      return result;
    }
    if(force||input.value.length>0||input.classList.contains('field-invalid'))setFieldError(input,result.fieldMessage||result.message);
    return result;
  }

  function validateResetForm(){
    const input=document.querySelector('#authResetId');
    const result=validateResetField(input,true);
    return {
      values:{email:result?.value||''},
      errors:result&&!result.valid?[{input,...result}]:[]
    };
  }

  function clearLoginAttemptState(auth=authState()){
    delete auth.loginFailedAttempts;
    delete auth.loginLockedUntil;
  }

  function loginLockError(auth,emailInput,passwordInput){
    const lockedUntil=Number(auth.loginLockedUntil||0);
    if(!lockedUntil)return null;
    if(lockedUntil>Date.now()){
      return {
        valid:false,
        title:'Túl sok próbálkozás',
        message:'Biztonsági okból most nem lehet több belépési próbáw indítani. Várj egy kicsit, vagy használd az elfelejtett jelszó lehetőséget.',
        fieldMessage:'Túl sok sikertelen belépési próbálkozás.',
        inputs:[emailInput,passwordInput].filter(Boolean),
        focusTarget:emailInput,
        primaryText:'Elfelejtett jelszó',
        onPrimary:()=>forgotSheet()
      };
    }
    clearLoginAttemptState(auth);
    saveState();
    return null;
  }

  function recordLoginFailure(auth,emailInput,passwordInput){
    auth.loginFailedAttempts=Number(auth.loginFailedAttempts||0)+1;
    if(auth.loginFailedAttempts>=LOGIN_MAX_ATTEMPTS){
      auth.loginLockedUntil=Date.now()+LOGIN_LOCK_MS;
      saveState();
      return loginLockError(auth,emailInput,passwordInput);
    }
    saveState();
    return {
      valid:false,
      title:'Sikertelen belépés',
      message:'Az e-mail cím vagy a jelszó nem megfelelő. Ellenőrizd az adatokat, majd próbáld újra.',
      fieldMessage:'Az e-mail cím vagy a jelszó nem megfelelő.',
      inputs:[emailInput,passwordInput].filter(Boolean),
      focusTarget:emailInput
    };
  }

  function validatePrototypeLoginCredentials(values,emailInput,passwordInput){
    const auth=authState();
    const locked=loginLockError(auth,emailInput,passwordInput);
    if(locked)return locked;
    const email=values.email;
    const password=values.password;
    if(typeof navigator!=='undefined'&&navigator.onLine===false){
      return {valid:false,title:'Nem sikerült belépni',message:'Most nem tudtuk ellenőrizni a belépési adatokat. Ellenőrizd az internetkapcsolatot, majd próbáld újra.',focusTarget:emailInput};
    }
    if(email===PROTOTYPE_SERVER_ERROR_EMAIL){
      return {valid:false,title:'Nem sikerült belépni',message:'Most nem tudtuk ellenőrizni a belépési adatokat. Ellenőrizd az internetkapcsolatot, majd próbáld újra.',focusTarget:emailInput};
    }
    if(email===PROTOTYPE_LOCKED_EMAIL){
      return {valid:false,title:'A fiók nem használható',message:'Ezzel a fiókkal most nem lehet belépni. Kéej segítséget az ügyfélszolgálattól.',fieldMessage:'Ezzel a fiókkal most nem lehet belépni.',input:emailInput,focusTarget:emailInput};
    }
    if(email===PROTOTYPE_UNVERIFIED_EMAIL){
      return {
        valid:false,
        title:'E-mail megerősítés szükséges',
        message:'A fiókhoz tartozó e-mail cím még nincs megerősítve. Küldünk egy új megerősítő kódot.',
        fieldMessage:'Az e-mail cím megerősítése szükséges.',
        input:emailInput,
        focusTarget:emailInput,
        primaryText:'Kód küldése',
        onPrimary:()=>{
          auth.draftEmail=email;
          auth.draftPhone='';
          auth.pendingMode='login';
          clearLoginAttemptState(auth);
          saveState();
          twoFactorSheet('login');
        }
      };
    }
    if(email!==PROTOTYPE_LOGIN_EMAIL||password!==PROTOTYPE_LOGIN_PASSWORD)return recordLoginFailure(auth,emailInput,passwordInput);
    clearLoginAttemptState(auth);
    return {valid:true};
  }

  function resetRequestCooldownError(auth,input){
    const lastSent=Number(auth.passwordResetLastSentAt||0);
    if(lastSent&&Date.now()-lastSent<PASSWORD_RESET_COOLDOWN_MS){
      return {
        valid:false,
        title:'Várj egy kicsit',
        message:'Rövid időn belül már kértél jelszó-visszaállító linket. Kérlek, várj egy kicsit, mielőtt újra próbálod.',
        fieldMessage:'Rövid időn belül már kértél visszaállító linket.',
        input,
        focusTarget:input
      };
    }
    return null;
  }

  function validatePrototypePasswordReset(values,input){
    const auth=authState();
    const cooldown=resetRequestCooldownError(auth,input);
    if(cooldown)return cooldown;
    if(typeof navigator!=='undefined'&&navigator.onLine===false){
      return {valid:false,title:'Nem sikerült elküldeni a linket',message:'Most nem tudtuk elküldeni a jelszó-visszaállító linket. Ellenőrizd az internetkapcsolatot, majd próbáld újra.',focusTarget:input};
    }
    if(values.email===PROTOTYPE_SERVER_ERROR_EMAIL){
      return {valid:false,title:'Nem sikerült elküldeni a linket',message:'Most nem tudtuk elküldeni a jelszó-visszaállító linket. Ellenőrizd az internetkapcsolatot, majd próbáld újra.',focusTarget:input};
    }
    if(values.email===PROTOTYPE_LOCKED_EMAIL){
      return {valid:false,title:'A fiók nem használható',message:'Ezzel a fiókkal most nem lehet jelszót visszaállítani. Kérj segítséget az ügyfélszolgálattól.',fieldMessage:'Ezzel a fiókkal most nem lehet jelszót visszaállítani.',input,focusTarget:input};
    }
    return {valid:true};
  }

  function startRegisterFlow(){
    const auth=authState();
    const addEmailMode=auth.pendingMode==='add-email-login'||!!document.querySelector('.register-screen[data-auth-mode="add-email-login"]');
    const validation=validateRegistrationForm();
    if(validation.errors.length){
      const firstError=validation.errors[0];
      showAuthError(firstError.title,firstError.message,firstError.input);
      return false;
    }
    if(!addEmailMode&&!validatePrivacy())return false;
    const linked=normalizeLinkedProviders(auth);
    if(addEmailMode&&linked.Email){
      showAuthError('E-mailes belépés már kapcsolva','Ehhez a Hírbeszéd-fiókhoz már tartozik e-mailes belépés.',document.querySelector('#authRegEmail'));
      return false;
    }
    if(addEmailMode&&validation.values.email==='masik.fiok@example.com'){
      showAuthError('Ez az e-mail már másik fiókhoz tartozik','Ehhez az e-mail címhez már tartozik Hírbeszéd-fiók. Az összekapcsoláshoz előbb igazolni kell, hogy mindkét fiók a tiéd.',document.querySelector('#authRegEmail'));
      return false;
    }
    auth.draftName=validation.values.name||auth.name||'Hírbeszéd felhasználó';
    auth.draftEmail=validation.values.email||'minta@hirbeszed.hu';
    auth.draftPasswordReady=true;
    auth.draftPhone='';
    auth.pendingMode=addEmailMode?'add-email-login':'register';
    saveState();
    twoFactorSheet(auth.pendingMode);
    return true;
  }

  function startLoginFlow(){
    if(!validatePrivacy())return false;
    const auth=authState();
    const validation=validateLoginForm();
    if(validation.errors.length){
      const firstError=validation.errors[0];
      showLoginError(firstError);
      return false;
    }
    const emailInput=document.querySelector('#authLoginId');
    const passwordInput=document.querySelector('#authLoginPass');
    const credentialResult=validatePrototypeLoginCredentials(validation.values,emailInput,passwordInput);
    if(!credentialResult.valid){
      showLoginError(credentialResult);
      return false;
    }
    auth.draftEmail=validation.values.email||PROTOTYPE_LOGIN_EMAIL;
    auth.draftPhone='';
    auth.pendingMode='login';
    if(auth.twoFactor){
      saveState();
      twoFactorSheet('login');
      return true;
    }
    auth.loggedIn=true;
    auth.name='Hírbeszéd felhasználó';
    auth.email=auth.draftEmail;
    auth.phone='';
    auth.provider='Email';
    auth.linkedProviders=normalizeLinkedProviders(auth);
    auth.linkedProviders.Email=true;
    auth.pendingMode='';
    clearCodeChallenge(auth);
    syncSettingsLinkedAccounts(auth);
    saveState();
    toast('Belépés kész');
    completeAuth();
    return true;
  }

  function showPasswordResetSuccess(){
    const title='Ellenőrizd az e-mailjeidet';
    const message='Ha ehhez az e-mail címhez tartozik Hírbeszéd-fiók, elküldtük a jelszó-visszaállító linket.';
    if(typeof window.showAppMessage==='function'){
      window.showAppMessage({type:'success',title,message,primaryText:'Vissza a belépéshez',onPrimary:()=>loginSheet()});
      return;
    }
    toast(message,{type:'success'});
    loginSheet();
  }

  function startPasswordResetFlow(){
    if(onboardingState().required&&!validatePrivacy())return false;
    const auth=authState();
    const validation=validateResetForm();
    if(validation.errors.length){
      showLoginError(validation.errors[0]);
      return false;
    }
    const input=document.querySelector('#authResetId');
    const result=validatePrototypePasswordReset(validation.values,input);
    if(!result.valid){
      showLoginError(result);
      return false;
    }
    auth.passwordResetLastSentAt=Date.now();
    auth.passwordResetEmail=validation.values.email;
    saveState();
    showPasswordResetSuccess();
    return true;
  }

  window.addEventListener('input',function(event){
    if(event.target?.matches?.('#authRegName,#authRegEmail,#authRegPass')){
      validateRegistrationField(event.target,true);
    }
    if(event.target?.matches?.('#authLoginId,#authLoginPass')){
      validateLoginField(event.target,true);
    }
    if(event.target?.matches?.('#authResetId')){
      validateResetField(event.target,true);
    }
  },true);

  window.addEventListener('click',function(event){
    const button=event.target.closest?.('[data-auth-action="start-register"]');
    if(!button)return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    startRegisterFlow();
  },true);

  function showPrivacyRequiredError(){
    const box=document.querySelector('#privacyAccepted');
    showAuthError('Szabályzat elfogadása szükséges','A folytatáshoz előbb fogadd el az adatvédelmi tájékoztatót és a Hírbeszéd használati feltételeit.');
    box?.closest('.privacy-check')?.classList.add('pulse');
    setTimeout(()=>box?.closest('.privacy-check')?.classList.remove('pulse'),600);
  }

  function validatePrivacy(){
    const onboarding=onboardingState();
    if(onboarding.privacyAccepted)return true;
    const box=document.querySelector('#privacyAccepted');
    if(box&&box.checked){
      onboarding.privacyAccepted=true;
      saveState();
      return true;
    }
    if(onboarding.required||isAuthGateActive()){
      showPrivacyRequiredError();
      return false;
    }
    return true;
  }

  function completeAuth(){
    const onboarding=onboardingState();
    const auth=authState();
    if(onboarding.required){
      onboarding.authDone=true;
      onboarding.introSeen=true;
      clearAuthGate();
      saveState();
      plansSheet();
      return;
    }
    if(auth.authGate){
      clearAuthGate();
      onboarding.required=false;
      saveState();
      enterNormalApp(false);
      return;
    }
    accountSheet();
  }

  function returnToWelcomeFromPlans(){
    const onboarding=onboardingState();
    onboarding.required=true;
    onboarding.introSeen=false;
    onboarding.authDone=false;
    onboarding.subscriptionDone=false;
    onboarding.completed=false;

    const auth=authState();
    auth.loggedIn=false;
    auth.name='';
    auth.email='';
    auth.phone='';
    auth.provider='';
    auth.linkedProviders={Email:false,Google:false,Facebook:false,Apple:false};
    auth.twoFactor=false;
    auth.pendingMode='';
    auth.draftName='';
    auth.draftEmail='';
    auth.draftPhone='';

    saveState();
    setOnboardingLayout(true);
    welcomeSheet();
  }

  function returnToWelcomeFromAuthForm(){
    if(isAuthGateActive()){
      setOnboardingLayout(true);
      welcomeSheet();
      return;
    }
    const onboarding=onboardingState();
    onboarding.required=true;
    onboarding.introSeen=false;
    saveState();
    setOnboardingLayout(true);
    welcomeSheet();
  }

  function returnFromCodeStep(){
    const auth=authState();
    const pendingMode=auth.pendingMode;
    clearCodeChallenge(auth);
    if(pendingMode==='login'){
      loginSheet();
      return;
    }
    if(pendingMode==='add-email-login'){
      registerSheet('add-email-login');
      return;
    }
    if(onboardingState().required){
      const onboarding=onboardingState();
      onboarding.authDone=false;
      onboarding.introSeen=true;
      auth.loggedIn=false;
      auth.provider='';
      auth.twoFactor=false;
      saveState();
      setOnboardingLayout(true);
    }
    registerSheet();
  }

  document.addEventListener('click',function(event){
    if(!event.target.closest('#sheetBack'))return;
    const body=document.getElementById('sheetBody');
    const onboarding=onboardingState();
    const authGate=isAuthGateActive();
    const isPasswordReset=!!body?.querySelector('#authResetId');
    const isAddEmailForm=!!body?.querySelector('.register-screen[data-auth-mode="add-email-login"]');
    const isCodeStep=!!body?.querySelector('#authCode');
    if(isPasswordReset){
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      loginSheet();
      return;
    }
    if(isAddEmailForm){
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      authState().pendingMode='';
      saveState();
      accountSheet();
      return;
    }
    if(isCodeStep&&authState().pendingMode==='add-email-login'){
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      returnFromCodeStep();
      return;
    }
    if(!onboarding.required&&!authGate)return;
    const isOnboardingRegister=!!body?.querySelector('#authRegName');
    const isOnboardingLogin=!!body?.querySelector('#authLoginId');
    const isOnboardingPlans=!!body?.querySelector('.subscription-center[data-entry="onboarding"]');
    if(isCodeStep){
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      returnFromCodeStep();
      return;
    }
    if(isOnboardingRegister||isOnboardingLogin){
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      returnToWelcomeFromAuthForm();
      return;
    }
    if(!isOnboardingPlans)return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    returnToWelcomeFromPlans();
  },true);

  function startCarExperience(withSpeech){
    safeStopSpeech(false);
    const targetRoute=packageHomeRoute();
    state.route=targetRoute;
    if(targetRoute==='car'){
      state.autoNext=true;
      state.mic=true;
    }
    saveState();
    render();
    setTimeout(function(){
      if(withSpeech){
        if(targetRoute==='car'){
          try{speakCurrent();}
          catch(e){state.playing=true;renderCar();}
        }else if(typeof activateRouteAudio==='function'){
          activateRouteAudio(targetRoute);
        }
      }
    },250);
  }

  function renderSettingsV3(){
    const items=settingsItems().map(function(item){return item[3]==='account'?['F','Fiók és biztonság',statusLabel(),'account']:item;});
    setHeader('Beállítások');
    view.innerHTML=`<div class="settings-group subscription-entry">${settingRow(['C','Csomagok és előfizetés',subscriptionLabel(),'subscription'])}</div><div class="settings-group">${items.slice(0,4).map(settingRow).join('')}</div><div class="settings-group">${items.slice(4,8).map(settingRow).join('')}</div><div class="settings-group">${items.slice(8).map(settingRow).join('')}</div>`;
  }

  function renderSettingsV4(){
    const items=settingsItems();
    if(items.app){
      items.app=items.app.map(function(item){
        return item[3]==='account'?[typeof settingsMenuIcon==='function'?settingsMenuIcon('account'):'F','Fiók és biztonság',statusLabel(),'account']:item;
      });
    }
    setHeader('Beállítások');
    view.innerHTML=`<div class="settings-group subscription-entry">${settingRow([typeof settingsMenuIcon==='function'?settingsMenuIcon('subscription'):'C','Csomagok és előfizetés',subscriptionLabel(),'subscription'])}</div><h3 class="section-label settings-section-label">Hírbeállítások</h3><div class="settings-group">${items.news.map(settingRow).join('')}</div><h3 class="section-label settings-section-label">Alkalmazás</h3><div class="settings-group">${items.app.map(settingRow).join('')}</div><h3 class="section-label settings-section-label">Prototípus</h3><div class="settings-group">${items.prototype.map(settingRow).join('')}</div>`;
  }

  function renderSettingsV5(){
    const icon=typeof settingsMenuIcon==='function'?settingsMenuIcon:function(){return '•';};
    let rawItems=null;
    try{rawItems=settingsItems();}catch(error){rawItems=null;}
    const activeSources=Object.values(state.sources).filter(Boolean).length;
    const activeTopics=state.enabledTopics.length;
    const itemByType={};
    if(Array.isArray(rawItems)){
      rawItems.forEach(function(item){itemByType[item[3]]=item;});
    }
    const items=rawItems&&!Array.isArray(rawItems)&&rawItems.news&&rawItems.app&&rawItems.prototype?rawItems:{
      news:[
        [icon('sources'),'RSS-források',itemByType.sources?itemByType.sources[2]:`${activeSources} bekapcsolva`,'sources'],
        [icon('topics'),'Témák és érdeklődés',itemByType.topics?itemByType.topics[2]:`${activeTopics} kiválasztva`,'topics'],
        [icon('location'),'Helyi hírek',itemByType.location?itemByType.location[2]:(state.location?'Budapest környéke':'Kikapcsolva'),'location'],
        [icon('notifications'),'Értesítések',itemByType.notifications?itemByType.notifications[2]:(typeof notificationSettingsSummary==='function'?notificationSettingsSummary():(state.notifications?'Bekapcsolva':'Kikapcsolva')),'notifications']
      ],
      app:[
        [icon('account'),'Fiók és biztonság',statusLabel(),'account'],
        [icon('appearance'),'Megjelenés',itemByType.appearance?itemByType.appearance[2]:(state.theme==='system'?'Rendszer szerint':state.theme==='dark'?'Sötét':'Világos'),'appearance'],
        [icon('voice'),'Hang és felolvasó',itemByType.voice?itemByType.voice[2]:'Magyar hang · 1,0×','voice'],
        [icon('data'),'Mobiladat és tárhely',itemByType.data?itemByType.data[2]:(state.mobileData?'Mobilnet engedélyezve':'Csak Wi-Fi'),'data']
      ],
      prototype:[
        [icon('prototype'),'Prototípus','Fejlesztési beállítások','prototype'],
        [icon('carplay'),'CarPlay / Android Auto nézet','Ideiglenes autós kijelző előnézet','auto-preview']
      ]
    };
    items.app=items.app.map(function(item){
      return item[3]==='account'?[icon('account'),'Fiók és biztonság',statusLabel(),'account']:item;
    });
    setHeader('Beállítások');
    view.innerHTML=`<div class="settings-group subscription-entry">${settingRow([icon('subscription'),'Csomagok és előfizetés',subscriptionLabel(),'subscription'])}</div><h3 class="section-label settings-section-label">Hírbeállítások</h3><div class="settings-group">${items.news.map(settingRow).join('')}</div><h3 class="section-label settings-section-label">Alkalmazás</h3><div class="settings-group">${items.app.map(settingRow).join('')}</div><h3 class="section-label settings-section-label">Prototípus</h3><div class="settings-group">${items.prototype.map(settingRow).join('')}</div>`;
  }

  if(typeof renderSettings==='function'){
    renderSettings=renderSettingsV5;
  }

  if(typeof settingsSheet==='function'){
    const previousSettingsSheet=settingsSheet;
    settingsSheet=function(type){
      if(type==='account')return accountSheet();
      return previousSettingsSheet.apply(this,arguments);
    };
  }

  document.addEventListener('change',function(event){
    if(event.target&&event.target.id==='privacyAccepted'){
      onboardingState().privacyAccepted=event.target.checked;
      saveState();
    }
  },true);

  function syncCodeConfirmButton(input){
    const screen=input.closest('.auth-screen');
    const button=screen?.querySelector('[data-auth-action="complete-2fa"]');
    if(!button)return;
    const hasCode=input.value.trim().length===6;
    button.hidden=!hasCode;
    button.disabled=!hasCode;
  }

  document.addEventListener('input',function(event){
    if(event.target?.matches?.('#authRegName,#authRegEmail,#authRegPass')){
      validateRegistrationField(event.target,true);
      return;
    }
    if(event.target?.id!=='authCode')return;
    const input=event.target;
    const digits=input.value.replace(/\D/g,'').slice(0,6);
    if(input.value!==digits)input.value=digits;
    clearFieldError(input);
    syncCodeConfirmButton(input);
  },true);

  document.addEventListener('click',function(event){
    const route=event.target.closest('[data-route]');
    if(route){
      event.preventDefault();
      event.stopImmediatePropagation();
      if(onboardingState().required||isAuthGateActive()){
        setOnboardingLayout(true);
        welcomeSheet();
        return;
      }
      const nextRoute=route.dataset.route;
      sheet.classList.remove('open');
      sheet.setAttribute('aria-hidden','true');
      if(typeof changeRoute==='function'){
        changeRoute(nextRoute);
        return;
      }
      safeStopSpeech(false);
      state.route=nextRoute;
      saveState();
      render();
      if(typeof activateRouteAudio==='function')activateRouteAudio(state.route);
      return;
    }

    const authAction=event.target.closest('[data-auth-action]');
    if(authAction){
      event.preventDefault();
      event.stopImmediatePropagation();
      const action=authAction.dataset.authAction;
      const auth=authState();
      if(action==='welcome')welcomeSheet();
      if(action==='choose-register'){
        if(!validatePrivacy())return;
        onboardingState().introSeen=true;
        saveState();
        registerSheet();
      }
      if(action==='login'){
        if(!validatePrivacy())return;
        onboardingState().introSeen=true;
        saveState();
        loginSheet();
      }
      if(action==='register'){
        if(!validatePrivacy())return;
        onboardingState().introSeen=true;
        saveState();
        registerSheet();
      }
      if(action==='privacy')privacySheet();
      if(action==='forgot')forgotSheet();
      if(action==='start-login'){
        startLoginFlow();
      }
      if(action==='start-register'){
        startRegisterFlow();
      }
      if(action==='add-email-login'){
        beginAddEmailLogin();
      }
      if(action==='connect-google'||action==='connect-facebook'||action==='connect-apple'){
        const provider=action==='connect-google'?'Google':action==='connect-facebook'?'Facebook':'Apple';
        connectSocialProvider(provider);
      }
      if(action==='disconnect-email'||action==='disconnect-google'||action==='disconnect-facebook'||action==='disconnect-apple'){
        const provider=action==='disconnect-email'?'Email':action==='disconnect-google'?'Google':action==='disconnect-facebook'?'Facebook':'Apple';
        disconnectProvider(provider);
      }
      if(action==='delete-account'){
        confirmAccountDeletion();
      }
      if(action==='complete-2fa'){
        const codeValue=document.querySelector('#authCode')&&document.querySelector('#authCode').value.trim()||'';
        const codeResult=validateCodeEntry(codeValue);
        if(!codeResult.valid){
          showCodeError(codeResult.title,codeResult.message,codeResult.fieldMessage,{primaryText:codeResult.primaryText,onPrimary:codeResult.onPrimary});
          return;
        }
        const pendingMode=auth.pendingMode;
        if(pendingMode==='add-email-login'){
          auth.loggedIn=true;
          auth.name=auth.draftName||auth.name||'Hírbeszéd felhasználó';
          auth.email=auth.draftEmail||auth.email||'minta@hirbeszed.hu';
          auth.phone='';
          auth.linkedProviders=normalizeLinkedProviders(auth);
          auth.linkedProviders.Email=true;
          if(!auth.provider)auth.provider='Email';
          auth.twoFactor=true;
          if(state.settingsPrefs)state.settingsPrefs.twoFactor=true;
          auth.pendingMode='';
          clearCodeChallenge(auth);
          syncSettingsLinkedAccounts(auth);
          saveState();
          toast('E-mailes belépés kapcsolva');
          accountSheet();
          return;
        }
        auth.loggedIn=true;
        auth.name=auth.draftName||(pendingMode==='login'?'Hírbeszéd felhasználó':auth.name)||'Hírbeszéd felhasználó';
        auth.email=auth.draftEmail||auth.email||'minta@hirbeszed.hu';
        auth.phone='';
        auth.provider='Email';
        auth.linkedProviders=normalizeLinkedProviders(auth);
        auth.linkedProviders.Email=true;
        auth.twoFactor=true;
        if(state.settingsPrefs)state.settingsPrefs.twoFactor=true;
        auth.pendingMode='';
        clearCodeChallenge(auth);
        syncSettingsLinkedAccounts(auth);
        saveState();
        toast('Belépés megerősítve');
        completeAuth();
      }
      if(action==='resend-2fa')handleResendCode();
      if(action==='social-apple'||action==='social-facebook'||action==='social-google'){
        if(!validatePrivacy())return;
        const provider=action==='social-apple'?'Apple':action==='social-facebook'?'Facebook':'Google';
        auth.loggedIn=true;
        auth.name=provider+' felhasználó';
        auth.email=provider.toLowerCase()+'@hirbeszed.hu';
        auth.provider=provider;
        auth.linkedProviders=normalizeLinkedProviders(auth);
        auth.linkedProviders[provider]=true;
        auth.twoFactor=false;
        syncSettingsLinkedAccounts(auth);
        onboardingState().introSeen=true;
        saveState();
        toast(provider+' belépés kész');
        completeAuth();
      }
      if(action==='send-reset'){
        startPasswordResetFlow();
      }
      if(action==='toggle-2fa'){
        auth.twoFactor=!auth.twoFactor;
        if(state.settingsPrefs)state.settingsPrefs.twoFactor=auth.twoFactor;
        saveState();
        securitySheet();
      }
      if(action==='logout'){
        toast('Kijelentkezve');
        openLoggedOutAuthGate();
      }
      return;
    }

    const authSetting=event.target.closest('[data-setting^="auth-"]');
    if(authSetting){
      event.preventDefault();
      event.stopImmediatePropagation();
      const type=authSetting.dataset.setting;
      if(type==='auth-security')securitySheet();
      else accountSheet();
      return;
    }
  },true);

  function openCurrentOnboardingStep(onboarding=onboardingState()){
    if(onboarding.required&&!onboarding.completed)resetIncompleteOnboardingProgress();
    welcomeSheet();
  }

  function ensureOnboardingVisible(){
    const onboarding=onboardingState();
    const authGate=isAuthGateActive();
    if(!onboarding.required&&!authGate)return;
    const activeSheet=document.getElementById('sheet');
    const body=document.getElementById('sheetBody');
    const sheetVisible=activeSheet?.classList.contains('open')&&activeSheet.getAttribute('aria-hidden')!=='true'&&body&&body.children.length>0;
    setOnboardingLayout(true);
    if(!sheetVisible){
      if(authGate)welcomeSheet();
      else openCurrentOnboardingStep(onboarding);
    }
  }

  function enforceStartup(){
    let onboarding=onboardingState();
    if(onboarding.required){
      resetIncompleteOnboardingProgress();
      onboarding=onboardingState();
      setOnboardingLayout(true);
      safeStopSpeech(false);
      state.route='feed';
      state.autoNext=true;
      state.mic=true;
      saveState();
      openCurrentOnboardingStep(onboarding);
      return;
    }
    if(isAuthGateActive()){
      setOnboardingLayout(true);
      safeStopSpeech(false);
      state.route='feed';
      saveState();
      welcomeSheet();
      return;
    }
    setOnboardingLayout(false);
    if(authState().loggedIn&&isSubscriptionReady()&&!sessionStorage.getItem(LAUNCH)){
      sessionStorage.setItem(LAUNCH,'1');
      startCarExperience(true);
      return;
    }
  }

  window.hirbeszedEnsureOnboardingVisible=ensureOnboardingVisible;
  setTimeout(enforceStartup,0);
  setInterval(ensureOnboardingVisible,350);
  window.addEventListener('resize',()=>setTimeout(ensureOnboardingVisible,0));
})();
