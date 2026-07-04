# Hírbeszéd – termék- és működési specifikáció

**Verzió:** 2.1  
**Állapot:** tervezési alap, fejlesztés előtti egyeztetésre  
**Elsődleges nyelv:** magyar  
**Célplatformok:** iPhone, Android, Apple CarPlay, Android Auto

## 1. Termékvízió

A Hírbeszéd egy RSS-alapú hírolvasó, amely két egyenrangú használati módot kapcsol össze:

1. hagyományos, képes és görgethető mobilos hírfolyam;
2. vezetés közben használható, automatikus felolvasás és természetes hangvezérlés.

Az alkalmazás nem saját hírtartalmat gyárt. A felhasználó által engedélyezett RSS-forrásokból dolgozik, megőrzi a hír eredeti forrását és linkjét, valamint egyértelműen jelzi, ha csak az RSS-ben elérhető rövid kivonat áll rendelkezésre.

## 2. Rögzített termékdöntések

- A fő navigáció négy eleme: **Hírfolyam**, **Felolvasó**, **Asszisztens**, **Beállítások**.
- Az alkalmazás induló oldala az aktuális hozzáféréstől függ: ingyenes használat/lejárt próba/sikertelen fizetés esetén Hírfolyam, AI Felolvasó vagy aktív 14 napos próba esetén Felolvasó, AI Asszisztens csomagnál Asszisztens.
- A hírfolyamban nincs hangvezérlés és automatikus felolvasás.
- Az olvasott, meghallgatott és átugrott hír egységesen **olvasott** állapotú.
- A **Kedvelés** az olvasottságtól független állapot.
- A hírfolyam kártyáin a Kedvelés, Megosztás és Olvasott/Olvasatlan gyorsműveletek kompakt, ikon-only vezérlőként jelennek meg a forrás + idő meta sorában, nem növelhetik meg annak magasságát, és egymástól elválasztva kell megjelenniük a biztonságosabb tappolás miatt. A prototípusban a láthatatlan érinthető szélesség 32 px gombonként.
- A hírfolyam normál hírkártyái egységes rácselemek. Az első listaelem nem kap automatikus vezetőhír/kiemelt kártya megjelenést; ilyen eltérés csak külön termékdöntéssel vezethető be.
- A hírfolyam alapértelmezett rendezése fordított időrend: a legfrissebb hír van felül.
- A mobilnetes működés alapértelmezetten engedélyezett.
- A helyi hírekhez csak opcionális, hozzávetőleges helyadatot használunk.
- A hírek, az előzmények és a személyre szabási profil elsődlegesen a készüléken maradnak.
- Nem üzemeltetünk hagyományos saját szervert. A hitelesítéshez, opcionális szinkronhoz és AI-kapcsolathoz menedzselt háttérszolgáltatás használható.
- Egy Hírbeszéd-fiók egyszerre csak egy aktív eszközön használhatja az appot. Ez az ingyenes csomagra, a fizetős csomagokra, a próbaidőkre és minden AI-funkcióra is vonatkozik.
- A telefonos Felolvasó pontosan három nagy vezérlőt tartalmaz. A CarPlay és Android Auto a saját, kötelező médiavezérlőit is megjelenítheti.
- Az előfizetési csomagok, promóhírek, próbaidők és jogosultsági szabályok részletes terméklogikáját az `ELOFIZETESI_SZABALYZAT.txt` rögzíti.
- A Felolvasó és Asszisztens oldalak jobb felső előfizetési CTA gombjainak állapotfüggő feliratát az `ELOFIZETESI_GOMB_MATRIX.md` döntési tábla rögzíti.
- Az előfizetéskezelés központi felülete a `Csomagok és előfizetés` oldal. Ide vezet az első indítás, a menü, a CTA, a promóció, a próba lejárta, a fizetési hiba és a vásárlás-visszaállítás.
- Csomagkártyára kattintva csak kijelölés történik. A prototípusban a jóváhagyó gomb állítja át az állapotot, a végleges appban ez az App Store / Google Play fizetési vagy csomagváltási folyamatát indítja.
- Amíg az első indítási onboarding nincs teljesen befejezve és az app belső felülete nem nyílt meg, új betöltéskor vagy helyreállításkor az onboarding mindig az üdvözlő/regisztrációs képernyőről indul. Félkész belépési, előfizetési vagy RSS-választási oldal nem lehet tartós visszatérési pont.
- Kijelentkezéskor az app auth-zárba kerül és az üdvözlő / belépési képernyőt mutatja, menü nélkül. A kliens ilyenkor törli a helyben tárolt, fiókhoz kötött adatokat, hogy másik fiók belépésekor ne keveredjenek a korábbi felhasználó frontend-adatai a backendből érkező állapottal.
- Bejelentkezés után a backendből visszaáll a felhasználó teljes személyes állapota: előfizetés, RSS-források, témák, érdeklődési profil, olvasási/kedvelési adatok, megjelenési és hangpreferenciák, fiókbiztonsági beállítások és kapcsolt fiókok. Másik eszközön belépve ugyanazt az appélményt kell megkapnia.

## 3. Felhasználói szerepkör

Az első kiadásban egyetlen végfelhasználói szerepkör van. Kiadói vagy szerkesztői felület nem készül.

A felhasználó:

- forrásokat és témákat választ;
- híreket olvas, hallgat, kedvel és keres;
- vezeti saját érdeklődési profilját;
- az asszisztenssel beszélget a betöltött hírekről;
- szabályozza az értesítéseket, adatforgalmat és adatkezelést.

## 4. Alkalmazástérkép

### 4.1. Belépés előtti képernyők

1. Indítóképernyő
2. Rövid termékbemutató
3. Regisztráció és belépés
4. E-mail-cím ellenőrzése
5. Első beállítás
   - témák kiválasztása;
   - ajánlott RSS-források kiválasztása;
   - értesítési preferencia;
   - helyi hírek opcionális engedélyezése;
   - hang és felolvasási sebesség kipróbálása.

### 4.2. Hírfolyam

- Fő hírfolyam
- Téma- és forrásszűrő
- Keresés
- Kedvelt hírek
- Előzmények
- Részletes hírek
- Eredeti cikk megnyitása

### 4.3. Felolvasó

- Aktuális hír és lejátszási állapot
- Hangutasítási mini súgó
- Hangalapú beszélgetés az aktuális hírről
- Hiba- és kapcsolatállapotok

### 4.4. Asszisztens

- Élő hangbeszélgetés
- Gépeléses cset
- Néma mód
- Forrásokkal ellátott válaszok
- Asszisztensi előzmények

### 4.5. Beállítások

- RSS-források
- Témák és érdeklődés
- Értesítések
- Megjelenés
- Hang és felolvasó
- Mobiladat, offline tartalom és tárhely
- Helyi hírek
- Nyelv
- Fiók és biztonság
- Adatvédelem és adatok törlése
- Súgó

A Fiók és biztonság beállítási panel egyoldalas fiókbiztonsági felület. `Fiók adatai` összefoglalót, kapcsolt belépési mód kártyákat, kétlépcsős védelem sort, kijelentkezési műveletet és külön fióktörlési veszélyzónát tartalmaz. A Google/Facebook/Apple kártyák brandelt SVG ikont használnak, az e-mailes belépés saját appikonja megmarad. A régi külön Profiladatok és Kapcsolt fiókok almenü nem része az aktuális iránynak.

## 5. Regisztráció és fiók

### 5.1. Belépési módok

- Apple
- Google
- Facebook
- E-mail

Az iOS-verzióban az Apple-belépés a többi közösségi belépéssel azonos hangsúllyal jelenik meg.

A jelenlegi termékirány e-mail-alapú regisztrációt és közösségi fiókos folytatást használ. Telefonszámos vagy SMS-kódos regisztráció nincs az aktuális MVP-ben.

A közösségi fiókos folytatás a belépés előtti kezdőképernyőn jelenik meg. A külön `Belépés` oldal e-mailes belépési oldal: e-mail cím, jelszó, `Belépés` gomb és `Elfelejtett jelszó` link tartozik hozzá, közösségi gombok és regisztrációs terelő gomb nélkül.

Az e-mailes belépés hibáit külön kell kezelni: hiányzó e-mail cím, hibás e-mail formátum, hiányzó jelszó, sikertelen e-mail/jelszó páros, túl sok próbálkozás, megerősítetlen e-mail cím, zárolt vagy nem használható fiók, valamint hálózati vagy szerverhiba. A sikertelen e-mail/jelszó párosnál a felület ne árulja el, hogy az e-mail cím létezik-e.

A jelszó-visszaállítás a Belépés oldal alfolyamata. A reset kéréshez érvényes e-mail formátum szükséges, de a sikeres visszajelzés nem árulhatja el, hogy az e-mail címhez tartozik-e fiók. A folyamatnak kezelnie kell a hiányzó vagy hibás e-mail címet, túl gyakori kérést, nem használható fiókállapotot, valamint hálózati vagy szerverhibát. Sikeres kérés után a felhasználó visszakerülhet a Belépés oldalra.

E-mailes fiókoknál a kétlépcsős azonosítás alapértelmezett védelem. Bekapcsolt állapotban sikeres e-mail + jelszó után 6 számjegyű e-mail kódot kell kérni. A felhasználó a fiókbiztonsági menüben kikapcsolhatja, de regisztrációnál az e-mail cím megerősítése ettől függetlenül kötelező. Közösségi belépésnél a Hírbeszéd nem kér külön e-mailes 2FA-kódot, mert a Google/Facebook/Apple hitelesítési védelme érvényes.

### 5.2. Ajánlott biztonsági modell

- A közösségi fiókok hitelesítését az adott szolgáltató végzi.
- E-mailes regisztrációnál e-mail-cím ellenőrzése szükséges.
- E-mailes regisztrációnál név, e-mail-cím és jelszó szükséges.
- A jelszó minimum 8 karakter, és tartalmaz kisbetűt, nagybetűt, számot, valamint különleges karaktert.
- A regisztrációt 6 számjegyű e-mailben küldött megerősítő kód zárja.
- Az e-mailes megerősítő kód hibáit külön kell kezelni: hibás kód, lejárt kód, túl sok próbálkozás, túl gyakori újraküldés, sikertelen kódküldés és megszakadt vagy érvénytelen regisztrációs folyamat.
- Ezeknél a folyamatot megakasztó hibáknál egységes modális rendszerüzenet jelenjen meg, és mezőhöz kötött hiba esetén a kódmező is kapjon egyértelmű hibajelzést.
- Új vagy gyanús készüléknél külön megerősítés kérhető.
- A kétlépcsős védelem e-mailes fióknál alapértelmezetten bekapcsolt, de a felhasználó kikapcsolhatja; adminisztrátori rendszer esetén kötelező lehet.
- A munkamenet visszavonható a Fiók és biztonság oldalon.
- A felhasználó az alkalmazáson belül kezdeményezheti a fiók törlését. Ez nem azonos a kijelentkezéssel: külön megerősítést, szerveroldali törlési folyamatot, auditálható állapotot és adatmegőrzési/jogi szabályok szerinti kezelést igényel.

### 5.3. Fiók-összekapcsolás

Azonos személy Apple-, Google-, Facebook- és e-mailes belépése egyetlen Hírbeszéd-profilhoz kapcsolható. A végleges appban a felhasználói profil és a belépési azonosság külön kezelendő: ugyanahhoz a profilhoz több hitelesítési szolgáltató tartozhat.

Ha a felhasználó korábban például Facebookkal lépett be, majd később Google-fiókkal próbál belépni, a rendszer ellenőrzött e-mail egyezés alapján felismerheti, hogy a két belépés valószínűleg ugyanahhoz a személyhez tartozik. Ilyenkor nem történhet csendes automatikus összefésülés: a felhasználónak egyértelmű összekapcsolási megerősítést kell kapnia.

Összekapcsolás előtt újrahitelesítés vagy e-mailes megerősítés szükséges. Apple Hide My Email vagy más privát/relay e-mail esetén az e-mail-egyezés önmagában nem használható automatikus összekapcsolásra; csak bejelentkezett fiókból indított, explicit kapcsolás vagy külön megerősítési folyamat engedélyezhető.

A Fiók és biztonság oldalon a felhasználó grafikusan lássa, mely belépési módok kapcsoltak. A jelenlegi munkamenet jelölése külön magyarázó sor legyen, ne keveredjen a kapcsolt/nem kapcsolt állapottal. Nem kapcsolt Google/Facebook/Apple szolgáltató kapcsolható a közösségi gombkészlet stílusában. Social fiókkal létrejött profilhoz e-mailes belépés is hozzáadható, de ez nem hozhat létre új profilt: az e-mail címet, jelszót és 6 számjegyű megerősítő kódot ugyanazzal a biztonsági szabálykészlettel kell kezelni, mint az e-mailes regisztrációnál.

Legalább egy működő belépési módnak mindig maradnia kell. Az utolsó kapcsolt azonosító leválasztását a frontendnek jeleznie, a backendnek pedig hitelesen tiltania kell.

### 5.4. Fiók törlése

A fióktörlés a Fiók és biztonság oldalon indítható, de vizuálisan és működésben különüljön el a kijelentkezéstől. A kijelentkezés szövege jelezze, hogy csak az adott eszközön léptet ki, a fiók, előfizetés és felhőben mentett beállítások megmaradnak. A fióktörlés előtt a felhasználó kapjon egyértelmű, végfelhasználói figyelmeztetést arról, hogy a felhőben tárolt fiókadatok, beállítások, RSS-források, érdeklődési adatok és kapcsolt belépési módok törlődnek, és a művelet nem állítható vissza. App Store- vagy Google Play-előfizetés esetén a fióktörlési folyamatnak külön fel kell hívnia a figyelmet arra, hogy az áruházi előfizetést az áruházban kell lemondani; a fiók törlése önmagában nem tekinthető az áruházi számlázás automatikus megszüntetésének. A végleges appban a backendnek kell kezelnie a törlési állapotot, a kapcsolt belépési azonosságokat, a felhasználói preferenciákat, RSS-beállításokat, érdeklődési profilt, előfizetési/jogosultsági adatokat, áruházi entitlement-ellenőrzést és minden adatmegőrzési kivételt.

## 6. Első beállítás

Az első beállítás legfeljebb öt rövid lépésből áll, és később minden eleme módosítható.

1. Legalább három érdeklődési téma kiválasztása.
2. Ajánlott magyar RSS-források bekapcsolása.
3. Értesítési alapmód kiválasztása: kikapcsolva, rendkívüli hírek, napi összefoglaló.
4. Helyi hírek opcionális bekapcsolása vagy város kézi kiválasztása.
5. Magyar felolvasóhang és sebesség próbája.

A rendszerengedélyeket csak akkor kérjük, amikor a hozzájuk tartozó funkciót a felhasználó bekapcsolja.

Ha a felhasználó az első beállítást nem fejezi be teljesen, az app a következő indításkor nem a félbehagyott köztes lépésre tér vissza. A folyamat biztonsági okból az üdvözlő/regisztrációs képernyőről indul újra, és csak akkor minősül befejezettnek, ha a belépés/fiók, a csomagválasztás, az RSS-források mentése és az app belső felületének megnyitása megtörtént.

## 7. Hírfolyam

### 7.1. Hírkártya

Minden kártya tartalmazza:

- RSS-kép vagy semleges forráshelyettesítő;
- forrás neve;
- kategória;
- közzététel ideje;
- cím;
- rövid kivonat;
- kedvelés gomb;
- olvasottsági jelzés.

A kártyára kattintva megnyílik a Részletes hír nézet, és a hír olvasottá válik.

Prototípusban a hírkártyák fejlesztési RSS-pillanatképből (`news.json`) töltődnek. Ez GitHub Pagesen is kiszolgálható statikus adatfájl, később backend/API váltja ki.

A rövid hír az RSS `title` és `description` mezőiből készül. A részletes hír a rendelkezésre álló bővebb RSS-tartalmat vagy annak rövidített változatát használja, az eredeti cikk URL-je pedig külön adatmező. A Felolvasó az URL-t nem olvassa fel.

### 7.2. Rendezés és szűrés

Rendezési módok:

- Legfrissebb;
- Nekem ajánlott;
- Csak olvasatlan.

Szűrés:

- téma;
- forrás;
- időszak;
- kedvelt hírek.

### 7.3. Frissítés

- lefelé húzással kézi frissítés;
- alkalmazás megnyitásakor automatikus frissítés;
- aktív Felolvasóban időzített frissítés;
- háttérben az operációs rendszer által engedélyezett, legjobb igyekezet szerinti frissítés.

Választható kívánt gyakoriság:

- 15 perc;
- 30 perc;
- 60 perc;
- 3 óra;
- csak kézzel.

A beállított idő háttérben nem garantált, mert az iOS és az Android korlátozhatja a futást.

## 8. Részletes hírek

A részletes nézet az RSS-ben rendelkezésre álló tartalmat mutatja:

- kép;
- cím;
- forrás, szerző és időpont;
- RSS-leírás vagy tartalom;
- eredeti cikk megnyitása;
- kedvelés;
- megosztás;
- olvasatlanra jelölés;
- kapcsolódó, helyben talált hírek.

Az alkalmazás nem ígér teljes cikket, ha az RSS csak kivonatot szolgáltat.

## 9. Keresés, kedvelések és előzmények

### 9.1. Keresés

A keresés a helyi hír-adatbázisban működik:

- cím;
- kivonat;
- forrás;
- téma;
- dátum.

Hang alapú keresés az Asszisztensben és a Felolvasóban használható, a Hírfolyam képernyőjén nem.

### 9.2. Kedvelt hírek

- olvasottságtól függetlenek;
- automatikusan nem törlődnek;
- offline elérhetők, ha a tartalom már letöltődött;
- manuálisan törölhetők;
- kereshetők és témák szerint szűrhetők.

### 9.3. Előzmények

Az előzmények időrendben mutatják az olvasott, meghallgatott és átugrott híreket. A felhasználó:

- egy elemet törölhet;
- minden előzményt törölhet;
- újra olvasatlanná tehet egy hírt;
- kikapcsolhatja az előzményekből történő személyre szabást.

## 10. Felolvasó – telefonos felület

### 10.1. Látható elemek

- aktuális RSS-kép;
- hír címe;
- forrás és kategória;
- állapot: Betöltés, Felolvasás, Figyelek, Gondolkodom, Beszélgetés, Szünet vagy Leállítva;
- rövid hangutasítási súgó;
- három nagy gomb.

### 10.2. A három gomb

1. **Mikrofon** – hangutasítások be- vagy kikapcsolása.
2. **Automatikus következő** – a hír végén továbblépés be- vagy kikapcsolása.
3. **Leállítás/Folytatás** – a felolvasás tényleges leállítása; nem a hangerőt némítja.

A gombok legalább 48×48 pontos érintési területet kapnak, magas kontraszttal és rövid felirattal.

### 10.3. Lejátszási folyamat

1. A rendszer kiválasztja a legfrissebb olvasatlan hírt a szűrt hírfolyamból.
2. Megjeleníti a képét és címét.
3. Felolvassa a forrást, a címet és a rövid RSS-tartalmat.
4. A végleges alkalmazásban beszéd érzékelésekor azonnal megszakítja a felolvasást.
5. Meghallgatja, értelmezi és végrehajtja a kérést.
6. Válasz után folytatja a hírt vagy a kért műveletet hajtja végre.
7. A hír végén olvasottnak jelöli.
8. Bekapcsolt automatikus következő esetén rövid szünet után továbblép.
9. Kikapcsolt automatikus következő esetén várakozik.

Az átugrott hír azonnal olvasottá válik.

A kattintható böngészős prototípusban a Felolvasó nem figyel folyamatosan mikrofonon, mert ez a Web Speech API-val tesztelési hibát okozhat. A mikrofon akkor válik ténylegesen aktívvá, ha a Mikrofon gomb be van kapcsolva és a hírfelolvasás a végére ért. Bekapcsolt Hírléptető mellett ilyenkor 3 másodperces hangutasítási ablak nyílik, majd a program továbblép. Kikapcsolt Hírléptető mellett a mikrofon hír végén nyitva marad, amíg új felolvasás nem indul, a Mikrofon ki nem kapcsol, vagy a felhasználó Előző/Következő navigációt nem indít.

### 10.4. Állapotgép

| Állapot | Jelentés | Lehetséges következő állapot |
|---|---|---|
| Betöltés | Hír vagy kép betöltése | Felolvasás, Hiba |
| Felolvasás | A rendszer beszél | Figyelek, Szünet, Leállítva, Következő |
| Figyelek | A felhasználó beszélhet | Értelmezés, Felolvasás, Hiba |
| Értelmezés | Szándék felismerése | Válasz, Felolvasás, Hiba |
| Válasz | Rövid hangválasz | Felolvasás, Beszélgetés, Következő |
| Beszélgetés | Élő párbeszéd az aktuális hírről | Beszélgetés, Felolvasás, Leállítva |
| Szünet | A sor megmarad, nincs felolvasás | Felolvasás, Leállítva |
| Leállítva | A munkamenet nem halad tovább | Betöltés, Felolvasás |
| Hiba | Hálózati, RSS-, hang- vagy jogosultsági hiba | Újrapróbálás, Következő, Leállítva |

### 10.5. Beszédmegszakítás

- A felhasználó beszéde elsőbbséget élvez a felolvasással szemben.
- Az érzékeléskor a TTS azonnal megáll vagy lehalkul.
- Sikertelen felismeréskor az alkalmazás röviden jelzi: „Nem értettem”, majd folytatja, ha a felhasználó nem próbálkozik újra.
- Kikapcsolt mikrofonnál nincs automatikus megszakítás; csak a képernyő és az autó fizikai médiavezérlői használhatók.
- Telefonhívás és navigációs hang elsőbbséget kap. A felolvasás ezután folytatható.

Ez végleges termékcél. A jelenlegi prototípusban a bármikori megszakítás helyett hír végi mikrofonablak működik: automata Hírléptető mellett 3 másodpercig, kézi módban pedig nyitva maradva.

## 11. Hangutasítások

Az alkalmazás szándékokat értelmez, nem kizárólag pontos kulcsszavakat.

| Szándék | Példák |
|---|---|
| Következő | „Következő”, „Menjünk tovább”, „Ez nem érdekel” |
| Előző | „Előző hír”, „Menj vissza” |
| Újra | „Olvasd újra”, „Kezdd elölről” |
| Szünet | „Állj meg egy pillanatra”, „Szünet” |
| Folytatás | „Folytasd”, „Mehet tovább” |
| Leállítás | „Állítsd le”, „Fejezzük be” |
| Részletek | „Mondj róla többet”, „Érdekelnek a részletek” |
| Kedvelés | „Kedveld ezt”, „Tedd a kedveltek közé” |
| Automatikus ugrás | „Ne lépj tovább automatikusan”, „Kapcsold vissza az automatikus következőt” |
| Mikrofon | „Kapcsold ki a mikrofont”, „Most ne figyelj” |
| Forrás | „Melyik lap írta?”, „Mikor jelent meg?” |
| Keresés | „Van új hír erről?”, „Keress technológiai híreket” |
| Beszélgetés | „Beszéljük meg”, „Mit jelent ez?” |
| Vissza a hírekhez | „Folytassuk a híreket”, „Vissza a hírfolyamhoz” |

Biztonsági vagy romboló műveletet, például teljes előzménytörlést, hangutasítással csak megerősítés után hajtunk végre.

## 12. Beszélgetés az autóban

A felhasználó az aktuális hírből hanggal beszélgetést indíthat. Beszélgetés közben:

- az aktuális hír marad vizuális kontextusként;
- a hírsor szünetel;
- a rendszer rövid, vezetés közben követhető válaszokat ad;
- megnevezi, mely betöltött hírek alapján válaszol;
- kérésre kapcsolódó hírt keres a helyi adatbázisban vagy frissíti az engedélyezett RSS-forrásokat;
- a „vissza a hírekhez” utasítás visszatér a lejátszási sorhoz.

Ha a kérdéshez nincs elegendő betöltött forrás, az asszisztens ezt kimondja. Nem állít nem ellenőrzött tényt hírként.

## 13. CarPlay és Android Auto

Az autós rendszerekben a Hírbeszéd médiaalkalmazásként működik.

Leképezés:

- RSS-kép → médiaborító;
- hírcím → aktuális elem címe;
- forrás és kategória → alcím/metaadat;
- felolvasás → médiahang;
- következő/előző/leállítás → médiavezérlés;
- beszélgetés → ugyanazon munkamenet hangalapú állapota.

A jármű kijelzőjén nincs hagyományos csetablak vagy hosszú szöveges átirat. Az élő cset hangban érhető el. A telefonos Asszisztens nézet továbbra is teljes szöveges előzményt mutat.

A platform által kötelezően megjelenített standard médiagombokat az alkalmazás nem feltétlenül tudja elrejteni. A pontos megjelenést korai technikai prototípussal kell ellenőrizni mindkét rendszeren.

## 14. Asszisztens

### 14.1. Módok

- **Beszéd mód:** alapértelmezett, élő beszélgetés.
- **Gépelés:** hagyományos szöveges cset.
- **Néma mód:** gépelt kérdés és csak írott válasz.

A telefonos asszisztens felső módválasztója egységes ikon+felirat vezérlő: Beszéd hullámikon, Gépelés billentyűzetikon, Néma halkított hang ikon. A jobb felső gyorsváltó ugyanennek az ikoncsaládnak a következő módra mutató jelét használja.

A három mód ugyanazt az aktuális asszisztens-csevegést használja:

- Beszéd módban a mikrofonfigyelés és a hangos válasz aktív. A teljes méretű cset és a kompakt buborékos csetablak nem látszik. A hullám alatt egy egyszerű, nem dobozos aktuális összefoglaló jelenik meg: induláskor a kezdőkérdés és leírása, válasz után pedig az aktuális hír vagy válasz címe és rövid leírása. Ha a felhasználó Gépelés vagy Néma módból vált Beszédre, és már van valódi csetelőzmény, akkor a Beszéd nézet nem kezdőkérdésre áll vissza, hanem az utolsó asszisztensválasz hírével vagy összefoglalójával folytatja.
- Gépelés módban a mikrofon nem figyel, a felhasználó gépel, az app pedig felolvassa a választ. A felső hangállapot és hullám fixen marad, alatta görgethető a teljes cset.
- Néma módban a mikrofon nem figyel és nincs hangos válasz. Hullám animáció nem jelenik meg, csak a Néma állapot és alatta a teljes görgethető cset.
- Gépelés és Néma módban üzenetküldés után a kurzor automatikusan visszakerül a szövegbeviteli mezőbe.
- A Gépelés és Néma mód csetablakának tetején belső, nem kattintható sötét/fade kifutás jelenik meg, hogy a felfelé gördülő buborékok ne kemény vágással tűnjenek el.
- A Gépelés, Néma és promo cset üzenetlistája alulról építkezik: rövid beszélgetésnél a buborékok a beviteli mező fölött állnak, hosszú beszélgetésnél a régebbi üzenetek felfelé gördülnek, az új üzenet pedig lent marad.
- Mobilon a virtuális billentyűzet megjelenése nem méretezheti át a teljes appot, és nem tolhatja fel az alsó navigációt a billentyűzet fölé. Gépelés, Néma és promo cset esetén csak a cset és a teljes beviteli box fusson fel a billentyűzet teteje fölé, természetes alsó-felső távolsággal.
- Régi beszélgetéseket az app nem archivál. Csak az aktuális csevegés legfeljebb 40 üzenete marad meg; ami ez elé kerül, automatikusan kiesik.
- Új aktuális csevegés akkor indul, ha a felhasználó ezt kéri, például: "más érdekel", "váltsunk témát", "kezdjünk újat".

A prototípusban az Asszisztens fél-AI jellegű, szabályalapú válaszmotorral működik. Nem hív valódi AI API-t, hanem a betöltött RSS-hírekből keres témát, forrást és kapcsolódó cikkeket, majd természetesebb összefoglaló válaszokat épít. A válaszokhoz hír-azonosítók kapcsolódnak, hogy a "részletesebben" és hasonló folytató kérések az előző válasz fő hírére épüljenek.

### 14.2. Képességek

- keresés a letöltött hírek között;
- RSS-források frissítése;
- aktuális vagy több hír összefoglalása;
- eltérő források összevetése;
- kedvelés;
- hírfolyam szűrése;
- források, témák és értesítések módosítása megerősítéssel;
- napi vagy témánkénti hírösszefoglaló;
- visszatérés a Felolvasó lejátszási sorához.

### 14.3. Válaszok minősége

- Minden hírjellegű válaszhoz forrás és dátum tartozik.
- A tény, összefoglalás és következtetés elkülönül.
- Több forrás esetén az eltéréseket jelzi.
- Hiányos RSS-tartalomnál nem talál ki részleteket.
- A válaszok autóban rövidebbek, telefonos csetben részletesebbek lehetnek.

## 15. RSS-források

### 15.1. Kezelés

- előre telepített, kikapcsolható magyar forráslista;
- ajánlott források témák szerint;
- új forrás hozzáadása RSS-linkkel;
- URL ellenőrzése és előnézete forrás hozzáadása előtt;
- forrás átnevezése vagy eltávolítása;
- forrásonkénti értesítés;
- forrásonkénti mobiladat-engedély későbbi lehetőségként.

### 15.2. Helyi feldolgozás

- ETag és Last-Modified használata, ha a forrás támogatja;
- időzóna és dátum normalizálása;
- HTML tisztítása;
- kép kiválasztása RSS enclosure, media vagy tartalmi kép alapján;
- eredeti link és forrás megőrzése;
- hibás és átirányított feedek kezelése;
- letöltési hibák elkülönítése forrásonként.

### 15.3. Duplikációszűrés

Beállítási szintek:

- Kikapcsolva;
- Normál;
- Szigorú.

A normál mód azonos GUID vagy normalizált URL alapján szűr. A szigorú mód ezen felül címhasonlóságot, forrást és megjelenési időt is figyelembe vesz.

## 16. Témarendszer

Alap témák:

- Belföld;
- Külföld;
- Világhírek;
- Politika – belföld;
- Politika – külföld;
- Gazdaság – belföld;
- Gazdaság – külföld;
- Sport;
- Technológia;
- Tudomány;
- Egészség;
- Kultúra;
- Mozi és sorozatok;
- Bulvár;
- Életmód;
- Autó és közlekedés;
- Helyi hírek;
- Egyéb.

Elsődleges besorolásként az RSS saját kategóriája használható. Ismeretlen vagy eltérő kategóriát a készülék helyi megfeleltetési táblája rendel az általános témákhoz.

## 17. Helyi személyre szabás

A „Nekem ajánlott” sorrend helyben számolható az alábbi tényezőkből:

- frissesség;
- téma iránti érdeklődés;
- forrás iránti érdeklődés;
- részletek kérése;
- kedvelés;
- átugrás;
- helyi relevancia;
- ismétlődés és túl gyakori forrás miatti csökkentés.

Alapelvek:

- a frissesség mindig erős súly marad;
- egyetlen forrás nem uralhatja a teljes ajánlott listát;
- a felhasználó megtekintheti és törölheti érdeklődési profilját;
- a Legfrissebb mód teljesen független a személyre szabástól.

## 18. Értesítések

### 18.1. Választható értesítések

- rendkívüli hírek;
- napi összefoglaló;
- téma;
- RSS-forrás;
- helyi hírek;
- kedvelt témához kapcsolódó új hírek.

### 18.2. Szabályozás

- csendes időszak;
- napi maximális darabszám;
- mobilnetes frissítés engedélyezése;
- „Miért kaptam ezt?” magyarázat;
- azonos vagy hasonló értesítések összevonása.

Saját RSS-szerver nélkül a háttérben történő frissítés és helyi értesítés nem garantáltan azonnali. Valós idejű rendkívüli push későbbi, felhőalapú RSS-feldolgozást igényelne.

## 19. Megjelenés és hozzáférhetőség

- Rendszer szerinti, világos és sötét téma.
- Az első használati onboarding képernyői beállítástól függetlenül sötét vizuális környezetben indulnak, hogy a belépés előtti élmény egységes legyen.
- Képernyőolvasó-kompatibilis címkék.
- Színtől független állapotjelzés.
- Nagy érintési célok a Felolvasóban.
- Felirat és vizuális visszajelzés a hangállapotokról.
- A mozgások csökkenthetők.

## 20. Mobiladat, offline mód és tárhely

Alapértelmezetten mobilneten is működik:

- RSS-frissítés;
- képek letöltése;
- hangalapú szolgáltatások, ha külső szolgáltatás szükséges.

Beállítható:

- mobiladat teljes tiltása;
- képek tiltása mobilneten;
- roaming tiltása;
- előtöltendő hírek száma;
- gyorsítótár maximális mérete;
- hírek megőrzése 7, 30 vagy 90 napig;
- automatikus gyorsítótár-tisztítás.

A kedvelt hírek nem törlődnek az automatikus takarításkor.

## 21. Helyadat

- Alapból kikapcsolva.
- Bekapcsoláskor hozzávetőleges, használat közbeni helyengedélyt kér.
- Kézzel kiválasztott város vagy régió mindig használható alternatívaként.
- Nem tárol helyelőzményt.
- Nem változtatja meg váratlanul a teljes hírfolyamot; a helyi hírek külön téma vagy blokk.
- A felhasználó bármikor törölheti a helyi beállítást.

## 22. Adatmodell

### 22.1. Helyi entitások

**Source**

- azonosító;
- név;
- RSS URL;
- weboldal URL;
- ikon;
- engedélyezett állapot;
- frissítési metaadatok;
- utolsó sikeres és sikertelen frissítés.

**Article**

- helyi azonosító;
- RSS GUID;
- normalizált eredeti URL;
- forrásazonosító;
- cím;
- kivonat vagy RSS-tartalom;
- kép URL vagy helyi elérési út;
- szerző;
- megjelenési idő;
- témák;
- deduplikációs ujjlenyomat.

**ArticleState**

- olvasott;
- kedvelt;
- olvasás ideje;
- utolsó interakció;
- törölt vagy elrejtett állapot.

**Interaction**

- cikkazonosító;
- esemény: megnyitás, felolvasás, átugrás, részletek, kedvelés, keresési találat;
- időpont;
- személyre szabásban felhasználható-e.

**Preferences**

- téma és forrás beállítások;
- értesítések;
- megjelenés;
- adatforgalom;
- hang;
- felolvasó;
- helyi hírek;
- nyelv;
- személyre szabási súlyok.

### 22.2. Opcionálisan szinkronizált adatok

- minimális felhasználói profil;
- engedélyezett források;
- beállítások;
- kedvelt hírek URL-jei;
- olvasottsági ujjlenyomatok korlátozott időtartamban.

Pontos helyadat, mikrofonfelvétel és teljes letöltött cikktartalom nem kerül felhőbe.

## 23. Technikai felépítés

### 23.1. Készüléken

- natív RSS-letöltés és -feldolgozás;
- helyi, titkosított adatbázis;
- képek gyorsítótára;
- rendszer TTS;
- rendszer vagy helyi beszédfelismerés;
- helyi parancsértelmező az alapvető autós utasításokhoz;
- helyi kereső és személyre szabás;
- CarPlay és Android Auto média-integráció.

### 23.2. Menedzselt szolgáltatásban

- Apple, Google, Facebook és e-mailes hitelesítés;
- opcionális beállítás- és kedvelésszinkron;
- AI-szolgáltatás titkos kulcsának védelme;
- rövid életű AI-munkamenetek létrehozása;
- aktív eszköz és aktív munkamenet nyilvántartása;
- opcionális push értesítés.

### 23.3. Egyidejű eszközhasználat

Egy fiókhoz egyszerre csak egy aktív eszköz tartozhat. Több készülékre lehet telepíteni és be lehet jelentkezni, de az app használata, az ingyenes hírfolyam, a felolvasás, az asszisztens és minden tokenfogyasztó funkció csak az aktív eszközön indulhat.

A végleges appban a backend tartja nyilván az `activeDeviceId`, `activeSessionId` és heartbeat jelzéseket. Ha a felhasználó másik eszközön nyitja meg a Hírbeszédet, az app blokkolt tájékoztató nézetet mutat, majd kifejezett jóváhagyást kér: `Használat átvétele ezen az eszközön`. Jóváhagyás után az új eszköz lesz aktív, a korábbi eszköz pedig leválasztott állapotot kap.

Ez a szabály nem büntető jellegű: a váltás legyen gyors és érthető, de akadályozza meg, hogy egy előfizetés vagy próbaidő párhuzamosan több eszközön fogyasszon AI- és hangszolgáltatási erőforrást.

### 23.4. Fontos biztonsági szabály

AI- vagy más szolgáltatói titkos kulcs nem építhető közvetlenül a mobilalkalmazásba. A kulcsot menedzselt titoktároló és minimális serverless funkció védi.

## 24. Hibaállapotok

Az alkalmazás érthető, rövid visszajelzést ad:

- nincs internet;
- egy RSS-forrás nem érhető el;
- hibás RSS-link;
- nincs új olvasatlan hír;
- nem tölthető be a kép;
- nincs mikrofonengedély;
- a beszéd nem volt érthető;
- a felolvasóhang nem érhető el;
- az AI-szolgáltatás nem elérhető;
- a helyi tárhely megtelt;
- a CarPlay vagy Android Auto kapcsolat megszakadt.

Egyetlen hibás RSS-forrás nem állíthatja le a teljes frissítést vagy a Felolvasót.

Folyamatot megakasztó hibáknál egységes modális rendszerüzenetet kell használni. Nem blokkoló siker- vagy információs visszajelzés csak akkor jelenjen meg, ha a felületváltozás önmagában nem elég; ilyenkor a fejlécben megjelenő rövid értesítés az irány, nem alsó toast.

## 25. Első kiadás – MVP

### Benne van

- teljes magyar felület;
- regisztráció Apple, Google, Facebook és e-mail használatával;
- ajánlott és kézzel megadott RSS-források;
- időrendi hírfolyam;
- olvasott és kedvelt állapot;
- keresés és előzmények;
- világos, sötét és rendszer szerinti téma;
- mobiladat-beállítások;
- telefonos Felolvasó három gombbal;
- automatikus felolvasás és továbblépés;
- megszakítható beszéd és alapvető természetes parancsok;
- CarPlay és Android Auto média-integrációs prototípus;
- Asszisztens beszéd-, gépeléses és néma móddal;
- helyi személyre szabás első változata;
- opcionális hozzávetőleges helyi hírek.

### Nem része az első kiadásnak

- saját RSS-gyűjtő szerver;
- kiadói adminisztráció;
- közösségi kommentek;
- teljes internetes hírfeltérképezés;
- garantált valós idejű rendkívüli értesítés;
- többnyelvű tartalmi felület a magyar mellett;
- teljes áruházi fizetés és végleges előfizetéskezelés.

## 26. Kritikus technikai próbák fejlesztés előtt

1. RSS-kép, cím és leírás megjelenítése egy valós magyar feedből.
2. Magyar TTS működése lezárt képernyőn és Bluetooth-on.
3. Beszéddel történő felolvasás-megszakítás zajos környezetben.
4. Telefonhívás és navigációs hang utáni helyes folytatás.
5. CarPlay médiaborító, cím és engedélyezett vezérlők.
6. Android Auto médiaborító, cím és engedélyezett vezérlők.
7. Élő hangbeszélgetés késleltetése és mobiladat-használata.
8. Háttérfrissítés tényleges gyakorisága iOS-en és Androidon.

## 27. Elfogadási feltételek az első működő prototípushoz

- Legalább öt valós RSS-forrás hírei időrendben megjelennek.
- A felhasználó hozzáadhat és kikapcsolhat forrást.
- Egy hír megnyitáskor olvasottá válik.
- Egy hír kedvelhető, kereshető és újra megnyitható.
- A Felolvasó automatikusan felolvassa a legfrissebb olvasatlan hírt.
- A végleges appban a felhasználói beszéd megszakítja a felolvasást; a böngészős prototípusban ezt hír végi mikrofonablak helyettesíti: automata Hírléptetőnél 3 másodpercig, kézi módban nyitva maradva.
- A „következő”, „részletek”, „kedveld”, „állj” és „folytasd” szándék működik.
- Bekapcsolt automatikus módban a következő hír magától elindul.
- Kikapcsolt automatikus módban a rendszer várakozik.
- Az átugrott hír olvasottá válik.
- A világos és sötét mód minden fő képernyőn olvasható.
- Hálózati hiba nem okoz adatvesztést vagy alkalmazás-összeomlást.

## 28. Fejlesztési ütemezés

### 0. szakasz – termékterv

- jelen specifikáció jóváhagyása;
- képernyővázlatok;
- kezdő RSS-lista;
- vizuális arculat.

### 1. szakasz – technikai kockázatcsökkentés

- RSS-próba;
- TTS és beszédmegszakítás;
- CarPlay és Android Auto proof of concept;
- háttérfrissítési próba.

### 2. szakasz – mobilos alap

- belépés;
- helyi adatbázis;
- Hírfolyam;
- részletes hírnézetek;
- keresés, kedvelések, előzmények;
- Beállítások.

### 3. szakasz – autós élmény

- lejátszási sor;
- hangparancsok;
- automatikus továbblépés;
- Bluetooth, hívás és navigáció kezelése;
- autós rendszerintegráció.

### 4. szakasz – asszisztens és személyre szabás

- élő cset;
- forrásos válaszok;
- helyi érdeklődési modell;
- ajánlott sorrend;
- opcionális szinkron.

### 5. szakasz – kiadás

- hozzáférhetőségi teszt;
- adatvédelmi dokumentumok;
- valós autós teszt;
- alkalmazásbolti ellenőrzés;
- béta és hibajavítás.

## 28/A. Prototípus felületi sablon

A kattintható prototípusban az alkalmazásszintű tipográfia és kártyasablon a `styles.css` `--hb-*` tokenjeiből épül fel.

- Betűcsalád: `Inter, "Segoe UI", Arial, sans-serif`.
- Tipográfiai lépcsők: meta, caption, body, button, card title, sheet title, title, hero.
- Általános kártya lekerekítés: `18px`.
- Nagy hero felületek lekerekítése: `24px`.
- Fő gombmagasság: `50px`.
- Fő gomb lekerekítés: `16px`.

Ez a prototípus-szabály az onboarding, Hírfolyam, Felolvasó, Asszisztens, Beállítások, sheet/panel és előfizetési felületeken egységesen érvényes.

## 29. Következő tervezési feladat

**Képernyőtérkép:** a régi statikus drótvázak törölve lettek; az aktuális prototípus alapján új képernyőtérkép készülhet a dokumentációs körben.

A teljes, 33 képernyős képernyőrendszer világos és sötét témában elkészült, és v1.0-s végleges vizuális alapként a jóváhagyott logó- valamint színrendszert használja. A következő feladat a fő felhasználói folyamatok kattintható prototípusa, majd a CarPlay és Android Auto technikai próba.
