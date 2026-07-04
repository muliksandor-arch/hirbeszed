# Hírbeszéd prototípus - rögzített működés

Aktuális prototípusverzió: **2.1**.

Ez a dokumentum a jelenlegi, elfogadott prototípus-működést rögzíti. A cél, hogy a további fejlesztések ne egymásra rakott javítások legyenek, hanem ehhez a stabil működési alaphoz igazodjanak.

## 1. Termékirány

A Hírbeszéd egy mobilos hírolvasó és hírfelolvasó alkalmazás prototípusa.

A jelenlegi fő gondolat:

- a felhasználó RSS-forrásokat és témákat választ;
- az app személyes hírfolyamot épít;
- a Felolvasó képernyőn a hírek kéz nélkül is hallgathatók;
- az Asszisztens a betöltött hírek értelmezésében és összefoglalásában segít;
- a prototípus PWA-ként működik, később mobilapp, Android Auto és Apple CarPlay irányba vihető tovább.

## 2. Fő képernyők

### Hírfolyam

A Hírfolyam jelenleg fejlesztési RSS-pillanatképből épül (`news.json`). Ez 6 magyar RSS-forrásból forrásonként 5 hírt tartalmaz, valós RSS-képpel, címmel, rövid leírással, részletesebb szöveggel és eredeti cikk URL-lel. A végleges appban ezt backend/API adja majd, az app csak a kész hírlistát veszi át.

Szűrési alapok:

- forrás ki/be kapcsolása;
- téma kiválasztása;
- legfrissebb, személyes, olvasatlan nézet;
- kedvelt hírek és előzmények.

A rövid hír az RSS cím és leírás mezőiből áll. A részletes hír RSS-ből származó bővebb szöveget vagy rövidített részletes leírást kap. Az eredeti cikklink adatként megmarad és a Részletes hír nézetből megnyitható, de a Felolvasó nem olvassa fel az URL-t.

A hírfolyamban három belső promóhír is megjelenhet a jogosultság szerint: AI Felolvasó, AI Asszisztens előfizetés, illetve AI Asszisztens heti 5 kérdéses próba. Ezek hírkártyaként viselkednek, coral kerettel és saját Kipróbálás gombbal. A Beállítások / Prototípus panelen a prototípusban kapcsolható, hogy ezek a promók előre legyenek-e sorolva a hírfolyam 2. és 4. helyére.

A hírkártyák forrás + idő meta sorában a Kedvelés, Megosztás és Olvasott/Olvasatlan gyorsműveletek kompakt ikon-only vezérlők. A vezérlők nem növelhetik meg a meta sor magasságát; a prototípusban 14 px magasak, hogy mobilon, Foldable nézetben és tableten is beleférjenek a forrás/idő sorba. A láthatatlan érinthető/kattintható gombdoboz minden nézetben 32 px széles, miközben a vizuális ikon kicsi és középre igazított marad. Kattintási biztonság miatt a vezérlők között nagykártyás és rácsos nézetben 6 px, kiskártyás és mobil fekvő nézetben 5 px vízszintes rés van.

A normál hírkártyák egységes rácselemek: az első normál hírkártya nem kap automatikus kiemelt vagy vezetőhír-szerű `first-child` megjelenést. Képmérete, szövegblokkja, címvágása és meta sora egyezzen a többi normál hírkártyáéval. Ha később vezetőhír funkció kell, azt külön termékdöntésként kell bevezetni, nem automatikusan az első listaelemre kötve.

A Felolvasó és Asszisztens oldalak jobb felső marketing CTA gombjai előfizetési állapot szerint változnak. A döntési tábla külön fájlban van rögzítve: `ELOFIZETESI_GOMB_MATRIX.md`. A gomb nem technikai ikon, hanem előfizetésre vezető szöveges ajánlat. Ingyenes használat állapotban a Felolvasó oldalon a Felolvasó funkció, az Asszisztens oldalon az Asszisztens funkció aktiválását ajánlja. AI Felolvasó előfizetés vagy próba alatt a következő ajánlat az Asszisztens funkció aktiválása. AI Asszisztens aktív előfizetésnél nincs további marketing CTA gomb.

A csomagokhoz és előfizetéshez egyetlen központi oldal tartozik: `Csomagok és előfizetés`. Ezt használja az első indításos csomagválasztás, a Beállítások / Csomagok és előfizetés menüpont, a Felolvasó és Asszisztens CTA, a promóciós CTA, a lejárt próba és a fizetési hiba kezelése is. CTA-ból érkezve az ajánlott csomag automatikusan kijelölődik. Menüből érkezve az aktuális aktív csomag van kijelölve, kivéve ha már van beállított következő csomag, mert akkor a következő csomag kijelölése marad érvényben. A csomagkártyára kattintás nem vált azonnal állapotot: a prototípusban külön jóváhagyó gomb végzi a váltást, a végleges appban ugyanez indítja az áruházi folyamatot.

### Felolvasó

A Felolvasó az app központi élménye. Nem “autós mód” néven fut, mert a felolvasás általánosabb: használható autóban, séta közben, otthon vagy munka mellett is.

A Felolvasó az AI Felolvasó előfizetés vagy az aktív 14 napos próba induló képernyője. Ingyenes csomag, lejárt próba vagy sikertelen fizetés esetén az app Hírfolyammal indul. Aktív AI Asszisztens előfizetésnél az Asszisztens indul.

Előfizetés nélküli Felolvasó belépéskor a prototípus Felolvasó promo módot nyit: az AI Felolvasó és az AI Asszisztens promóhírek váltakozva, korlátozott demóként futnak.

### Asszisztens

Az Asszisztens jelenleg prototípus-szintű. A célja:

- kérdések a betöltött hírekről;
- rövid összefoglalók;
- témák közötti eligazítás;
- később személyesebb hírkeresés és magyarázat.

A jelenlegi prototípus nem hív valódi AI API-t. Helyette fél-AI jellegű, szabályalapú válaszmotor dolgozik: felismeri a kérdésben a témát, forrást és szándékot, majd a betöltött RSS-hírekből állít össze természetesebb választ. A “részletesebben”, “folytasd” és hasonló kérések az előző asszisztensválaszhoz kapcsolt hírre épülnek. Ezt a réteget később backend/AI provider válthatja ki.

Az Asszisztens Gépelés, Néma és promo cset nézete billentyűzet-overlay logikát használ. A virtuális billentyűzet megjelenése nem méretezheti át az egész appot, és nem tolhatja fel az alsó menüt a billentyűzet fölé. A prototípus a `visualViewport` és `VirtualKeyboard` jeléből számolja a billentyűzet alsó takarását; ilyenkor nem oldalsó menüs nézetben az alsó menü elrejtődik, az Asszisztens nézet a teljes alsó területig leenged, a cset és a teljes `.composer` beviteli box pedig a billentyűzet teteje fölé fut. A beviteli box felett és alatt alapnézetben 14 px természetes távolság marad. Mobil fekvő nézetben ez a kompakt szabály szerint 7 px. A végleges natív appban ugyanezt a platform billentyűzet-inset értéke alapján kell működtetni.

A Gépelés, Néma és promo cset buborékjai alulról építkeznek: ha kevés üzenet van, az új buborékok közvetlenül a beviteli mező fölött jelennek meg, nem a csetablak tetején. Hosszabb beszélgetésnél a régi üzenetek felfelé gördülnek ki, az új üzenet pedig mindig lent marad.

### Beállítások

Itt kezelhető:

- RSS-források;
- témák;
- megjelenés;
- hang és felolvasó viselkedés;
- mobiladat és tárhely;
- helyi hírek;
- fiók és előfizetés;
- prototípusadatok törlése;
- egyidejű eszközhasználat szimulációja.

A bejelentkezett `Fiók és biztonság` panel egyoldalas fiókbiztonsági felület. Nem használ külön Profiladatok vagy Kapcsolt fiókok almenüt. A panelen `Fiók adatai` összefoglaló, Google/Facebook/Apple/E-mailes belépés kártyák, `Kétlépcsős védelem` sor, `Kijelentkezés` gomb és külön `Fiók törlése` veszélyzóna jelenik meg. A Google, Facebook és Apple kártyák brandelt SVG ikont használnak; az E-mailes belépés kártya az app saját `@` ikonját tartja meg.

A Beállítások / Prototípus oldal alcíme: `Fejlesztési beállítások`. Itt vannak azok a kapcsolók és tesztállapotok, amelyek nem végfelhasználói funkciók, hanem a prototípus ellenőrzését segítik.

Az `Automatikus adatfeltöltés` kizárólag prototípus-tesztelési segédeszköz. Alapértelmezetten be van kapcsolva, és azokon az oldalakon, ahol a továbbhaladáshoz adat kell, szabályos tesztadatokat tölt az üres mezőkbe. Ilyen például az e-mail regisztráció, a belépés, a 6 jegyű megerősítő kód és az RSS URL hozzáadása. A képernyőkön nincs külön nyoma, csak a Beállítások / Prototípus menüben kapcsolható.

Az automatikus adatfeltöltés nem kerülhet be a végleges frontendbe vagy backendbe termékfunkcióként. Ez helyi prototípus-környezeti beállítás, ezért a `Prototípusadatok törlése` nem módosítja: ha a tesztelő kikapcsolja, reset után is kikapcsolva marad; ha bekapcsolva hagyja, reset után is bekapcsolva marad.

Az `Egyidejű eszközhasználat szimuláció` három állapotot tud mutatni:

- `Normál állapot`: ez az eszköz az aktív eszköz, az app szabadon használható.
- `Másik eszköz aktív`: az app teljes képernyős blokkoló nézetet mutat, és megkérdezi, hogy a felhasználó átveszi-e a használatot ezen az eszközön.
- `Ez az eszköz leválasztva`: azt a helyzetet mutatja, amikor egy másik készülék átvette a használatot, ezért ezen az eszközön csak visszavétellel folytatható a használat.

A szimuláció célja, hogy backend nélkül is ellenőrizhető legyen az üzenet, az átvételi gomb, a leválasztott állapot és a visszavétel. A végleges appban ezt nem helyi kapcsoló, hanem backend jogosultság- és munkamenet-ellenőrzés vezérli.

## 3. Első használat

A rögzített első használati út:

1. Nyitóképernyő.
2. Regisztráció vagy bejelentkezés.
3. Adatvédelmi elfogadás.
4. Próbaidő / előfizetés kiválasztása.
5. RSS-források kiválasztása.
6. Az aktuális csomag szerinti induló oldal megnyitása.
7. AI Felolvasó próba vagy előfizetés esetén a felolvasás automatikus indítása.

Rögzített biztonsági szabály:

- Amíg az első használati onboarding nincs teljesen befejezve, minden új betöltés, frissítés vagy kényszerű onboarding-visszanyitás az üdvözlő/regisztrációs onboarding képernyőről indul.
- Félkész állapotból nem nyílhat vissza középső onboarding oldal, tehát nem maradhat kezdőpontként a Belépés, Fiók létrehozása, Kétlépcsős azonosítás, Csomagok és előfizetés vagy RSS-források képernyő.
- A teljesnek tekintett állapot feltétele: sikeres fiók/belépés, csomagválasztás, RSS-források mentése és az app belső felületének megnyitása.
- Ez a szabály csökkenti a félbehagyott belépési állapotok, rossz visszanyílások és onboarding alatti menümegjelenés kockázatát.

Aktuális onboarding képernyőszabályok:

- Onboarding alatt egyetlen kijelzőnézetben sem jelenhet meg appmenü.
- Az onboarding képernyők beállítástól függetlenül sötét vizuális környezetben futnak.
- A nyitókártya címe: `Üdvözlünk a jövő hírapplikációjában.`
- A nyitókártya leírása: `Maradj képben a friss magyar hírekkel akkor is, amikor nem a kijelzőt nézed. Hallgasd a felolvasást, vezéreld hanggal az appot, és kérdezz rá az aktualitásokra az asszisztenstől.`
- A nyitókártya chipjei: `Friss hírek`, `Felolvasás`, `Hírasszisztens`.
- A közösségi gombkészlet középre igazított, brandelt, reszponzív gombokból áll: `Folytatás Google-fiókkal`, `Folytatás Facebook-fiókkal`, `Folytatás Apple-fiókkal`.
- A végleges appban egy Hírbeszéd-profilhoz több hitelesítési azonosság kapcsolható: e-mail, Google, Facebook és Apple. Ha például egy korábbi Facebook-belépés után Google-belépés érkezik ugyanazzal az ellenőrzött e-mail címmel, a rendszer felismerheti az összekapcsolási lehetőséget, de nem fűzheti össze csendben a fiókokat. A kapcsoláshoz felhasználói jóváhagyás és biztonságos megerősítés kell. Apple Hide My Email / relay e-mail esetén automatikus e-mail-alapú összekapcsolás nem engedélyezett.
- A Beállítások / Fiók és biztonság oldalon a kapcsolt belépési módokat kártyák mutatják: Google, Facebook, Apple és E-mailes belépés. A `Kapcsolva` állapot semleges jelzés; a `Most ezzel vagy belépve` sor csak azt mutatja, melyik mód tartozik az aktuális munkamenethez.
- Meglévő social belépéshez e-mailes belépési mód kapcsolható a már elkészült e-mailes regisztrációs + 6 jegyű kódos megerősítő folyamat újrahasználásával. A prototípus ezt `add-email-login` módban kezeli, nem hoz létre új Hírbeszéd-fiókot.
- Ha social szolgáltatótól átvehető név vagy e-mail cím érkezik, a prototípus átveszi; ha hiányzik, a felhasználó adja meg. Az e-mailes hozzákapcsolásnál ugyanazok a mezőhibák, jelszószabályok, kódhibák és modális rendszerüzenetek érvényesek, mint az onboarding e-mailes regisztrációs folyamatban.
- Az utolsó működő belépési mód nem választható le. Ha a felhasználó ezt próbálja, a globális modális rendszerüzenet megállítja a műveletet.
- A `Kijelentkezés` teljes szélességű gomb. Előtte felhasználói magyarázat jelzi, hogy ez csak az adott eszközön léptet ki, a fiók, előfizetés és felhőben mentett beállítások megmaradnak.
- A panelen a `Fiók törlése` külön veszélyzónában van. Ez nem kijelentkezés, hanem fióktörlési folyamat indítása: a gomb előtt a felület figyelmeztet, hogy a felhőben tárolt fiókadatok, beállítások, RSS-források, érdeklődési adatok és kapcsolt belépési módok törlődnek, és a művelet nem állítható vissza. A figyelmeztetés külön jelzi, hogy App Store- vagy Google Play-előfizetés esetén az előfizetést törlés előtt az áruházban kell lemondani. Aktív fizetős vagy próba előfizetésnél a prototípus először `Előfizetés lemondása` modált nyit `Lemondást ellenőriztem` és `Mégsem` gombbal; csak ellenőrzés után következik a végleges `Fiók törlése?` megerősítés. A globális modális megerősítés ugyanilyen felhasználói véglegességi figyelmeztetést mutat, fejlesztői/prototípusos szöveg nélkül. `Mégsem` esetén a panelen marad, megerősítés után a prototípus helyi fiókadat-törléssel szimulálja a folyamatot és az üdvözlő/auth képernyőre tér vissza.
- A külön `Belépés` oldal e-mail-only felület: az alcíme `Belépés e-mail címmel`, a felső információs kártya címe `E-mailes belépés`, és az oldalon csak az e-mail mező, jelszó mező, `Belépés` gomb és `Elfelejtett jelszó` link marad. A közösségi folytatás a kezdőképernyőn érhető el.
- A Belépés oldalon a mezők gombnyomáskor és javítás közben is a közös mezőhiba-stílust használják: korall keret, `aria-invalid` és mező alatti rövid hibaszöveg.
- A Belépés oldal modális hibái: hiányzó e-mail cím, hibás e-mail formátum, hiányzó jelszó, sikertelen belépés, túl sok próbálkozás, megerősítetlen e-mail cím, nem használható fiók és hálózati/szerverhiba.
- A prototípus sikeres e-mailes belépési tesztadata: `teszt.prototipus@example.com` / `Hirbeszed1!`. Tesztcímek: `nincs.megerositve@example.com` megerősítetlen fiókhoz, `zarolt.fiok@example.com` nem használható fiókhoz, `szerverhiba@example.com` szerverhiba szimulációhoz. Ezek csak prototípus-tesztadatok, nem végleges frontend- vagy backend-szabályok.
- Az e-mailes fiókok kétlépcsős azonosítása alapértelmezetten bekapcsolt. A `Kétlépcsős védelem` menüben a felhasználó kikapcsolhatja vagy visszakapcsolhatja. Ez a kapcsoló a prototípusban is ugyanazt az állapotot vezérli, amely alapján az e-mailes belépés kódoldalt kér vagy közvetlenül beléptet.
- E-mailes belépésnél sikeres e-mail + jelszó után a rendszer a 2FA kapcsolót nézi: bekapcsolva a `Belépés megerősítése` kódoldal következik, kikapcsolva közvetlenül megtörténik a belépés. Közösségi folytatásnál a Hírbeszéd nem kér külön e-mail kódot, mert a szolgáltató hitelesítése érvényes.
- A `Kétlépcsős védelem` menüben nincs `Helyreállító kódok` sor; jelenleg csak az e-mailes kódos azonosítás kapcsolója látszik.
- Kijelentkezés után a prototípus nem nyit külön kijelentkezett `Fiók és biztonság` képernyőt. Auth-zárba kerül, elrejti a menüt, és az üdvözlő / belépési képernyőt mutatja.
- Fióktörlés után ugyanez az auth-záras visszatérés történik, de termékszinten ez végleges fiókműveletnek számít, ezért a backendnek külön szerveroldali törlési folyamatként kell kezelnie.
- Kijelentkezéskor fiókhoz kötött helyi adatreset fut: törlődik a csomagállapot, RSS-forrásválasztás, témaválasztás, érdeklődési profil, olvasási/kedvelési állapot, asszisztens-cset, megjelenési/hangpreferencia, kapcsolt fiókok és 2FA állapot. Ez továbbra sem teljes `Prototípusadatok törlése`: a helyi prototípus-tesztkörnyezeti kapcsolók, például az `Automatikus adatfeltöltés`, megmaradnak.
- Bejelentkezés után a végleges appnak a backendből vissza kell töltenie a felhasználó mentett állapotát. Ide tartozik az előfizetési csomag, RSS-csatorna beállítás, témák, érdeklődési körök, olvasási/kedvelési állapotok, megjelenési és hangpreferenciák, fiókbiztonság és kapcsolt fiókok. Másik eszközön belépve ugyanennek a személyes appállapotnak kell megjelennie.
- A `Jelszó visszaállítása` oldal a Belépés oldalhoz tartozó alfolyamat. A bal felső visszagomb és a `Vissza a belépéshez` link is a Belépés oldalra visz, nem az üdvözlő képernyőre.
- A jelszó-visszaállítás mezőhibái és folyamat-hibái modális rendszerüzenettel jelennek meg: hiányzó e-mail cím, hibás e-mail formátum, túl gyors újrakérés, nem használható fiók, valamint hálózati/szerverhiba. A sikeres küldés modális címe `Ellenőrizd az e-mailjeidet`, és a gombja `Vissza a belépéshez`.
- Biztonsági okból a reset sikerüzenete nem árulhatja el, hogy az e-mail címhez valóban tartozik-e Hírbeszéd-fiók. Érvényes e-mail formátumnál az üzenet általános: `Ha ehhez az e-mail címhez tartozik Hírbeszéd-fiók, elküldtük a jelszó-visszaállító linket.`
- A normál regisztráció e-mail-alapú. Telefonszám mező nincs a regisztrációs vagy belépési folyamatban.
- A kezdőképernyőn az e-mailes regisztráció gomb standard gombstílusú, nem elsődleges CTA.
- A Fiók létrehozása oldal felső kártyája információs, nem marketing jellegű: elmondja, hogy e-mailben 6 jegyű kód érkezik, és ezt a következő felugró ablakban kell megadni.
- A kódmegerősítő mező csak számot fogad, a helyőrzők kötőjelek, és a `Megerősítés` gomb csak mind a hat számjegy beírása után jelenhet meg.
- Az e-mail-kód megerősítő oldalon a prototípus tesztkódja `123456`. A `000000` szándékos lejárt kód szimuláció. Ezek csak kattintható prototípus-tesztadatok, nem végleges frontend- vagy backend-szabályok.
- Az e-mail-kód oldalon modális rendszerüzenet jelenik meg hibás kódnál, lejárt kódnál, túl sok próbálkozásnál, túl gyors újraküldésnél, sikertelen kódküldésnél és megszakadt vagy érvénytelen regisztrációs folyamatnál. Mezőhöz kötött hiba esetén a kódmező is hibás állapotot kap.
- A kezdőképernyőről indított minden továbbvivő út az adatvédelmi elfogadáshoz kötött; a belépési és regisztrációs aloldalakon nincs ismételt pipa.
- A `Belépés` és a `Fiók létrehozása` aloldalak visszagombja egy szinttel feljebb, az üdvözlő/regisztrációs kezdőképernyőre visz. A `Jelszó visszaállítása` oldal visszagombja kivétel: a Belépés oldalra tér vissza.
- Az onboarding RSS-forrásválasztóban a fő továbbvivő gomb felirata `Források mentése és tovább`, az új forrás gombja `+ RSS-forrás hozzáadása`, és az új forrás gomb a forráslista alatt, a tartalommal együtt gördül.

Ez az első benyomás kulcsfolyamata. A későbbi finomításoknál ezt kell a legsimábbra csiszolni.

## 4. Felolvasó állapotmodell

A Felolvasó fő állapotai:

- `playing`: a felolvasás aktív vagy aktívnak jelölt;
- `paused`: a felolvasás szüneteltetve van, de ugyanonnan folytatható;
- `mic`: a hangutasítások hallgatása be vagy ki van kapcsolva;
- `autoNext`: a hírléptető be vagy ki van kapcsolva;
- `detailedRead`: rövidített vagy részletes hírolvasás aktív;
- `carIndex`: az aktuális hír sorszáma.

A Felolvasó oldalon a DOM frissítése lehetőleg célzottan történik. Gombnyomáskor nem szabad az egész nézetet feleslegesen újrarenderelni, mert az villanást okozhat.

## 5. Felolvasó gombszabályok

### Mikrofon

Felirat: `Mikrofon`

Működés:

- bekapcsolva: a hangutasítások panel mutatja az aktuális parancsokat;
- kikapcsolva: a gomb benyomott állapotú;
- kikapcsolva a parancslista helyén segítő szöveg jelenik meg;
- a mikrofon csak a hangutasítások engedélyezését kapcsolja, nem állítja le a hírfelolvasást;
- a böngészős prototípusban a mikrofon nem figyel folyamatosan: bekapcsolt Mikrofon mellett csak akkor válik aktívvá, amikor a hír felolvasása véget ér;
- bekapcsolt Hírléptető mellett a hír végi hangutasítási ablak 3 másodpercig tart, majd a prototípus automatikusan továbblép;
- kikapcsolt Hírléptető mellett a hír végi mikrofonablak nyitva marad, amíg új felolvasás nem indul, a Mikrofon ki nem kapcsol, vagy a felhasználó Előző/Következő navigációt nem indít.

Megjelenés:

- kikapcsolt állapotban benyomott gomb;
- az ikon áthúzott mikrofon;
- bekapcsolt állapotban normál mikrofon ikon.

### Felolvasás

Felirat állapottól függően:

- `Felolvasás`, ha nem aktív;
- `Szünet`, ha éppen olvas;
- `Folytatás`, ha szüneteltetve van.

Rögzített szabály:

- ez a gomb pause/folytatás gomb;
- ha olvasás közben megnyomjuk, megállítja/szünetelteti;
- ha szünet után újra megnyomjuk, ugyanonnan folytatja;
- nem kezdheti elölről ugyanazt a hírt.

### Hírléptető

Felirat: `Hírléptető`

Működés:

- bekapcsolva: a hír végén automatikusan indul a következő hír;
- kikapcsolva: a hír végén megáll;
- kikapcsoltból bekapcsolva: a következő hírrel indul el a felolvasás.

Megjelenés:

- kikapcsolt állapotban benyomott gomb;
- az ikon áthúzással jelzi a kikapcsolt állapotot.

### Részletes hírek / Rövidített hírek

Felirat:

- `Részletes hírek`, ha rövidített módból lehet részletes módra váltani;
- `Rövidített hírek`, ha részletes módból lehet rövidített módra váltani.

Rögzített szabály:

- részletes mód bekapcsolásakor az aktuális hír részletes változata elölről indul;
- rövidített módra visszaváltáskor a következő hír indul rövidített formátumban;
- részletes módban a következő/előző hírek is részletes szöveggel olvasódnak fel, amíg a felhasználó vissza nem vált.

Megjelenés:

- részletes módban a gomb benyomott állapotú;
- rövidített módban normál állapotú.

### Előző és Következő

Felirat:

- `Előző`
- `Következő`

Működés:

- nem ragadnak be;
- csak érintéskor fut le a gombnyomás animáció;
- felengedés után normál állapotba térnek vissza;
- a felengedés nem villanthatja fel a teljes appot.

## 6. Hangutasítások

A hangutasítások listája mindig az aktuális gombfeliratokból épül.

Példa aktív mikrofon és bekapcsolt Hírléptető mellett:

```text
Hír végén 3 mp: Mikrofon · Szünet · Hírléptető · Előző · Részletes hírek · Kedvelés · Következő
```

Ha a Hírléptető nincs bekapcsolva, a hír végén a mikrofonablak nem záródik 3 másodperc után, mert nincs automatikus továbbhaladás. Ilyenkor a prototípus szóbeli vagy kézi parancsra vár.

Ha a mikrofon ki van kapcsolva, a lista helyett ez a logika érvényes:

```text
Hangutasítások kikapcsolva
Hangutasításokhoz kapcsold be a mikrofont a Mikrofon gomb megnyomásával.
```

Az alsó gombsor nem mozdulhat el attól, hogy a mikrofon be vagy ki van kapcsolva.

## 7. Menü és ikonrendszer

Az alsó menü négy pontja:

- Hírfolyam;
- Felolvasó;
- Asszisztens;
- Beállítások.

Ikonstílus:

- vonalas SVG ikonok;
- egységes vonalvastagság;
- türkiz és koral márkaszínek;
- világos és sötét módban is működő kontraszt;
- az aktív menüpont mögött puha fény;
- az aktív menüpontnál koral aláhúzás.

A Felolvasó ikon a márka hanghullám-jellegét viszi tovább szövegbuborék nélkül.

## 8. Gombvizuál

A Felolvasó gombjai a jelenlegi irány szerint:

- vonalas SVG ikonok;
- aktív vagy kikapcsolt állapotban enyhe benyomott hatás;
- koral derengés;
- az aktuálisan bekapcsolt/bennragadó állapot vizuálisan egyértelmű;
- pillanatgomboknál csak rövid nyomásanimáció.

Bennragadó állapotú gombok:

- Mikrofon kikapcsolva;
- Felolvasás szüneteltetve;
- Hírléptető kikapcsolva;
- Részletes hírek bekapcsolva.

Nem bennragadó gombok:

- Előző;
- Következő.

## 9. Felugró üzenetek és rendszerüzenet ablak

Az app-szintű, közös felugró rendszerüzenet ablak a folyamatot megakasztó hibák, figyelmeztetések és fontos információk egységes megjelenítése.

Technikai alap:

- HTML váz: `#appMessageOverlay`, `#appMessageCard`.
- Globális hívás: `window.showAppMessage({...})`.
- Bezárás: `window.closeAppMessage(...)`, a `Rendben` gomb, a háttérkattintás vagy az Escape billentyű.
- Típusok: `error`, `warning`, `info`, `success`.
- A komponens sötét és világos témában is az app színeit használja.
- Onboarding alatt is ugyanaz a komponens jelenik meg, az onboarding sötét vizuális környezetéhez igazodva.
- Amíg a rendszerüzenet ablak aktív, az app háttérfolyamatai interakciós szinten fel vannak függesztve: a fő app-részek `inert` állapotba kerülnek, és a háttér kattintásai, billentyűi, inputjai és űrlapműveletei nem futhatnak le.
- Desktop böngészős prototípus-nézetben kivétel a tesztelő keret kezelése: a képernyőméret-választó (`.prototype-viewport-toolbar`), a méretező fogó (`.prototype-resize-grip`), a visszaállító gomb (`.prototype-reset-frame`) és a `.prototype-frame` natív méretezése aktív marad, hogy nyitott rendszerüzenet mellett is ellenőrizhető legyen a reszponzív kinézet. A méretező fogó ilyenkor a modal rétege fölé kerül. Ezek fejlesztői előnézeti eszközök, nem az app háttérfolyamatai.

Használati szabály:

- Folyamatot megakasztó hiba esetén a közös rendszerüzenet ablakot kell használni. Példa: hibás e-mail formátum, hibás vagy lejárt kód, túl sok próbálkozás, hálózati hiba.
- Mezőhöz kötött hibánál a mező is kapjon hibajelzést: korall keret, `aria-invalid="true"` és a mező alatti rövid hibaszöveg.
- A rendszerüzenet ablak ilyenkor a hibaszöveget magyarázza el emberi nyelven, a mező alatti sor pedig pontosan megmutatja, hol kell javítani.
- A kezdő onboarding képernyőn minden továbbvivő gomb a közös rendszerüzenetet nyitja, ha a felhasználó még nem fogadta el az adatvédelmi tájékoztatót és a használati feltételeket. Ez a `Már van fiókom, belépek` gombra is érvényes.
- A szabályzat elfogadása a kezdőképernyőn történik, az értéke az onboarding állapotban továbbvihető. A belépési és regisztrációs aloldalak nem ismétlik meg a piparészt; a későbbi backend ezt az elfogadást a fiókhoz rögzíti majd szabályzatverzióval és időbélyeggel.
- Rövid, nem blokkoló visszajelzésekre fejléc-értesítést kell használni. Ez a korábbi alsó toast helyett a látható fejléc második sorában jelenik meg: fő képernyőn a `#pageTitle`, aloldali sheeten a `#sheetSubtitle` cserélődik le rövid időre. Az üzenet felülről beúszik, rövid ikon+szöveg formátumú, nem blokkol, majd visszaállítja az eredeti oldalcímet vagy alcímet.
- A fejléc-értesítés csak akkor kell, ha a felületváltozás önmagában nem ad elég visszajelzést. Ha a siker látható állapotváltozásból egyértelmű, nem kell külön értesítés.
- A Felolvasó oldalon továbbra sincs toast/felugró visszajelzés, mert a vezetéshez vagy passzív hallgatáshoz zavaró. Csak ténylegesen megakasztó, biztonsági vagy helyreállítási helyzetben jelenhet meg rendszerüzenet.

Első bekötött példa:

- A regisztrációs e-mail mező formátumellenőrzést kapott.
- Hibás e-mail formátumnál a regisztráció nem lép tovább a kódmegerősítő ablakra.
- A mező alatt megjelenik: `Adj meg egy érvényes e-mail címet.`
- A közös rendszerüzenet címe: `Hibás e-mail cím`.

## 10. Adattárolás

A prototípus helyben tárol:

- `localStorage` kulcs: `hirbeszed-state`;
- olvasott hírek;
- kedvelt hírek;
- előzmények;
- kiválasztott források;
- témák;
- előfizetés/próbaidő állapot;
- egyidejű eszközhasználat prototípus-állapota;
- automatikus adatfeltöltés prototípus-környezeti kapcsolója, amelyet a prototípusadatok törlése sem állít vissza;
- első használati folyamat állapota.

A prototípus jelenleg nem küld valódi adatot külső szerverre.

A végleges appban az aktív eszköz nem kizárólag helyi adat lesz. A backend tartja nyilván, hogy a fiók melyik készüléken aktív, és ha egy másik készülék átveszi a használatot, a korábbi eszköz leválasztott állapotot kap.

## 11. Modulok betöltési sorrendje

Az `index.html` jelenlegi betöltési sorrendje:

1. `app.js`
2. `prototype-onboarding.js`
3. `prototype-topics.js`
4. `prototype-settings.js`
5. `prototype-reader-controls.js`
6. `prototype-auth.js`
7. `prototype-layout.js`
8. `prototype-auto-preview.js`
9. `prototype-navigation.js`

Az alaplogika az `app.js` fájlban van. A `prototype-*` fájlok a stabilizált prototípus-modulok. Új fejlesztésnél érdemes ezt a szerkezetet megtartani, és csak akkor összevonni modulokat, ha már tényleges app-alap készül.

## 12. Stabilitási szabályok

A mostani működés megtartásához ezekre kell figyelni:

- gombnyomáskor ne legyen felesleges teljes `render()`;
- Felolvasó gomboknál célzott `updateCarDom()` frissítés legyen;
- kattintásra nem szabad ideiglenesen `data-theme` attribútumot törölni vagy visszaállítani;
- a service worker cache verzióját emelni kell, ha betöltött fájl változik;
- a script/css query verziókat is emelni kell, ha a böngésző régi kódot tarthat cache-ben;
- a Felolvasó oldalon a toast ne jelenjen meg;
- a menü és gombsor magassága ne változzon állapotváltástól;
- az aloldali visszagomb (`#sheetBack`) SVG alapú, lekerekített négyzetes felületgomb. Visszafogott, semleges felületet használ, accent színű túlhangsúlyozás nélkül. A funkciója marad a meglévő sheet-visszalépés/bezárás, az ikon nem lehet szövegkarakteres nyíl.
- a Fiók létrehozása oldalon a név, e-mail és jelszó mezők gépelés közben mezőszinten vezetik a felhasználót. Gombnyomáskor az első hibára konkrét modális hibaablak nyílik, a Rendben gomb után pedig a fókusz az első hibás mezőre kerül.
- a regisztrációs név kötelező, 2-80 karakter lehet, és tartalmazhat betűt, számot, szóközt, kötőjelet vagy aposztrófot.
- a regisztrációs jelszó kötelező, legalább 8 karakter, és kell bele kisbetű, nagybetű, szám, valamint különleges karakter. A szabályok nem placeholderben, hanem a jelszómező alatti ellenőrző listában jelennek meg.
- minden érdemi prototípus- vagy appfejlesztés után dokumentációs auditot kell tartani. Ellenőrizni kell legalább a `PROJEKT_ALLAPOT_CODEX.txt`, `PROTOTYPE.md`, `docs/prototipus-mukodes.md`, `docs/termek-specifikacio.md`, `BACKEND_FEJLESZTESI_DOKUMENTACIO.md` és az érintett szakterületi dokumentumok frissességét. Backendbe átviendő vagy onnan kizárandó szabályt a backend-audit dokumentumban is rögzíteni kell.

## 13. Jelenlegi prototípus-korlátok

Ezek még tudatos prototípus-korlátok:

- a hírek mintaadatokból jönnek;
- az RSS hozzáadás csak prototípus-szinten működik;
- a fizetés és előfizetés nem valódi áruházi folyamat;
- a mikrofonos hangfelismerés böngésző- és engedélyfüggő;
- a Felolvasó prototípusban nem folyamatosan figyel, hanem hír végén nyit mikrofonablakot: automata Hírléptető mellett 3 másodpercig, kézi módban nyitva maradva;
- a hangfelolvasás a böngésző `speechSynthesis` motorjára épül;
- Android Auto és CarPlay csak előnézeti irány, nem natív integráció;
- az Asszisztens még nem valódi AI háttérrel dolgozik.

## 14. GitHub publikálás

A GitHub publikáció rögzített módja a projekt gyökerében lévő:

```powershell
.\publikalas.cmd
```

A script újraépíti vagy frissíti a `.publish\hirbeszed-full-repo`
munkamappát, beállítja a Git szerzőt, commitol, pushol, megvárja a GitHub
Actions futást, majd ellenőrzi az élő GitHub Pages oldalon az app-verziót és
az asset verziójelölést.

Sikertelen GitHub Pages deploy után nem szabad a GitHub felületen a
`Re-run failed jobs` gombot használni. Változatlan fájlok melletti új, tiszta
Pages futáshoz:

```powershell
.\publikalas.cmd -RetryDeployment
```

A részletes publikálási szabályzat:

```text
GITHUB_PUBLIKALASI_SZABALYOK.txt
```

## 15. Következő fejlesztési fókuszok

A prototípus jelenlegi állapota után a legfontosabb irányok:

1. Felolvasó működés finomítása és a bekapcsolt gombdesign véglegesítése.
2. Első használat teljes simítása: regisztráció -> előfizetés -> RSS -> Felolvasó.
3. Hírforrások és témák valódi logikájának megtervezése.
4. Asszisztens szerepének pontosítása.
5. Technikai rendrakás egy későbbi, valódi app-alaphoz.
