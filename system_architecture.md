# Arhitektura sistema za letno oddajo računovodskih izkazov

## Pregled sistema

Sistem za letno oddajo računovodskih izkazov za slovensko mikro d.o.o. podjetje bo omogočal sprotno vodenje računovodstva skozi leto in pripravo ter oddajo letnih poročil preko AJPES portala. Sistem bo integriran z obstoječim programom Metakocka in bo prilagojen za uporabo s strani direktorja.

## Komponente sistema

### 1. Integracijski modul z Metakocko
- **Namen**: Omogoča dvosmerno sinhronizacijo podatkov med sistemom in Metakocko
- **Funkcionalnosti**:
  - Uvoz transakcijskih podatkov iz Metakocke
  - Uvoz glavne knjige in saldakontov
  - Sinhronizacija šifrantov (stranke, dobavitelji, artikli)
  - Izvoz pripravljenih računovodskih izkazov nazaj v Metakocko (opcijsko)
- **Tehnologija**: API integracija z Metakocko, periodična sinhronizacija

### 2. Modul za vodenje računovodstva
- **Namen**: Omogoča sprotno vodenje računovodstva skozi leto
- **Funkcionalnosti**:
  - Pregled in urejanje glavne knjige
  - Vnos in urejanje poslovnih dogodkov
  - Knjiženje računov in drugih dokumentov
  - Vodenje saldakontov kupcev in dobaviteljev
  - Vodenje osnovnih sredstev
  - Vodenje zalog
- **Tehnologija**: Spletna aplikacija z relacijsko podatkovno bazo

### 3. Modul za pripravo računovodskih izkazov
- **Namen**: Priprava računovodskih izkazov po SRS
- **Funkcionalnosti**:
  - Priprava bilance stanja (SRS 20)
  - Priprava izkaza poslovnega izida (SRS 21)
  - Priprava izkaza denarnih tokov (SRS 22)
  - Priprava izkaza gibanja kapitala (SRS 23)
  - Avtomatsko generiranje izkazov iz podatkov glavne knjige
  - Ročne prilagoditve in popravki
- **Tehnologija**: Algoritem za generiranje izkazov, predloge po SRS

### 4. Modul za validacijo podatkov
- **Namen**: Preverjanje pravilnosti in skladnosti podatkov
- **Funkcionalnosti**:
  - Preverjanje matematične pravilnosti izkazov
  - Preverjanje skladnosti med različnimi izkazi
  - Preverjanje skladnosti s SRS
  - Opozarjanje na morebitne napake ali neskladnosti
  - Predlogi za popravke
- **Tehnologija**: Validacijska pravila, poslovna logika

### 5. Modul za izvoz podatkov
- **Namen**: Priprava podatkov za oddajo na AJPES
- **Funkcionalnosti**:
  - Izvoz v PDF format za letno poročilo
  - Izvoz v XML format za poenotene obrazce
  - Generiranje poročil po zahtevah AJPES
  - Priprava spremnih dokumentov
- **Tehnologija**: PDF generator, XML generator

### 6. Modul za oddajo poročil
- **Namen**: Oddaja poročil na AJPES portal
- **Funkcionalnosti**:
  - Integracija z AJPES portalom
  - Elektronsko podpisovanje dokumentov
  - Sledenje statusu oddaje
  - Arhiviranje oddanih poročil
  - Opomniki za roke oddaje
- **Tehnologija**: API integracija z AJPES, digitalno podpisovanje

### 7. Uporabniški vmesnik
- **Namen**: Enostavna uporaba sistema za direktorja
- **Funkcionalnosti**:
  - Pregledna nadzorna plošča
  - Enostavni obrazci za vnos podatkov
  - Vizualizacija finančnih podatkov
  - Poročila in analize
  - Opomniki in obvestila
- **Tehnologija**: Odziven spletni vmesnik, prilagojen za različne naprave

## Tehnična arhitektura

### Zaledni sistem (Backend)
- **Programski jezik**: Python/Django ali Node.js
- **Podatkovna baza**: PostgreSQL
- **API**: REST API za komunikacijo s čelnim delom in integracijo z Metakocko
- **Varnost**: HTTPS, avtentikacija, avtorizacija, šifriranje podatkov

### Čelni del (Frontend)
- **Tehnologija**: React.js ali Vue.js
- **Oblikovanje**: Odziven dizajn, prilagojen za različne naprave
- **Uporabniška izkušnja**: Intuitivni vmesniki, prilagojeni za direktorja

### Integracije
- **Metakocka**: API integracija za sinhronizacijo podatkov
- **AJPES**: Integracija za oddajo poročil
- **Digitalno podpisovanje**: Integracija s ponudniki digitalnih potrdil

## Podatkovni model

### Glavne entitete
1. **Podjetje**: Podatki o podjetju
2. **Uporabniki**: Uporabniki sistema (direktor, računovodja)
3. **Konto**: Kontni načrt
4. **Knjižba**: Knjižbe v glavni knjigi
5. **Dokument**: Računi, dobavnice in drugi dokumenti
6. **Partner**: Kupci in dobavitelji
7. **Osnovno sredstvo**: Osnovna sredstva podjetja
8. **Zaloga**: Zaloge materiala in blaga
9. **Računovodski izkaz**: Generirani računovodski izkazi
10. **Poročilo**: Oddana poročila na AJPES

## Varnostni vidiki
- Šifriranje občutljivih podatkov
- Redne varnostne kopije
- Beleženje dostopov in sprememb
- Različni nivoji pravic uporabnikov
- Skladnost z GDPR

## Načrt implementacije
1. Vzpostavitev osnovne infrastrukture
2. Implementacija integracije z Metakocko
3. Razvoj modula za vodenje računovodstva
4. Razvoj modula za pripravo računovodskih izkazov
5. Implementacija validacije podatkov
6. Razvoj modula za izvoz podatkov
7. Implementacija integracije z AJPES
8. Razvoj uporabniškega vmesnika
9. Testiranje in optimizacija
10. Dokumentacija in usposabljanje

## Prednosti predlagane arhitekture
- Integracija z obstoječim sistemom Metakocka
- Avtomatizacija priprave računovodskih izkazov
- Validacija podatkov za zmanjšanje napak
- Enostavna uporaba za direktorja
- Skladnost s slovenskimi računovodskimi standardi
- Avtomatizacija oddaje poročil na AJPES
- Možnost sprotnega vodenja računovodstva in letne oddaje poročil
