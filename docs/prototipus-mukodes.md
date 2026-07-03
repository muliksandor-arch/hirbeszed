# Hírbeszéd prototípus - rögzített működés

Aktuális prototípusverzió: **2.003**.

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

A Beállítások / Prototípus oldal alcíme: `Fejlesztési beállítások`. Itt vannak azok a kapcsolók és tesztállapotok, amelyek nem végfelhasználói funkciók, hanem a prototípus ellenőrzését segítik.

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

## 9. Felugró üzenetek

A Felolvasó oldalon nincs toast/felugró visszajelzés, mert a vezetéshez vagy passzív hallgatáshoz zavaró.

Más képernyőkön a toast használható:

- kedvelés;
- beállítás visszajelzés;
- RSS hozzáadás;
- hibaüzenetek.

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
- a menü és gombsor magassága ne változzon állapotváltástól.

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

## 14. Következő fejlesztési fókuszok

A prototípus jelenlegi állapota után a legfontosabb irányok:

1. Felolvasó működés finomítása és a bekapcsolt gombdesign véglegesítése.
2. Első használat teljes simítása: regisztráció -> előfizetés -> RSS -> Felolvasó.
3. Hírforrások és témák valódi logikájának megtervezése.
4. Asszisztens szerepének pontosítása.
5. Technikai rendrakás egy későbbi, valódi app-alaphoz.
