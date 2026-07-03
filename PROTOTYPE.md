# Hírbeszéd - kattintható prototípus

Aktuális prototípusverzió: **2.003**.

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

## Fő képernyők

- **Hírfolyam**: RSS-forrásokra és témákra szűrt hírlista.
- **Felolvasó**: automatikusan induló, hangvezérelhető hírfelolvasó nézet.
- **Asszisztens**: prototípus-szintű hírkérdező és összefoglaló felület.
- **Beállítások**: RSS-források, témák, megjelenés, hang, fiók és előfizetés.

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

## Rögzített működés

A részletes magyar működési leírás itt található:

```text
docs/prototipus-mukodes.md
```

Rövid összegzés:

- Első használat: regisztráció -> próbaidő/előfizetés -> RSS-források -> az aktuális csomag szerinti induló oldal.
- Induló oldal: Ingyenes csomag / lejárt próba / sikertelen fizetés esetén Hírfolyam, AI Felolvasó előfizetés vagy aktív 14 napos AI Felolvasó próba esetén Felolvasó, AI Asszisztens előfizetésnél Asszisztens.
- A hírfolyamban három belső promóhír létezhet: AI Felolvasó, AI Asszisztens, illetve AI Asszisztens 5 kérdéses heti próba.
- A Beállítások / Prototípus / Fejlesztési beállítások panelen a hírfolyam promó előresorolása és az Ingyenes csomagon megjelenő AI Felolvasó próbaidő állapota ki-be kapcsolható. Ugyanitt 1-14 közötti számmal szimulálható a hátralévő próbanapok száma.
- A Felolvasó és Asszisztens oldalak jobb felső marketing CTA gombjai az `ELOFIZETESI_GOMB_MATRIX.md` táblából következnek.
- Az előfizetéshez, próbaidőhöz, csomagváltáshoz, fizetési hibához és vásárlás-visszaállításhoz egyetlen központi `Csomagok és előfizetés` oldal tartozik.
- CTA-ból érkezve a javasolt csomag automatikusan kijelölődik; menüből érkezve az aktuális aktív csomag jelölődik ki, kivéve ha van beállított következő csomag, mert akkor az marad kijelölve.
- A csomagkártyára kattintás csak kijelölés. A prototípusban a jóváhagyó gomb vált állapotot, a végleges appban ez indítja majd az App Store / Google Play folyamatát.
- Egy Hírbeszéd-fiók egyszerre csak egy aktív eszközön használhatja az appot. A prototípusban ez a Beállítások / Prototípus / Egyidejű eszközhasználat szimuláció menüpontból tesztelhető.
- Asszisztens Gépelés, Néma és promo cset módban a virtuális billentyűzet nem méretezheti át az egész appot, és az alsó menü nem ugorhat a billentyűzet fölé; csak a cset és a beviteli box alkalmazkodik a billentyűzet magasságához.
- Az Asszisztens Gépelés, Néma és promo cset buborékjai alulról építkeznek, vagyis rövid csetnél a beviteli mező fölött állnak, hosszú csetnél az új üzenet lent marad.
- A Felolvasás gomb pause/folytatás logikával működik, nem indítja elölről a hírt.
- A Hírléptető kikapcsolva a hír végén megállít, visszakapcsolva a következő hírrel indul.
- A Részletes hírek bekapcsolva az aktuális hírt részletes változatban elölről kezdi.
- A Rövidített hírekre visszaváltás a következő rövid hírrel indul.
- A Mikrofon csak a hangutasítások hallgatását kapcsolja, kikapcsolva a parancslista helyén segítő szöveg látszik.
- A Felolvasó oldalon nincs felugró toast üzenet, hogy ne zavarja az autós/vezetési élményt.

## Felületi sablon

A prototípus app-szintű felületi sablonja a `styles.css` elején lévő `--hb-*` tokenekből dolgozik.

- Betűcsalád: `Inter, "Segoe UI", Arial, sans-serif`.
- Tipográfia: a kis kiegészítő szövegek, metaadatok, kártyacímek, gombok, képernyőcímek és hero címek külön tokenméretet kapnak.
- Kártyák: az általános kártyasugár `18px`, a nagy hero felületek sugara `24px`.
- Gombok: az elsődleges és másodlagos fő gombok alapmagassága `50px`, lekerekítésük `16px`.
- A sablon az onboarding, Felolvasó, Hírfolyam, Asszisztens, Beállítások, sheet/panel és előfizetési felületekre is rá van húzva.

## GitHub Pages

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
