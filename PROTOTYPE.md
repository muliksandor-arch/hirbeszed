# Hírbeszéd - kattintható prototípus

Aktuális prototípusverzió: **2.1**.

Ez a projekt gyökerében található mobilos PWA-prototípus. A jelenlegi rögzített irány: az ingyenes **Hírfolyam**, az AI-hangos **Felolvasó** és a csevegéses **Asszisztens** csomagfüggően nyílik meg.

## Helyi indítás

PowerShellben, a projekt mappájából:

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

Megnyitás:

```text
http://127.0.0.1:8000/?cachebust=local-dev
```

Ha a böngésző régi változatot mutat, használj új `cachebust` értéket, vagy töröld a prototípus adatait az app Beállítások felületén.

## Helyi verziómentés

Elfogadott vagy kockázatosabb módosítás előtti állapotról teljes helyi pillanatkép készíthető:

```powershell
.\helyi_mentes.cmd -Name "rovid-nev"
```

A mentések alapértelmezett helye:

```text
C:\Users\mulik\Documents\Fejlesztés\Hírbeszéd_verziok
```

Az aktuális projekt összehasonlítható a legutóbbi mentéssel:

```powershell
.\helyi_osszehasonlitas.cmd -Latest
```

Vagy egy konkrét mentéssel:

```powershell
.\helyi_osszehasonlitas.cmd -Snapshot "mentes-mappa-neve"
```

Ez a helyi mentési rendszer nem helyettesíti a GitHub publikálást. Arra való, hogy egy korábbi helyi állapot külön mappából újra megnyitható, összehasonlítható és szükség esetén kontrolláltan visszaállítható legyen.

## Fő képernyők

- **Hírfolyam**: RSS-forrásokra és témákra szűrt hírlista.
- **Felolvasó**: automatikusan induló, hangvezérelhető hírfelolvasó nézet.
- **Asszisztens**: prototípus-szintű hírkérdező és összefoglaló felület.
- **Beállítások**: elsőként Csomagok és előfizetés, utána Hírbeállítások, Alkalmazás és Prototípus csoportok.

## Fájlszerkezet

- `index.html`: a prototípus belépési pontja és a modulok betöltési sorrendje.
- `styles.css`: alap layout, telefonkeret, Felolvasó, gombok és globális stílusok.
- `app.js`: alap állapot, renderelés, Felolvasó logika, hangmotor, gombesemények.
- `prototype-onboarding.js`: első használat, regisztráció, próbaidő, RSS-választás.
- `prototype-topics.js`: témák, RSS-források és hírfolyam-bővítmények.
- `prototype-settings.js`: részletesebb beállítási panelek.
- `prototype-reader-controls.js`: Felolvasó gombsor stabilizálása és hanghullám megjelenése.
- `prototype-auth.js`: fiók, előfizetés és prototípus-törlés folyamatok.
- `prototype-layout.js`: helyi elrendezés- és layout-kiegészítések.
- `prototype-auto-preview.js`: ideiglenes Android Auto / CarPlay előnézet.
- `prototype-navigation.js`: alsó menü ikonok, feliratok és Felolvasó elnevezés.
- `sw.js`: PWA cache és service worker.
- `ELOFIZETESI_SZABALYZAT.txt`: előfizetési, próbaidős és promóciós szabályzat.
- `ELOFIZETESI_GOMB_MATRIX.md`: Felolvasó és Asszisztens jobb felső CTA gombjainak előfizetési állapot szerinti döntési táblája.
- `helyi_mentes.cmd`: kanonikus Windows indító a teljes helyi verziómentéshez.
- `helyi_mentes.ps1`: a tényleges helyi snapshot készítő script.
- `helyi_osszehasonlitas.cmd`: kanonikus Windows indító az aktuális projekt és egy helyi mentés összehasonlításához.
- `helyi_osszehasonlitas.ps1`: hash-alapú helyi összehasonlító script.
- `publikalas.cmd`: kanonikus Windows indító a GitHub publikáláshoz.
- `publikalas.ps1`: a tényleges GitHub publikáló script.
- `GITHUB_PUBLIKALASI_SZABALYOK.txt`: GitHub Pages publikáció és hibakezelés rögzített szabályai.

## Rögzített működés

A részletes magyar működési leírás itt található:

```text
docs/prototipus-mukodes.md
```

Rövid összegzés:

- Első használat: regisztráció -> próbaidő/előfizetés -> RSS-források -> az aktuális csomag szerinti induló oldal.
- Ha az első használati onboarding nincs teljesen befejezve, minden új betöltés vagy kényszerű újranyitás az üdvözlő/regisztrációs onboarding képernyőről indul. Félkész belépési, csomagválasztási vagy RSS-választási állapotból nem nyílhat vissza középső onboarding oldal.
- Onboarding alatt nincs appmenü, és az onboarding képernyők beállítástól függetlenül sötét vizuális környezetben futnak.
- A közösségi gombkészlet brandelt, középre igazított és reszponzív: `Folytatás Google-fiókkal`, `Folytatás Facebook-fiókkal`, `Folytatás Apple-fiókkal`.
- A végleges appban egy Hírbeszéd-fiókhoz több belépési azonosság kapcsolható: e-mail, Google, Facebook és Apple. Azonos, ellenőrzött e-mail alapján a rendszer felismerheti az összekapcsolási lehetőséget, de a fiókokat nem fűzheti össze csendben; felhasználói jóváhagyás és biztonságos megerősítés kell. Apple Hide My Email / relay e-mail esetén automatikus e-mail-alapú összekapcsolás nem engedélyezett.
- A külön `Belépés` oldal csak e-mailes belépést mutat: e-mail cím, jelszó, `Belépés` gomb és `Elfelejtett jelszó` link. Közösségi gombok és regisztrációs terelő gomb ezen az oldalon nincsenek.
- Az e-mailes belépés mezőhibái és hitelesítési hibái modális rendszerüzenettel jelennek meg. A prototípusban a sikeres belépési tesztadat `teszt.prototipus@example.com` / `Hirbeszed1!`; külön tesztcímek szimulálják a nem megerősített, zárolt és szerverhibás fiókot.
- Az e-mailes fiókoknál a kétlépcsős azonosítás alapértelmezetten bekapcsolt. Sikeres e-mail + jelszó után bekapcsolt 2FA esetén a `Belépés megerősítése` kódoldal nyílik, kikapcsolt 2FA esetén közvetlenül továbblép a belépés. A `Kétlépcsős védelem` menü kapcsolója ezt a belépési döntést vezérli. A közösségi belépésre ez nem vonatkozik.
- A bejelentkezett Beállítások / Fiók és biztonság panel egyoldalas fiókbiztonsági felület. `Fiók adatai` összefoglalót, Google/Facebook/Apple/E-mailes belépés kártyákat, Kétlépcsős védelem sort, Kijelentkezés gombot és külön `Fiók törlése` veszélyzónát mutat. A Google/Facebook/Apple kártyák brandelt SVG ikont használnak, az E-mailes belépés kártya `@` ikonja megmarad. A régi Profiladatok és Kapcsolt fiókok almenük megszűntek.
- A belépési mód kártyák jelzik, mely módok kapcsoltak. A `Kapcsolva` állapot semleges jelzés; a `Most ezzel vagy belépve` sor csak az aktuális munkamenetet mutatja. Új social szolgáltató a közösségi gombkészlet stílusával kapcsolható; meglévő social fiókhoz az e-mailes belépés a már elkészült e-mailes regisztrációs + 6 jegyű kódos megerősítő folyamatot használja `add-email-login` módban.
- Az utolsó működő belépési mód nem választható le. Ilyenkor a globális modális rendszerüzenet blokkolja a műveletet.
- A `Kijelentkezés` teljes szélességű gomb, előtte a felület jelzi, hogy csak ezen az eszközön léptet ki, a fiók, előfizetés és felhőben mentett beállítások megmaradnak.
- A `Fiók törlése` nem kijelentkezés: teljes szélességű veszélygomb, előtte a felület figyelmeztet, hogy a felhőben tárolt fiókadatok, beállítások, RSS-források, érdeklődési adatok és kapcsolt belépési módok törlődnek, és a művelet nem állítható vissza. Ha a felhasználónak App Store- vagy Google Play-előfizetése van, azt törlés előtt külön le kell mondania az áruházban. Aktív fizetős vagy próba előfizetésnél a prototípus először `Előfizetés lemondása` modált mutat, és csak a `Lemondást ellenőriztem` után nyitja meg a végleges törlési megerősítést. A modális megerősítés is felhasználói, véglegességi figyelmeztetést mutat, fejlesztői/prototípusos szöveg nélkül.
- Kijelentkezés után nincs külön kijelentkezett `Fiók és biztonság` panel. Az app auth-zárba kerül, elrejti a menüt, és az üdvözlő / belépési képernyőt mutatja.
- Kijelentkezéskor a prototípus fiókhoz kötött helyi adatai törlődnek: csomag, RSS-források, témák, érdeklődési profil, olvasási/kedvelési előzmények, asszisztens-cset, megjelenési/hangpreferenciák, kapcsolt fiókok és 2FA állapot. A prototípus-tesztkörnyezeti kapcsolók, például az `Automatikus adatfeltöltés`, megmaradnak.
- Bejelentkezéskor a végleges appnak backendből kell visszaállítania a felhasználó mentett személyes állapotát: előfizetési csomag, RSS-csatorna beállítások, témák, érdeklődési körök, preferenciák, fiókbiztonsági beállítások és kapcsolt fiókok. Másik eszközön belépve ugyanennek az állapotnak kell megjelennie.
- A `Jelszó visszaállítása` oldal a Belépés oldalról nyílik, a bal felső visszagomb és a `Vissza a belépéshez` link is a Belépés oldalra visz. A reset mezőhibái modális rendszerüzenettel jelennek meg, sikeres kérés után általános sikerüzenet jelenik meg, amely nem árulja el, hogy létezik-e a megadott e-mail cím.
- A normál regisztráció e-mail-alapú; telefonszám mező nincs. A kódmegerősítés 6 számjegyet kér, és a megerősítő gomb csak a teljes kód beírása után jelenik meg.
- Az e-mail-kód oldalon a prototípus modális rendszerüzenettel kezeli a hibás, lejárt, túl sokszor próbált, újraküldési és megszakadt folyamat hibákat. A tesztkód `123456`, a lejárt kód szimulációja `000000`; ezek kizárólag prototípus-tesztadatok.
- Induló oldal: Ingyenes csomag / lejárt próba / sikertelen fizetés esetén Hírfolyam, AI Felolvasó előfizetés vagy aktív 14 napos AI Felolvasó próba esetén Felolvasó, AI Asszisztens előfizetésnél Asszisztens.
- A Hírfolyam jobb felső fejlécében csak a `Keresés` ikon marad. A kedvelt hírek és az olvasott/olvasatlan kezelés nem fejlécgombként jelenik meg; ezek a hírkártyák meta sorában, illetve a kapcsolódó listanézetekben érhetők el. A keresés ikon világos témában is az app accent színét használja.
- A hírkártya-akciók egységes SVG ikonokat használnak: Kedvelés = szív, Megosztás = lekerekített papírrepülő/küldés ikon külön coral mozgáscsík nélkül, Olvasatlan/Olvasott = nyitott szem állapotikon. Az olvasott állapotban a teljes szemikon coral, nem csak a belső kör.
- A Hírfolyam és a Felolvasó közös hírfolyamnézet-váltója: `Személyes / Időrend / Kedvelt`. Az alapértelmezett nézet a `Személyes`.
- A `Személyes` preferencia szerinti, időrendi hírfolyam; az `Időrend` nem személyre szabott, időrendi hírfolyam; a `Kedvelt` csak a szívecskével jelölt híreket mutatja időrendben. Az olvasott hírek nem tűnnek el a Személyes és Időrend nézetből, csak halványabb/olvasott állapotot kapnak.
- Új hír érkezésekor a Hírfolyam nem ugrik automatikusan. Felülről beúszó, lebegő értesítés jelenik meg `N új hír érkezett · Megtekintem` szöveggel és frissítés ikonnal. Megtekintés után az új hírkártyák finom `Új` jelölést kapnak, amely akkor tűnik el, amikor a felhasználó végiggörgette az összes újnak jelölt hírt.
- Prototípus-tesztsegéd: helyi ellenőrzéshez a `simulateFreshNews=3` URL-paraméter kontrollált friss hír batch-et hoz létre. Ez nem végtermék-funkció, csak a friss hír értesítés és jelölés gyors ellenőrzésére szolgál.
- Értesítési irány: a menüben a `Napi összefoglaló` és a `Csendes időszak` kikerült. A megmaradó értesítési típusok a `Rendkívüli hírek` és a `Személyes hírösszefoglaló`.
- A `Rendkívüli hírek` külön, azonnali értesítési ág. Ha be van kapcsolva, a valódi rendkívüli hír és az időjárási riasztás független a személyes hírösszefoglaló 2 órás szabályától.
- A `Személyes hírösszefoglaló` nem fix időpontban működik: elsőként 10 új személyes hírnél jelenhet meg, aktív értesítés esetén ugyanaz az értesítés frissül. Új hangos értesítéshez legalább 2 órának kell eltelnie az utolsó hangos értesítés óta, és közben legalább +10 új személyes hírnek kell összegyűlnie. Ha 2 óra után még nincs meg a +10 hír, az app tovább vár, és akkor jelez hangosan, amikor a 10. új hír is megérkezik; ettől az új hangos értesítéstől indul újra a következő 2 órás ablak.
- Az Értesítések panel két SVG menüikont használ: a `Rendkívüli hírek` figyelmeztető háromszög ikont, a `Személyes hírösszefoglaló` hírkártya/lista ikont kap coral szikrával. A panel alatt `Működés` kártya magyarázza külön a két értesítési ág szabályait.
- A Hírfolyam témachip-sorának első, mindig elérhető összesítő eleme `Minden téma`. Ez az aktuális hírfolyamnézeten belüli témaszűrés nélküli összesítő, a konkrét témachipek pedig ugyanazon nézet listáját szűrik tovább.
- A Felolvasó ugyanazt a közös hírfolyamnézetet használja, mint a Hírfolyam. Ha bármelyik képernyőn változik a nézet, a másik képernyő is ezt örökli. A Felolvasó `Előző`, `Következő` és automatikus hírléptető műveletei az aktuális hírfolyamnézet listáján belül dolgoznak.
- A Felolvasó 30 elemű, hír-ID alapú lejátszási memóriát használ. Az `Előző` mindig a ténylegesen előzőleg lejátszott hírre lép, a `Következő` visszalépés után először a memória bejárt útvonalán halad előre, a memória végén pedig az aktuális feed következő még nem olvasott/felolvasott hírére ugrik. Frissítéskor az aktuális hír nem szakad meg, de a következő léptetés már a legfrissebb még nem felolvasott hírrel folytatja.
- A hírfolyamban három belső promóhír létezhet: AI Felolvasó, AI Asszisztens, illetve AI Asszisztens 5 kérdéses heti próba.
- A Beállítások / Prototípus / Fejlesztési beállítások panelen a hírfolyam promó előresorolása és az Ingyenes csomagon megjelenő AI Felolvasó próbaidő állapota ki-be kapcsolható. Ugyanitt 1-14 közötti számmal szimulálható a hátralévő próbanapok száma.
- Ugyanitt található az `Automatikus adatfeltöltés` prototípus-tesztkapcsoló. Ez alapértelmezetten bekapcsolt helyi tesztsegéd, szabályos tesztadatokkal tölti az üres továbbhaladási mezőket, és a `Prototípusadatok törlése` után is megtartja a menüben beállított értékét.
- Az automatikus adatfeltöltés nem végleges frontend- vagy backend-funkció, nem jelenhet meg a normál képernyőkön, és csak a prototípus gyors tesztelését szolgálja.
- A Felolvasó és Asszisztens oldalak jobb felső marketing CTA gombjai az `ELOFIZETESI_GOMB_MATRIX.md` táblából következnek. Az Asszisztens jobb felső fejlécében nem jelenhet meg módváltó ikon: ha nincs aktuális CTA, a jobb felső rész üres. Az Asszisztens módváltása a képernyő tetején lévő belső `Beszéd / Cset` vezérlővel történik.
- A `Cset` mód a korábbi `Néma` mód működését viszi tovább: gépelt kérdés, írott válasz, hangos felolvasás nélkül. A korábbi `Gépelés` mód megszűnt. A Cset ikonja finom, SVG alapú üzenetbuborék coral belső vonalakkal.
- A `Beszéd / Cset` módváltó a hírfolyamnézet-váltó szegmentált dizájnnyelvét és teljes magasságát használja, két oszloppal és megtartott módikonokkal.
- Cset módban nincs külön coral színű `Cset` címsor a módválasztó alatt; a csetpanel közvetlenül a `Beszéd / Cset` gombok alatt indul.
- Az AI Asszisztens heti 5 kérdéses próba CTA-ként vagy promóként jelenhet meg, de nem mutat külön maradék kérdésszámot a CTA felületén.
- Az előfizetéshez, próbaidőhöz, csomagváltáshoz, fizetési hibához és vásárlás-visszaállításhoz egyetlen központi `Csomagok és előfizetés` oldal tartozik.
- A Beállítások főmenü első sora a `Csomagok és előfizetés`. Ez alatt a `Hírbeállítások` csoportban az RSS-források, témák, helyi hírek és értesítések vannak; az `Alkalmazás` csoportban a fiók, megjelenés, hang/felolvasó és mobiladat/tárhely; a `Prototípus` csoportban a fejlesztési prototípuspanel és a CarPlay / Android Auto előnézet. A főmenü minden sora egységes, szemantikus inline SVG ikont használ finom coral akcentussal.
- CTA-ból érkezve a javasolt csomag automatikusan kijelölődik; menüből érkezve az aktuális aktív csomag jelölődik ki, kivéve ha van beállított következő csomag, mert akkor az marad kijelölve.
- A csomagkártyára kattintás csak kijelölés. A prototípusban a jóváhagyó gomb vált állapotot, a végleges appban ez indítja majd az App Store / Google Play folyamatát.
- Egy Hírbeszéd-fiók egyszerre csak egy aktív eszközön használhatja az appot. A prototípusban ez a Beállítások / Prototípus / Egyidejű eszközhasználat szimuláció menüpontból tesztelhető.
- Asszisztens Cset és promo cset módban a virtuális billentyűzet nem méretezheti át az egész appot, és az alsó menü nem ugorhat a billentyűzet fölé; csak a cset és a beviteli box alkalmazkodik a billentyűzet magasságához.
- Az Asszisztens Cset és promo cset buborékjai alulról építkeznek, vagyis rövid csetnél a beviteli mező fölött állnak, hosszú csetnél az új üzenet lent marad.
- A Felolvasás gomb pause/folytatás logikával működik, nem indítja elölről a hírt.
- A Hírléptető kikapcsolva a hír végén megállít, visszakapcsolva a következő hírrel indul.
- A Részletes hírek bekapcsolva az aktuális hírt részletes változatban elölről kezdi.
- A Rövidített hírekre visszaváltás a következő rövid hírrel indul.
- A Felolvasó képernyőn nincs külön Hangutasítások kártya vagy parancslista. A Mikrofon csak a hangutasítások hallgatását kapcsolja, az indításkor elhangzó rövid útmutató pedig elmondja, hogy aktív mikrofonnál a vezérlőgombok címei és a Kedvelés használhatók hangparancsként.
- A Felolvasó oldalon nincs felugró toast üzenet, hogy ne zavarja az autós/vezetési élményt.
- Minden fejlesztés után dokumentációs audit kell: frissíteni vagy ellenőrizni kell a projektállapotot, a prototípus működési leírást, a termékspecifikációt, a backend-auditot és az érintett szakterületi dokumentumokat.

## Felületi sablon

A prototípus app-szintű felületi sablonja a `styles.css` elején lévő `--hb-*` tokenekből dolgozik.

- Betűcsalád: `Inter, "Segoe UI", Arial, sans-serif`.
- Tipográfia: a kis kiegészítő szövegek, metaadatok, kártyacímek, gombok, képernyőcímek és hero címek külön tokenméretet kapnak.
- Kártyák: az általános kártyasugár `18px`, a nagy hero felületek sugara `24px`.
- Gombok: az elsődleges és másodlagos fő gombok alapmagassága `50px`, lekerekítésük `16px`.
- A sablon az onboarding, Felolvasó, Hírfolyam, Asszisztens, Beállítások, sheet/panel és előfizetési felületekre is rá van húzva.
- A Hírfolyam fejlécének jobb oldalán csak a keresés ikon látszik; színe `var(--accent)`, hogy világos és sötét témában is illeszkedjen az app színrendszeréhez.
- A Hírfolyam hírkártyáin a Kedvelés, Megosztás és Olvasott/Olvasatlan gyorsműveletek a forrás + idő meta sorában kompakt ikon-only vezérlők. Ezek nem növelhetik meg a meta sor magasságát; a prototípusban a meta sorban 14 px magasak minden mobil, Foldable és tablet nézetben. A láthatatlan érinthető/kattintható szélességük minden nézetben 32 px, miközben az ikon kicsi és középre igazított marad. Kattintási biztonság miatt az ikonok között nagykártyás/rácsos nézetben 6 px, kiskártyás és mobil fekvő nézetben 5 px vízszintes rés van.
- A Hírfolyam normál hírkártyái egységes kártyarácsot alkotnak. Nincs automatikus `first-child` / első hír kiemelés: az első normál hírkártya képmérete, szövegblokkja és címvágása egyezzen a többi normál hírkártyáéval. Külön promókártyák ettől eltérhetnek.
- A Beállítások főmenü sorai `.settings-menu-icon` inline SVG ikonokat használnak, ugyanabban a vékony, lekerekített, coral akcentusú vizuális nyelvben, mint az értesítési menüikonok.

## GitHub Pages

A GitHub publikáció kanonikus módja:

```powershell
.\publikalas.cmd
```

Száraz próba commit/push nélkül:

```powershell
.\publikalas.cmd -DryRun
```

Ha csak új, tiszta Pages futást kell indítani változatlan fájlokkal:

```powershell
.\publikalas.cmd -RetryDeployment
```

Sikertelen Pages deploy után nem szabad a GitHub felületen a `Re-run failed jobs`
gombot használni. A részletes szabályzat:

```text
GITHUB_PUBLIKALASI_SZABALYOK.txt
```

A kattintható prototípus belépési pontja a gyökérben lévő `index.html`. Feltöltéskor ezek a fő fájlok kellenek:

- `index.html`
- `styles.css`
- `app.js`
- `prototype-*.js`
- `prototype-*.css`
- `topics.json`
- `manifest.webmanifest`
- `sw.js`
- `assets/brand/`
- `assets/prototype/`

A régi statikus drótvázak törölve lettek; új képernyőtérkép csak az aktuális prototípus alapján készüljön.
