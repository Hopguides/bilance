# Dokumentacija sistema za letno oddajo računovodskih izkazov

## Pregled sistema

Sistem za letno oddajo računovodskih izkazov je celovita rešitev, ki slovenskim podjetjem omogoča pripravo in oddajo letnih računovodskih izkazov v skladu s Slovenskimi računovodskimi standardi (SRS) in zakonodajo. Sistem je posebej prilagojen za mikro d.o.o. podjetja in omogoča integracijo z računovodskim programom Metakocka.

## Ključne funkcionalnosti

1. **Vnos in urejanje računovodskih podatkov**
   - Obrazci za vnos osnovnih podatkov podjetja
   - Obrazci za vnos podatkov za bilanco stanja (SRS 20)
   - Obrazci za vnos podatkov za izkaz poslovnega izida (SRS 21)
   - Obrazci za vnos podatkov za izkaz denarnih tokov (SRS 22)
   - Obrazci za vnos podatkov za izkaz gibanja kapitala (SRS 23)
   - Obrazci za vnos poslovnih dogodkov, osnovnih sredstev in zalog

2. **Validacija in izračuni**
   - Preverjanje bilančnega ravnotežja
   - Izračun čistega poslovnega izida
   - Preverjanje skladnosti med različnimi izkazi
   - Izračun amortizacije osnovnih sredstev
   - Izračun vrednosti zalog
   - Izračun DDV

3. **Izvoz podatkov**
   - Generiranje PDF datotek za letno poročilo
   - Generiranje XML datotek za poenotene obrazce
   - Shranjevanje in arhiviranje poročil

4. **Integracija**
   - Povezava z računovodskim programom Metakocka
   - Integracija z AJPES portalom za elektronsko oddajo
   - Elektronsko podpisovanje dokumentov

5. **Uporabniški vmesnik**
   - Enostavna uporaba za direktorja
   - Pregledna nadzorna plošča
   - Opomniki za roke oddaje

## Arhitektura sistema

Sistem je zasnovan modularno in vključuje naslednje komponente:

1. **Integracijski modul z Metakocko**
   - Dvosmerna sinhronizacija podatkov
   - Uvoz transakcijskih podatkov
   - Izvoz pripravljenih izkazov

2. **Modul za vodenje računovodstva**
   - Vodenje glavne knjige
   - Knjiženje poslovnih dogodkov
   - Vodenje osnovnih sredstev in zalog

3. **Modul za pripravo računovodskih izkazov**
   - Avtomatsko generiranje izkazov
   - Ročne prilagoditve

4. **Modul za validacijo podatkov**
   - Preverjanje pravilnosti in skladnosti
   - Opozarjanje na napake

5. **Modul za izvoz podatkov**
   - Generiranje PDF in XML datotek
   - Priprava poročil po zahtevah AJPES

6. **Modul za oddajo poročil**
   - Integracija z AJPES portalom
   - Elektronsko podpisovanje
   - Sledenje statusu oddaje

7. **Uporabniški vmesnik**
   - Pregledna nadzorna plošča
   - Enostavni obrazci za vnos

## Tehnična dokumentacija

### Datotečna struktura

- `/accounting_system/` - Glavni direktorij sistema
  - `research_summary.md` - Povzetek raziskave o slovenskih računovodskih standardih
  - `system_architecture.md` - Podrobna arhitektura sistema
  - `input_forms_design.md` - Načrt obrazcev za vnos podatkov
  - `validation_logic.js` - Implementacija logike za izračune in validacijo
  - `export_functionality.js` - Implementacija funkcionalnosti za izvoz podatkov
  - `test_case.md` - Testni primer z vzorčnimi podatki
  - `exports/` - Direktorij za izvožene datoteke
  - `archive/` - Direktorij za arhivirane oddaje

### Razredi in funkcije

#### Validacija podatkov (`validation_logic.js`)

- `BalanceSheetValidator` - Validacija bilance stanja
- `IncomeStatementValidator` - Validacija izkaza poslovnega izida
- `CashFlowStatementValidator` - Validacija izkaza denarnih tokov
- `EquityStatementValidator` - Validacija izkaza gibanja kapitala
- `FixedAssetsCalculator` - Izračuni za osnovna sredstva
- `InventoryCalculator` - Izračuni za zaloge
- `VATCalculator` - Izračuni za DDV
- `BusinessEventValidator` - Validacija poslovnih dogodkov
- `AnnualReportValidator` - Validacija celotnega letnega poročila

#### Izvoz podatkov (`export_functionality.js`)

- `PDFGenerator` - Generiranje PDF datotek
- `XMLGenerator` - Generiranje XML datotek
- `AJPESIntegration` - Integracija z AJPES portalom
- `MetakockaIntegration` - Integracija z Metakocko
- `FileManager` - Upravljanje z datotekami
- `ExportManager` - Glavni razred za izvoz in oddajo

## Uporabniška dokumentacija

### Namestitev in konfiguracija

1. Namestite potrebne odvisnosti:
   ```
   npm install
   ```

2. Konfigurirajte povezavo z Metakocko:
   - Vnesite prijavne podatke za Metakocko
   - Nastavite parametre za sinhronizacijo

3. Konfigurirajte povezavo z AJPES:
   - Vnesite prijavne podatke za AJPES
   - Nastavite parametre za elektronsko podpisovanje

### Uporaba sistema

#### Priprava letnega poročila

1. **Vnos osnovnih podatkov podjetja**
   - Odprite obrazec za osnovne podatke
   - Vnesite ali posodobite podatke o podjetju
   - Shranite podatke

2. **Priprava računovodskih izkazov**
   - Izberite ustrezni obrazec (bilanca stanja, izkaz poslovnega izida, itd.)
   - Sistem bo avtomatsko uvozil podatke iz Metakocke
   - Preglejte in po potrebi prilagodite podatke
   - Shranite izkaz

3. **Validacija podatkov**
   - Sistem bo avtomatsko preveril pravilnost in skladnost podatkov
   - Preglejte morebitna opozorila ali napake
   - Odpravite napake, če obstajajo

4. **Izvoz podatkov**
   - Izberite možnost izvoza v PDF in/ali XML format
   - Preglejte generirane datoteke
   - Shranite datoteke lokalno

#### Oddaja letnega poročila

1. **Priprava za oddajo**
   - Preverite, ali so vsi potrebni izkazi pripravljeni
   - Preverite, ali so podatki pravilni in skladni

2. **Oddaja na AJPES**
   - Izberite možnost oddaje na AJPES
   - Vnesite prijavne podatke za AJPES (če še niso konfigurirani)
   - Potrdite oddajo
   - Sistem bo avtomatsko oddal poročilo in prikazal status oddaje

3. **Arhiviranje**
   - Sistem bo avtomatsko arhiviral oddano poročilo
   - Dostopajte do arhiviranih poročil preko sistema

### Roki za oddajo

- **Gospodarske družbe in zadruge**: do 31. marca tekočega leta za preteklo poslovno leto
- **Samostojni podjetniki**: do 31. marca tekočega leta za preteklo poslovno leto
- **Pravne osebe javnega prava**: do konca februarja tekočega leta za preteklo poslovno leto

## Vzdrževanje in podpora

### Posodobitve sistema

Sistem bo redno posodobljen v skladu s spremembami:
- Slovenskih računovodskih standardov (SRS)
- Zakonodaje na področju računovodstva in davkov
- AJPES zahtev za oddajo letnih poročil
- Metakocka API-ja

### Tehnična podpora

Za tehnično podporo se obrnite na:
- E-pošta: podpora@sistem-racunovodstvo.si
- Telefon: 01 234 5678
- Delovni čas: pon-pet, 8:00-16:00

## Zaključek

Sistem za letno oddajo računovodskih izkazov je celovita rešitev, ki slovenskim podjetjem omogoča enostavno pripravo in oddajo letnih poročil v skladu z zakonodajo. Sistem je posebej prilagojen za mikro d.o.o. podjetja in omogoča integracijo z računovodskim programom Metakocka. Z avtomatizacijo večine procesov in validacijo podatkov sistem zmanjšuje možnost napak in prihrani čas pri pripravi letnih poročil.
