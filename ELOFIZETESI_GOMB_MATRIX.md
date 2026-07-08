# Előfizetési állapotok és fejléc akciógombok

Ez a tábla azt rögzíti, hogy az előfizetési állapot alapján milyen jobb felső marketing / előfizetési CTA gomb jelenjen meg a Felolvasó és az Asszisztens oldalon.

| # | Előfizetési állapot | Felolvasó módban CTA felirat | Asszisztens módban CTA felirat |
| ---: | --- | --- | --- |
| 1 | Ingyenes csomag | Aktiváld a Felolvasó funkciót | Aktiváld az Asszisztens funkciót |
| 2 | AI Felolvasó próbaidő | Aktiváld az Asszisztens funkciót | Aktiváld az Asszisztens funkciót |
| 3 | AI Felolvasó aktív előfizetés | Aktiváld az Asszisztens funkciót | Aktiváld az Asszisztens funkciót |
| 4 | AI Asszisztens aktív előfizetés | Nincs ajánló gomb | Nincs ajánló gomb |
| 5 | AI Felolvasó próba lejárt | Aktiváld a Felolvasó funkciót | Aktiváld az Asszisztens funkciót |
| 6 | Sikertelen fizetés / előfizetési hiba | Előfizetési hiba | Előfizetési hiba |
| 7 | AI Asszisztens heti 5 kérdéses próba | Aktiváld az Asszisztens funkciót | Aktiváld az Asszisztens funkciót |

## Értelmezés

- A gomb marketing szerepű, ezért mindig cselekvésre ösztönző, verbes CTA legyen.
- A jobb felső akcióterületen ezeken kívül Asszisztens módváltó ikon nem jelenhet meg. Ha az állapot szerint nincs CTA, a jobb felső akcióterület üres.
- Az egységes megszólítási minta: "Aktiváld a/az ... funkciót".
- Ingyenes csomag állapotban a Felolvasó oldalon a Felolvasó funkció, az Asszisztens oldalon az Asszisztens funkció aktiválása jelenik meg.
- AI Felolvasó előfizetés vagy próba alatt a következő upsell az AI Asszisztens, ezért a CTA az Asszisztens funkció aktiválására hív.
- AI Asszisztens aktív előfizetésnél nincs további előfizetési ajánló gomb.
- A heti 5 kérdéses próba célja az AI Asszisztens teljes előfizetésre váltása, ezért ott is az Asszisztens funkció aktiválása marad az ajánlott CTA.

## Céloldal és automatikus kijelölés

- Minden CTA az egységes `Csomagok és előfizetés` oldalra vezet.
- A CTA nem külön csomagválasztó oldalt nyit, hanem ugyanazt a központi előfizetéskezelő felületet.
- Ha a CTA Felolvasót ajánl, az `AI Felolvasó` csomag legyen automatikusan kijelölve.
- Ha a CTA Asszisztenst ajánl, az `AI Asszisztens` csomag legyen automatikusan kijelölve.
- Ha a CTA előfizetési hibát jelez, az előfizetés oldalon a `Fizetési hiba javítása` akció legyen kiemelve.
- A kijelölés még nem vált csomagot. A prototípusban a jóváhagyó gomb állítja át az állapotot, a végleges appban ugyanez indítja az áruházi folyamatot.

## Ingyenes csomagra visszatérés

- Az Ingyenes csomag nem előfizetés.
- Fizetős AI csomagról Ingyenes csomagra visszalépni a végleges appban az App Store / Google Play előfizetés lemondását vagy kezelését jelenti.
- A prototípusban ez azonnal visszaállítja az állapotot Ingyenes csomagra. A kártyákon kell jelezni, ha a valós appban a kifizetett időszak végéig a fizetős hozzáférés még élhet.
