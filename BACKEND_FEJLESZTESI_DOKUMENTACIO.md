# Hirbeszed backend fejlesztesi dokumentacio

Aktualis prototipusverzio: **2.1**
Letrehozva: **2026-07-03**
Cel: a prototipusban megjeleno, kesobb backendben is kotelezo szabalyok egy helyen legyenek nyilvantartva.

Ez nem jogi dokumentum es nem vegleges API-terv. Ez a projekt munkadokumentuma: amikor a prototipusban olyan funkcio, validacio, jogosultsag, adatkezeles vagy biztonsagi dontes keszul, amelyet a kesobbi backendnek is tudnia kell, ezt a fajlt is frissiteni kell.

## 1. Modositasi szabaly

Minden olyan prototipus-fejlesztesnel frissiteni kell ezt a dokumentumot, amely:

- uj felhasznaloi adatot vezet be;
- regisztracios, belepesi, fiok-, jelszo- vagy kodszabalyt modosit;
- adatvedelmi vagy hasznalati feltetel elfogadasat erinti;
- elofizetesi, probaidos, fizetesi vagy jogosultsagi logikat modosit;
- RSS-forras, hirfeldolgozas, AI-valasz vagy tartalmi hitelesseg szabalyat erinti;
- tobb eszkozos hasznalatot, sessiont, tokent vagy biztonsagi korlatot erint;
- olyan frontend-validaciot ad, amelyet backendben is meg kell ismetelni.

Csak vizualis valtozasnal nem kotelezo frissiteni ezt a dokumentumot. Pelda: gombszin, ikon, kartyaelrendezes, animacio, spacing.

## 2. Statuszjeloles

A szabalyok statusza:

- **Backend-kotelezo**: a vegleges appban szerveroldalon vagy menedzselt hatterszolgaltatasban is ellenorizni kell.
- **Frontend + backend**: a frontend segit es elore jelez, de a backend a hiteles dontesi pont.
- **Backend/aruhaz**: App Store, Google Play vagy backend jogosultsagi rendszer adja a hiteles allapotot.
- **Nyitott dontes**: kesobb kell veglegesiteni.
- **Csak prototipus**: tesztelesi segedeszkoz, nem kerul igy eles appba.

## 3. Hitelesites es adatvedelem

| ID | Szabaly | Statusz | Megjegyzes |
| --- | --- | --- | --- |
| AUTH-001 | A kezdooldali adatvedelmi tajekoztato es hasznalati feltetelek elfogadasa nelkul nem indulhat tovabb az onboarding. | Frontend + backend | A frontend modal hibaval blokkol. Kesobb backendben fiokhoz kell rogziteni. |
| AUTH-002 | A "Mar van fiokom, belepek" gomb is az elfogadasi kapu ala tartozik. | Frontend + backend | Belepesnel is igazolni kell, hogy a felhasznalo elfogadta az aktualis szabalyzatot. |
| AUTH-003 | Az elfogadas erteket kesobb fiokhoz kell kotni szabalyzatverzioval es idobelyeggel. | Backend-kotelezo | Javasolt mezok: `policyVersion`, `acceptedAt`, `acceptedFrom`, `userId`. |
| AUTH-004 | A regisztracios es belepesi aloldalak nem ismetlik meg a pipareszt. | Frontend + backend | A kezdooldali elfogadas tovabbvitt onboarding-allapot. |
| AUTH-005 | Email-only regisztracios irany ervenyes. | Backend-kotelezo | Telefonszamos/SMS-es regisztracio nincs az aktualis MVP-iranyban. |
| AUTH-006 | Google, Facebook es Apple folytatas hivatalos szolgaltatoi hitelesitest igenyel. | Backend-kotelezo | A prototipus csak latvany es folyamat. Elesben OAuth/provider token ellenorzes kell. |
| AUTH-007 | Fiokosszekapcsolasnal ujrahitelesites kell. | Backend-kotelezo | Apple/Google/Facebook/email kapcsolasnal kulon biztonsagi dontes. |
| AUTH-008 | Emailes belepesnel email es jelszo kotelezo. | Frontend + backend | A frontend mezohibat mutat, de a backend donti el a hiteles belepest. |
| AUTH-009 | Sikertelen email/jelszo parosnal altalanos hibauzenet kell. | Backend-kotelezo | Ne deruljon ki, hogy az email cim letezik-e. |
| AUTH-010 | Tul sok sikertelen belepesi probalkozast backend oldalon is korlatozni kell. | Backend-kotelezo | Rate limit, ideiglenes zarolas vagy mas vedelem kell. Pontos idozites kesobb dontendo. |
| AUTH-011 | Megerositetlen email, zarolt/tiltott/torles alatti fiok kulon backend-allapot. | Backend-kotelezo | A frontend modalban mutatja, de a hiteles allapotot backend adja. |
| AUTH-012 | Belepesnel halozati vagy szerverhiba kulon hibakodot kap. | Backend-kotelezo | Ne keveredjen a hibas jelszo es a szolgaltatasi hiba. |
| AUTH-013 | Jelszo-visszaallitasnal ervenyes email formatum kell, de a sikeres valasz nem arulhatja el, hogy a fiok letezik-e. | Backend-kotelezo | Account enumeration elleni szabaly. Ervenyes formatumnal altalanos sikeruzenet adando. |
| AUTH-014 | Jelszo-visszaallitasi kerelmeket backend oldalon is rate limitelni kell. | Backend-kotelezo | Ved tul gyakori emailkuldes, visszaeles es brute force ellen. Pontos idozites kesobb dontendo. |
| AUTH-015 | Zarolt, tiltott vagy torles alatti fiok jelszo-visszaallitasi allapotat a backend donti el. | Backend-kotelezo | A frontend csak szimulalja a nem hasznalhato fiokot. |
| AUTH-016 | A jelszo-visszaallito link/token backend oldalon generalando, idokorlatos es egyszer hasznalhato legyen. | Backend-kotelezo | Emailkuldesi/szerverhibat kulon kell kezelni a hibas email formatumtol. |
| AUTH-017 | Kijelentkezes utan auth-zar kovetkezik, nem kulon kijelentkezett fiokpanel. | Frontend + backend | Az app menut rejt es az udvozlo/belepesi kepernyot mutatja. A kliens torli a helyi fiokhoz kotott allapotot, de a szerveroldali profil- es jogosultsagi adatok megmaradnak. |
| AUTH-018 | Egy Hirbeszed felhasznaloi profilhoz tobb hitelesitesi azonossag kapcsolhato: email, Google, Facebook es Apple. | Backend-kotelezo | A backendben a felhasznaloi profil es a belepesi azonossag kulon entitas legyen; javasolt kulcs: `provider` + `providerUserId`. |
| AUTH-019 | Ha egy uj kozossegi belepes ellenorzott email cime egyezik egy meglevo fiokeval, a rendszer csak osszekapcsolasi lehetoseget ismerhet fel, csendben nem fuzheti ossze a fiokokat. | Frontend + backend | Pelda: korabbi Facebook belepes utan Google belepes ugyanazzal az ellenorzott emaillel. A felhasznalonak egyertelmu megerositesi folyamatot kell kapnia. |
| AUTH-020 | Fiokosszekapcsolas csak felhasznaloi jovahagyassal es biztonsagos megerositessel tortenhet. | Backend-kotelezo | Elfogadhato megerosites: aktiv bejelentkezett allapotbol inditott kapcsolas, ujrahitelesites, vagy emailes megerosito kod. |
| AUTH-021 | Apple Hide My Email vagy mas privat/relay email eseten nem szabad email-egyezes alapjan automatikus osszekapcsolast vegezni. | Backend-kotelezo | Ilyenkor csak explicit, bejelentkezett fiokbol inditott kapcsolas vagy kulon megerositesi folyamat engedelyezheto. |
| AUTH-022 | Meglevo social belepessel letrejott profilhoz emailes belepesi mod kapcsolhato uj profil letrehozasa nelkul. | Frontend + backend | Ugyanaz az email + jelszo + 6 jegyu email kod szabalykeszlet ervenyes, mint emailes regisztracional. A prototipus ezt `add-email-login` modban hasznalja ujra. |
| AUTH-023 | Legalabb egy mukodo belepesi azonossagnak mindig maradnia kell. | Backend-kotelezo | Az utolso kapcsolt belepesi mod nem valaszthato le. A frontend modal hibaval jelez, de a tiltast backend oldalon is ervenyesiteni kell. |
| AUTH-024 | Fiok torlese nem kijelentkezes, hanem szerveroldali fioktorlesi folyamat. | Backend-kotelezo | Megerosites, jogosultsag-ellenorzes, audit allapot, vegfelhasznaloi veglegessegi figyelmeztetes, kapcsolt belepesi azonossagok kezelese, felhasznaloi preferenciak/RSS/erdeklodesi profil torlese vagy adatmegorzesi szabaly szerinti kezelese kell. |
| AUTH-025 | Fioktorles elott aktiv App Store / Google Play elofizetes eseten aruhazi lemondasi figyelmeztetes es entitlement-ellenorzes kell. | Backend/aruhaz | A fiok torlese onmagaban nem tekintheto az aruhazi szamlazas automatikus megszuntetesenek. A backendnek es/vagy jogosultsagi rendszernek ellenoriznie kell az aktiv aruhazi allapotot, es a felhasznalot az aruhazi lemondasra kell vezetni. |

## 4. Onboarding es hozzaferesi kapu

| ID | Szabaly | Statusz | Megjegyzes |
| --- | --- | --- | --- |
| ONB-001 | Amig az elso onboarding nincs teljesen befejezve, minden uj betoltes az udvozlo/regisztracios kezdokepernyorol indul. | Frontend + backend | Nem lehet tartos visszateresi pont a felkesz belepes, regisztracio, kod, csomag vagy RSS oldal. |
| ONB-002 | Teljes onboarding feltetele: sikeres fiok/belepes, csomagvalasztas, RSS-forrasok mentese, belso appfelulet megnyitasa. | Frontend + backend | Backendben kesobb `onboardingCompletedAt` vagy hasonlo allapot kell. |
| ONB-003 | Onboarding alatt semmilyen kijelzonezetben nem jelenhet meg appmenu. | Frontend + backend | Biztonsagi/hozzaferesi kockazatot csokkent. |
| ONB-004 | Belso appban ures vagy hibas allapot eseten legyen menekulo ut a Beallitasok fele. | Frontend + backend | Ez inkabb helyreallitasi szabaly, de eles appban is hasznos. |

## 5. Regisztracios mezok

| ID | Szabaly | Statusz | Megjegyzes |
| --- | --- | --- | --- |
| REG-001 | Nev kotelezo. | Frontend + backend | Ures nevvel nem indulhat regisztracio. |
| REG-002 | Nev hossza 2-80 karakter. | Frontend + backend | Backendben is ellenorizni kell. |
| REG-003 | Nev tartalmazhat betut, szamot, szokozt, kotojelet es aposztrofot. | Frontend + backend | Szam megengedett. |
| REG-004 | Email kotelezo. | Frontend + backend | Ures email nem fogadhato el. |
| REG-005 | Email maximum 254 karakter es ervenyes email formatum. | Frontend + backend | A frontend csak segit; backend az ervenyes dontes. |
| REG-006 | Jelszo kotelezo. | Frontend + backend | Ures jelszo nem fogadhato el. |
| REG-007 | Jelszo legalabb 8 karakter. | Frontend + backend | Minimum biztonsagi szabaly. |
| REG-008 | Jelszoban kell kisbetu, nagybetu, szam es kulonleges karakter. | Frontend + backend | A frontend ellenorzo listat mutat, backendnek is meg kell kovetelnie. |
| REG-009 | Sikertelen submitnal az elso hibas mezore kell fokuszt adni. | Frontend | Hozzaferhetosegi es UX szabaly. Backendhez csak a hibakodok kapcsolodnak. |
| REG-010 | Email egyediseget backend ellenorzi. | Backend-kotelezo | A prototipusban nincs valodi felhasznaloi adatbazis. |

## 6. Email kod es ketlepcsos azonositas

| ID | Szabaly | Statusz | Megjegyzes |
| --- | --- | --- | --- |
| CODE-001 | A megerosito kod 6 szamjegy. | Frontend + backend | A prototipusban a mezo csak szamot enged es 6 jegy utan mutat gombot. |
| CODE-002 | Kodmezobe csak szam irhato. | Frontend + backend | Backend csak numerikus, aktualis kodot fogadjon el. |
| CODE-003 | A megerosites gomb csak 6 szamjegy utan jelenjen meg. | Frontend | UX szabaly, de backend ettol fuggetlenul ellenoriz. |
| CODE-004 | A kodot backend generalja, kuldi es ellenorzi. | Backend-kotelezo | A prototipus jelenleg nem kuld valodi emailt. |
| CODE-005 | Kodnak legyen lejarati ideje. | Backend-kotelezo | Pontos ido kesobb dontendo. |
| CODE-006 | Hibas kod, lejart kod es tul sok probalkozas kulon hibat kap. | Backend-kotelezo | Frontend modal rendszeruzenetben jeleniti meg. |
| CODE-007 | Ketlepcsos azonositas allapota backendben tarolando. | Backend-kotelezo | A beallitasokban jelenleg csak prototipus-szintu. |
| CODE-008 | Kod ujrakuldeset backend oldalon is korlatozni kell. | Backend-kotelezo | Tul gyakori ujrakuldes ne indithasson uj emailt. Pontos cooldown kesobb dontendo. |
| CODE-009 | Kodellenorzes csak aktiv, ervenyes regisztracios vagy belepesi folyamatban tortenhet. | Backend-kotelezo | Hianyzo, lejart vagy ervenytelen pending session eseten a kod nem fogadhato el. |
| CODE-010 | Sikertelen kodkuldes kulon hibat kap. | Backend-kotelezo | Pelda: email provider hiba, halozati hiba, rate limit. A frontend modal hibat mutat. |
| CODE-011 | Tul sok hibas vagy lejart kodprobalkozas utan a kodfolyamat zarolando, amig uj kod vagy uj folyamat nem indul. | Backend-kotelezo | A probalkozasi limit pontos erteke kesobb dontendo. |
| CODE-012 | Emailes fioknal a ketlepcsos azonositas alapertelmezetten bekapcsolt. | Frontend + backend | Prototipus reset utan is bekapcsolt. A felhasznalo kesobb kikapcsolhatja. |
| CODE-013 | Emailes belepesnel sikeres email + jelszo utan a 2FA allapot dont a kodoldalrol. | Frontend + backend | Bekapcsolva: `Belepes megerositese` kodoldal; kikapcsolva: kozvetlen belepes. A `Ketlepcsos vedelem` kapcsolo ugyanennek a fiokallapotnak a feluleti vezerloje. |
| CODE-014 | Kozossegi belepesnel a Hirbeszed nem ker kulon emailes 2FA kodot. | Frontend + backend | Google/Facebook/Apple esetben a szolgaltatoi hitelesites vedelme ervenyes. |
| CODE-015 | A ketlepcsos vedelem menuben nincs helyreallito kod opcio az aktualis MVP-ben. | Frontend | Csak az emailes kodos azonositas kapcsoloja latszik. |

## 7. Rendszeruzenet es hibakezeles

| ID | Szabaly | Statusz | Megjegyzes |
| --- | --- | --- | --- |
| ERR-001 | Folyamatot megakaszto hibara app-szintu modalis rendszeruzenet kell. | Frontend + backend | Pelda: hibas email, hibas/lejart kod, tul sok probalkozas, halozati hiba. |
| ERR-002 | Modal aktiv allapotban az app hatterinterakcioi fel vannak fuggesztve. | Frontend | Desktop prototipusban a meretezo es viewport teszteszkozok kivetelt kapnak. |
| ERR-003 | Mezohibanal a mezo korall hibajelzest es `aria-invalid` allapotot kap. | Frontend | Backend hibakod alapjan is ugyanilyen mezoallapot jelenhet meg. |
| ERR-004 | Nem blokkolo siker/infouzenet fejlec-ertesiteskent jelenik meg, nem also toastkent. | Frontend | Csak akkor kell, ha a feluletvaltozas onmagaban nem eleg. |
| ERR-005 | Felolvaso oldalon nincs nem blokkolo toast/felugro. | Frontend | Vezetes/passziv hallgatas miatt csak tenylegesen fontos hiba szakithat meg. |
| ERR-006 | Backend API hibaknak rovid, felhasznalhato hibakodot kell adniuk. | Backend-kotelezo | Pelda: `invalid_email`, `code_expired`, `too_many_attempts`, `network_error`. |

## 8. Eszkoz, session es tokenhasznalat

| ID | Szabaly | Statusz | Megjegyzes |
| --- | --- | --- | --- |
| SES-001 | Egy Hirbeszed-fiok egyszerre csak egy aktiv eszkozon hasznalhatja az appot. | Backend-kotelezo | Ingyenes, fizetos, probaidos es AI funkciokra is vonatkozik. |
| SES-002 | Backend tartja nyilvan az `activeDeviceId`, `activeSessionId` es heartbeat adatokat. | Backend-kotelezo | A prototipus csak szimulal. |
| SES-003 | Masik eszkoz nyitasakor atveteli folyamat kell. | Backend-kotelezo | Uj eszkoz jovahagyas utan aktiv, regi eszkoz levalasztott. |
| SES-004 | A szabaly celja az elofizetes, probaido, AI- es hangszolgaltatasi eroforrasok parhuzamos fogyasztasanak megakadalyozasa. | Backend-kotelezo | Nem bunteto logika, hanem jogosultsagvedelem. |
| SES-005 | Kliensoldali localStorage nem lehet hiteles jogosultsagi vagy session-forras. | Backend-kotelezo | Eles appban token/session validacio kell. |

## 9. Elofizetes, probaido es fizetes

| ID | Szabaly | Statusz | Megjegyzes |
| --- | --- | --- | --- |
| SUB-001 | Ingyenes csomag nem elofizetes, hanem alap hozzaferesi szint. | Backend/aruhaz | Nincs aruhazi elofizetesi folyamat hozza. |
| SUB-002 | AI Felolvaso es AI Asszisztens fizetos jogosultsag. | Backend/aruhaz | App Store / Google Play es backend szinkron kell. |
| SUB-003 | 14 napos AI Felolvaso proba egyszer jarhat egy regisztralt felhasznalonak. | Backend-kotelezo | Ujratelepites, cache torles, masik eszkoz, kijelentkezes nem indithat uj probat. |
| SUB-004 | Probaido jogosultsagot backend vagy aruhazi rendszer donti el. | Backend/aruhaz | Kliensoldali allapot nem hiteles forras. |
| SUB-005 | Ingyenes/lejart/sikertelen fizetes allapotban a Hirfolyam elerheto marad. | Backend-kotelezo | AI funkciok ilyenkor zaroltak vagy promo modban mukodnek. |
| SUB-006 | AI Felolvaso aktiv csomag/proba es AI Asszisztens aktiv csomag mas indulooldalt ad. | Frontend + backend | Indulas: free/expired/payment_failed -> Hirfolyam; reader/trial -> Felolvaso; assistant -> Asszisztens. |
| SUB-007 | AI Asszisztens heti 5 kerdeses proba csak AI Felolvaso elofizetoknek jarhat. | Backend-kotelezo | Heti nullazas pontos szabaly meg nyitott. |
| SUB-008 | Felfele csomagvaltas azonnal eletbe lephet. | Backend/aruhaz | AI Felolvaso -> AI Asszisztens. |
| SUB-009 | Lefele csomagvaltas vagy lemondas a jogosultsagi idoszak vegehez kotott. | Backend/aruhaz | Addig a mar kifizetett funkcio elhet. |
| SUB-010 | Sikertelen fizetesnel egyertelmu javitasi ut kell a Csomagok es elofizetes oldalon. | Backend/aruhaz | Eles appban aruhazi fizetesi beallitasokhoz vezethet. |
| SUB-011 | Vasarlas-visszaallitas backend/aruhaz jogosultsagszinkront indit. | Backend/aruhaz | Prototipusban csak szimulalt. |
| SUB-012 | Promo megjelenesek jogosultsag szerint korlatozottak. | Frontend + backend | AI Asszisztens elofizetonek ne jelenjen meg tovabbi elofizetesi promo. |

## 10. RSS, hirfolyam es tartalom

| ID | Szabaly | Statusz | Megjegyzes |
| --- | --- | --- | --- |
| RSS-001 | Vegleges appban a Hirfolyamot backend/API adja, az app kesz hirlistat vesz at. | Backend-kotelezo | A prototipus jelenleg `news.json` pillanatkepbol dolgozik. |
| RSS-002 | RSS-forrasok kivalasztasa es mentese felhasznaloi profilhoz tartozik. | Backend-kotelezo | Onboarding es Beallitasok ugyanazt a logikat hasznalja. |
| RSS-003 | Legalabb egy RSS-forras maradjon bekapcsolva. | Frontend + backend | Onboardingban is ervenyes. |
| RSS-004 | Uj RSS-forras URL-jet validalni kell. | Backend-kotelezo | URL, elerhetoseg, feed-formatum, tartalom-biztonsag. |
| RSS-005 | Egy hibas RSS-forras nem allithatja le a teljes frissitest vagy a Felolvasot. | Backend-kotelezo | Forrasonkenti hibakezeles kell. |
| RSS-006 | Eredeti link es forras megorzendo. | Backend-kotelezo | Megjeleniteshez, hitelesseghez es forrasmegjeloleshez kell. |
| RSS-007 | A Felolvaso nem olvassa fel az URL-t. | Frontend | Tartalmi/UX szabaly. |
| RSS-008 | RSS-bol hianyzo reszleteket az app nem talalhat ki. | Backend-kotelezo | AI es hirfeldolgozas oldalon is ervenyes. |
| RSS-009 | Duplikacio szurese GUID vagy normalizalt URL alapjan, kesobb szigorubb cimhasonlosaggal. | Backend-kotelezo | Pontos algoritmus kesobb tervezendo. |

## 11. Asszisztens es AI

| ID | Szabaly | Statusz | Megjegyzes |
| --- | --- | --- | --- |
| AI-001 | A jelenlegi Asszisztens szabalyalapu prototipus, nem hiv valodi AI API-t. | Csak prototipus | Kesobb backend/AI provider valthatja ki. |
| AI-002 | AI valasz nem allithat ellenorizetlen tenyt hirnek. | Backend-kotelezo | Forras es datum hasznalata fontos. |
| AI-003 | Hianyos RSS-tartalomnal az Asszisztens nem talalhat ki reszleteket. | Backend-kotelezo | Inkabb jelezze, hogy nincs eleg informacio. |
| AI-004 | Tobb forras eseten az eltereseket jelezni kell. | Backend-kotelezo | Kulonosen hirertelmezesnel fontos. |
| AI-005 | Asszisztens promo mod csak elofizetesi temakra valaszolhat. | Frontend + backend | Nem adhat teljes hirasszisztens elmenyt jogosultsag nelkul. |
| AI-006 | AI- vagy mas szolgaltatoi titkos kulcs nem epitheto a mobilappba. | Backend-kotelezo | Menedzselt titoktarolo es serverless/API reteg kell. |
| AI-007 | AI-hasznalat, tokenfogyasztas es kerdeslimitek backendben merendok. | Backend-kotelezo | Kulonosen probaido, heti 5 kerdes es fizetos csomagok miatt. |

## 12. Felhasznaloi profil es szinkron

| ID | Szabaly | Statusz | Megjegyzes |
| --- | --- | --- | --- |
| PROF-001 | Olvasott hirek, kedvelesek, elozmenyek es szemelyre szabasi profil jelenleg helyben tarolt. | Csak prototipus | Kesobb opcionalis szinkron lehet. |
| PROF-002 | Forrasok es temak felhasznaloi beallitasok. | Backend-kotelezo | Ha tobb eszkoz vagy fiokszintu elmeny kell, backend/profil tarolja. |
| PROF-003 | Erdeklodesi profil torlese ne toroljon fiokot vagy elofizetest. | Frontend + backend | Csak szemelyre szabasi/adatprofil torles. |
| PROF-004 | Helyi cache torlese nem adhat uj probaidot vagy jogosultsagot. | Backend-kotelezo | Probaido es elofizetes backend/aruhaz alapjan dol el. |
| PROF-005 | Belepes utan a backend adja vissza a felhasznalo mentett appallapotat. | Backend-kotelezo | Elofizetes, RSS-forrasok, temak, erdeklodesi profil, olvasasi/kedvelesi allapotok, megjelenes, hang, fiokbiztonsag es kapcsolt fiokok. |
| PROF-006 | Masik eszkozon belepve ugyanazt a szemelyes allapotot kell latni. | Backend-kotelezo | A kliens helyi tarolasa nem lehet hiteles forras; szinkronizalt fiokprofil kell. |
| PROF-007 | Kijelentkezeskor a kliens torolje a helyi fiokhoz kotott allapotot. | Frontend + backend | Ne maradjon elozo felhasznalotol csomag, RSS, tema, erdeklodesi profil, olvasasi/kedvelesi allapot, beallitas vagy 2FA allapot a kovetkezo belepeshez. |

## 13. Csak prototipus teszteszkozok

Ezek a szabalyok kifejezetten a kattinthato prototipus gyors teszteleset szolgaljak. Nem termekfunkciok, nem vegleges frontend-kovetelmenyek es nem backend-kovetelmenyek.

| ID | Szabaly | Statusz | Megjegyzes |
| --- | --- | --- | --- |
| PROTO-001 | Automatikus adatfeltoltes kapcsolo a Beallitasok / Prototipus menuben. | Csak prototipus | Alapertelmezetten bekapcsolt tesztsegedezkoz. A kepernyokon nincs kulon gomb vagy jelzes, csak a menu kapcsoloja. |
| PROTO-002 | Ha az automatikus adatfeltoltes aktiv, a prototipus szabalyos tesztadatokat ir az ures mezokbe azokon az oldalakon, ahol adat kell a tovabblepeshez. | Csak prototipus | Pelda: fiok letrehozasa, belepes, jelszo-visszaallitas, megerosito kod, RSS URL hozzaadas. Nem kerulhet eles appba. |
| PROTO-003 | Az automatikus adatfeltoltes nem kerulheti meg a validaciot. | Csak prototipus | Csak olyan adatot tolthet be, amely megfelel az aktualis frontend-validacios szabalyoknak. |
| PROTO-004 | Az automatikus adatfeltoltes kapcsolo erteket a Prototipusadatok torlese nem modositja. | Csak prototipus | Ez prototipus-kornyezeti beallitas, ezert reset utan is megmarad a felhasznalo altal beallitott bekapcsolt vagy kikapcsolt allapot. |
| PROTO-005 | Az email-kod prototipus tesztkodjai es idozitesei nem termek- vagy backend-szabalyok. | Csak prototipus | Teszt siker kod: `123456`; lejart kod szimulacio: `000000`; a prototipus 5 perc lejaratot, 3 probalkozast es 15 masodperces ujrakuldesi korlatot szimulal. |
| PROTO-006 | Az emailes belepes prototipus tesztadatai es tesztcimei nem termek- vagy backend-szabalyok. | Csak prototipus | Siker: `teszt.prototipus@example.com` / `Hirbeszed1!`; megerositetlen: `nincs.megerositve@example.com`; zarolt: `zarolt.fiok@example.com`; szerverhiba: `szerverhiba@example.com`. |
| PROTO-007 | A jelszo-visszaallitas prototipus tesztcimei es idozitesei nem termek- vagy backend-szabalyok. | Csak prototipus | Sikeres reset szimulacio: barmely ervenyes email; zarolt: `zarolt.fiok@example.com`; szerverhiba: `szerverhiba@example.com`; tul gyors ujrakeres: 15 masodperces prototipus-korlat. |

## 14. Csak dizajn vagy UX, backendbe nem kell atvinni

Ezeket altalaban nem kell backend-szabalykent kezelni:

- gombok szine, merete, lekerekitese;
- kozossegi gombkeszlet vizualis stilusa;
- kozossegi gombok elhelyezese a kezdokepernyon vagy a belepesi oldalon;
- belepesi oldal informacios kartyaszovege;
- visszagomb SVG ikonvaltozata;
- onboarding kartya szovegei es chipjei;
- foldable/spacer/safe-area finomitasok;
- header-toast animacio es vizualis megjelenese;
- kartyak, listak, ikonok, spacing es tema megjelenese.

Kivetel: ha egy dizajnelem hozzaferesi vagy biztonsagi kapu szerepet kap, akkor a mogotte levo szabaly backend-kotelezo lehet. Pelda: adatvedelmi pipa, onboarding alatti menu tiltasa.

## 15. Nyitott dontesek

- Ha telefonszamos/SMS-es hitelesites kesobb megis visszakerulne, azt kulon termek- es backenddonteskent kell felvenni.
- Pontos email-kod lejarati ido.
- Pontos probalkozasi limit kodellenorzesnel.
- A heti 5 kerdeses Asszisztens proba nullazasa: naptari het vagy elso hasznalattol szamitott 7 nap.
- App Store / Google Play kezeli-e teljesen a 14 napos probat, vagy sajat backend is tarol hiteles jogosultsagot.
- Lesz-e webes elofizetes, vagy csak aruhazi elofizetes.
- Lesz-e csaladi vagy tobbeszkozos csomag.

## 16. Valtozasi naplo

### 2026-07-04 - Fioktorles es aruhazi elofizetes lemondas

- A fioktorlesi folyamat kiegeszult az App Store / Google Play elofizetes kulon lemondasi figyelmeztetesevel.
- Rogzitve lett, hogy aktiv fizetos vagy proba elofizetes eseten a prototipus elobb `Elofizetes lemondasa` modalt mutat, es csak a felhasznaloi ellenorzes utan engedi a vegleges fioktorlesi megerositest.
- Backend szinten az aktiv aruhazi entitlement allapot ellenorzese es az aruhazi lemondasra vezetes kotelezo, mert a fiok torlese onmagaban nem szunteti meg biztosan az aruhazi szamlazast.
- Bekerult az AUTH-025 szabaly.

### 2026-07-04 - Fiokadat magyarazat es fiok torlese

- A prototipus Fiok es biztonsag oldalan a fiokadat osszefoglalo es a kapcsolt belepesi modok magyarazata pontosabb lett.
- A jelenlegi munkamenet jelzese kulon sor lett, nem keveredik a `Kapcsolva` allapottal.
- A `Fiok torlese` muvelet kulon veszelyzonaba kerult, globalis modalis megerositessel.
- Rogzitve lett, hogy a fioktorles backend oldalon nem kijelentkezes, hanem kulon szerveroldali torlesi folyamat.
- Bekerult az AUTH-024 szabaly.
- 2026-07-04 kesobbi pontositas: a fioktorles modalja vegfelhasznaloi, veglegessegi figyelmeztetest mutasson, fejlesztoi/prototipusos szoveg nelkul; a kijelentkezes es fioktorles szovegben is kulonuljon el.

### 2026-07-04 - Fiok es biztonsag belepesi modok oldala

- A prototipus Fiok es biztonsag oldala egyoldalas belepesi mod kartyas felulet lett.
- A regi kulon Profiladatok es Kapcsolt fiokok almenuk kikerultek az aktiv folyamatbol.
- Rogzitve lett, hogy social belepessel letrejott profilhoz emailes belepesi mod kapcsolhato ugyanazzal az email/jelszo/kod szabalykeszlettel, uj profil letrehozasa nelkul.
- Rogzitve lett, hogy az utolso mukodo belepesi azonossag nem valaszthato le.
- Bekerult az AUTH-022 es AUTH-023 szabaly.

### 2026-07-04 - Kozossegi fiokok biztonsagos osszekapcsolasa

- Veglegesitve lett a fiokosszekapcsolasi szabaly email, Google, Facebook es Apple belepes kozott.
- Egy Hirbeszed-profilhoz tobb hitelesitesi azonossag kapcsolhato, de a szolgaltatoi fiokokat nem szabad csendben, automatikusan osszefesulni.
- Azonos es ellenorzott email alapjan a rendszer felismerheti az osszekapcsolasi lehetoseget, de a felhasznaloi jovahagyas es biztonsagos megerosites kotelezo.
- Apple Hide My Email / relay email eseten kulon ovatos szabaly ervenyes: automatikus email-alapu osszekapcsolas tilos.
- Bekerult az AUTH-018, AUTH-019, AUTH-020 es AUTH-021 szabaly, es kikerult a kapcsolodo nyitott dontes.

### 2026-07-04 - Kijelentkezes fiokhoz kotott helyi adatreset

- A korabbi szabaly pontosodott: kijelentkezeskor az auth-zar mellett a kliens torli a helyi fiokhoz kotott appallapotot.
- A torles celja, hogy masik fiok belepesekor ne keveredjen a korabbi felhasznalo frontendben maradt allapota a backendbol visszatoltott adatokkal.
- A szerveroldali felhasznaloi profil, jogosultsag es preferencia tovabbra is megmarad; belepes utan a backend a hiteles visszatoltesi forras.
- Frissult az AUTH-017 szabaly, es bekerult a PROF-007 szabaly.

### 2026-07-03 - Emailes 2FA alapertelmezett bekapcsolasa

- Az emailes fiokoknal a ketlepcsos azonositas alapertelmezetten bekapcsolt lett.
- Emailes belepesnel sikeres email + jelszo utan a 2FA allapot dont: bekapcsolva kodoldal, kikapcsolva kozvetlen belepes.
- Kozossegi belepesnel nincs kulon Hirbeszed emailes 2FA kod.
- A Ketlepcsos vedelem menubol kikerult a helyreallito kod opcio.
- Bekerult a CODE-012, CODE-013, CODE-014 es CODE-015 szabaly.

### 2026-07-03 - Kijelentkezes utani auth-zar es profil-visszatoltes

- Kijelentkezes utan az app auth-zarat mutat, nem kijelentkezett fiokpanelt.
- Ezt a 2026-07-04-es szabaly pontositotta: a kliens kijelentkezeskor mar torli a helyi fiokhoz kotott allapotot, mikozben a szerveroldali profil megmarad.
- Belepes utan a backendbol kell visszatolteni a felhasznalo teljes mentett appallapotat.
- Bekerult az AUTH-017, PROF-005 es PROF-006 szabaly.

### 2026-07-03 - Jelszo-visszaallitas hibakezeles

- Bekerult az AUTH-013, AUTH-014, AUTH-015 es AUTH-016 szabaly.
- Rogzitve lett, hogy a jelszo-visszaallitas sikeruzenete nem arulhatja el, hogy az email cimhez tartozik-e fiok.
- Rogzitve lett, hogy a reset link/token generalasa, lejarta, egyszeri hasznalata es kuldese backend-kotelezo.
- Bekerult a PROTO-007 szabaly: a reset tesztcimei es a 15 masodperces prototipus-korlat csak szimulaciok.

### 2026-07-03 - Emailes belepes hibakezeles

- Bekerult az AUTH-008, AUTH-009, AUTH-010, AUTH-011 es AUTH-012 szabaly.
- Rogzitve lett, hogy a login mezovalidacio frontendben segit, de a hiteles belepesi dontes backend-kotelezo.
- Rogzitve lett, hogy a hibas email/jelszo parosnal altalanos hibauzenet kell, hogy a fiok letezese ne deruljon ki.
- Bekerult a PROTO-006 szabaly: az emailes belepes tesztadatai es tesztcimei csak prototipus-szimulaciok.

### 2026-07-03 - Email kod hibakezeles es modalok

- Bekerult a CODE-008, CODE-009, CODE-010 es CODE-011 szabaly.
- Rogzitve lett, hogy a kod ujrakuldese, a pending folyamat ervenyessege, a kuldesi hiba es a probalkozasi zarolas backend oldalon is kotelezo.
- Bekerult a PROTO-005 szabaly: a `123456` es `000000` tesztkodok, valamint a prototipus idozitesei csak tesztelesi szimulaciok.

### 2026-07-03 - Csak prototipus automatikus adatfeltoltes

- Bekerult a PROTO-001, PROTO-002 es PROTO-003 szabaly.
- Rogzitve lett, hogy az automatikus adatfeltoltes csak prototipus-teszteszkoz.
- Rogzitve lett, hogy nem vegleges frontend-kovetelmeny es nem backend-kovetelmeny.
- Bekerult a PROTO-004 szabaly: a Prototipusadatok torlese nem modositja az automatikus adatfeltoltes kapcsolo erteket.

### 2026-07-03 - Dokumentacios audit es email-only tisztitas

- A termekspecifikacioban es az elofizetesi szabalyzatban tisztitva lettek a regi telefonszamos/SMS-es regisztracios nyomok.
- Rogzitve lett, hogy a jelenlegi MVP-irany e-mailes regisztracio es kozossegi fiokos folytatas.
- Rogzitve lett, hogy minden tovabbi fejlesztes utan dokumentacios audit szukseges.

### 2026-07-03 - Elso backend-szabaly audit

- Letrejott a backend fejlesztesi dokumentacio.
- Bekerultek az eddig prototipusban es dokumentacioban rogzitett backend-kotelezo szabalyok.
- Kulonvalasztva: csak dizajn/UX, frontend + backend, backend/aruhaz, csak prototipus es nyitott dontes.
- Rogzitve lett, hogy minden jovobeli backend-erinto prototipus-fejlesztesnel ezt a fajlt is frissiteni kell.
