# Spletna arhitektura sistema za letno oddajo računovodskih izkazov

## Pregled arhitekture

Spletna aplikacija za letno oddajo računovodskih izkazov bo implementirana kot moderna, odzivna spletna aplikacija z ločenim frontend in backend delom. Arhitektura bo sledila principom REST API in bo omogočala enostavno integracijo z zunanjimi sistemi (Metakocka, AJPES).

```
+------------------+        +------------------+        +------------------+
|                  |        |                  |        |                  |
|  React Frontend  | <----> |  Express Backend | <----> |  PostgreSQL DB   |
|                  |        |                  |        |                  |
+------------------+        +------------------+        +------------------+
        ^                           ^                           ^
        |                           |                           |
        v                           v                           v
+------------------+        +------------------+        +------------------+
|                  |        |                  |        |                  |
| Uporabniški      |        | Metakocka API    |        | Varnostne kopije |
| brskalnik        |        | AJPES API        |        | in obnovitev     |
|                  |        |                  |        |                  |
+------------------+        +------------------+        +------------------+
```

## Podatkovni model

### Entitete in relacije

#### 1. Uporabniki (Users)
- id (PK)
- username
- email
- password_hash
- role (admin, accountant, director)
- company_id (FK)
- created_at
- updated_at

#### 2. Podjetja (Companies)
- id (PK)
- name
- registration_number
- tax_number
- address
- postal_code
- city
- country
- size (micro, small, medium, large)
- activity_code
- representative
- foundation_date
- contact_phone
- contact_email
- metakocka_api_key
- metakocka_api_secret
- ajpes_username
- ajpes_password
- created_at
- updated_at

#### 3. Letna poročila (AnnualReports)
- id (PK)
- company_id (FK)
- year
- status (draft, validated, exported, submitted)
- submission_id
- submission_date
- created_by (FK to Users)
- updated_by (FK to Users)
- created_at
- updated_at

#### 4. Bilance stanja (BalanceSheets)
- id (PK)
- annual_report_id (FK)
- intangible_assets
- tangible_assets
- investment_property
- long_term_financial_investments
- long_term_business_receivables
- deferred_tax_assets
- assets_for_sale
- inventory
- short_term_financial_investments
- short_term_business_receivables
- cash_and_cash_equivalents
- short_term_deferrals
- called_up_capital
- capital_reserves
- reserves_from_profit
- revaluation_reserves
- fair_value_reserves
- retained_earnings
- net_profit_for_period
- provisions
- long_term_financial_liabilities
- long_term_business_liabilities
- deferred_tax_liabilities
- liabilities_for_sale
- short_term_financial_liabilities
- short_term_business_liabilities
- short_term_accruals
- created_at
- updated_at

#### 5. Izkazi poslovnega izida (IncomeStatements)
- id (PK)
- annual_report_id (FK)
- net_sales_revenue
- change_in_inventory_value
- capitalized_own_products
- other_operating_revenue
- costs_of_goods_materials_services
- labor_costs
- write_offs
- other_operating_expenses
- financial_revenue_from_shares
- financial_revenue_from_loans
- financial_revenue_from_receivables
- financial_expenses_from_impairment
- financial_expenses_from_liabilities
- financial_expenses_from_payables
- other_revenue
- other_expenses
- income_tax
- deferred_tax
- net_profit
- created_at
- updated_at

#### 6. Izkazi denarnih tokov (CashFlowStatements)
- id (PK)
- annual_report_id (FK)
- operating_cash_flow
- investing_cash_flow
- financing_cash_flow
- total_cash_flow
- initial_cash_balance
- final_cash_balance
- created_at
- updated_at

#### 7. Izkazi gibanja kapitala (EquityStatements)
- id (PK)
- annual_report_id (FK)
- initial_equity
- equity_changes
- comprehensive_income
- equity_movements
- final_equity
- created_at
- updated_at

#### 8. Poslovni dogodki (BusinessEvents)
- id (PK)
- company_id (FK)
- date
- type (invoice_issued, invoice_received, payment, etc.)
- document_number
- partner_id (FK)
- amount
- vat_amount
- account
- description
- created_by (FK to Users)
- created_at
- updated_at

#### 9. Osnovna sredstva (FixedAssets)
- id (PK)
- company_id (FK)
- name
- inventory_number
- purchase_date
- purchase_value
- depreciation_group
- depreciation_rate
- depreciation_method
- useful_life
- current_value
- accumulated_depreciation
- location
- notes
- created_at
- updated_at

#### 10. Zaloge (Inventory)
- id (PK)
- company_id (FK)
- item_code
- name
- unit
- quantity
- purchase_price
- selling_price
- inventory_value
- location
- last_purchase_date
- last_sale_date
- minimum_stock
- notes
- created_at
- updated_at

#### 11. Izvozi (Exports)
- id (PK)
- annual_report_id (FK)
- type (pdf, xml)
- file_path
- created_by (FK to Users)
- created_at

#### 12. Oddaje (Submissions)
- id (PK)
- annual_report_id (FK)
- submission_id
- status
- message
- submitted_by (FK to Users)
- submitted_at
- response_data

### ER diagram

```
Users 1--* BusinessEvents
Users 1--* Exports
Users 1--* Submissions
Users *--1 Companies

Companies 1--* AnnualReports
Companies 1--* BusinessEvents
Companies 1--* FixedAssets
Companies 1--* Inventory

AnnualReports 1--1 BalanceSheets
AnnualReports 1--1 IncomeStatements
AnnualReports 1--1 CashFlowStatements
AnnualReports 1--1 EquityStatements
AnnualReports 1--* Exports
AnnualReports 1--* Submissions
```

## API končne točke

### Avtentikacija in uporabniki

- `POST /api/auth/register` - Registracija novega uporabnika
- `POST /api/auth/login` - Prijava uporabnika
- `POST /api/auth/logout` - Odjava uporabnika
- `GET /api/auth/me` - Pridobitev podatkov o trenutnem uporabniku
- `PUT /api/auth/me` - Posodobitev podatkov o trenutnem uporabniku
- `PUT /api/auth/password` - Sprememba gesla

### Podjetja

- `GET /api/companies` - Seznam podjetij (za administratorje)
- `POST /api/companies` - Ustvarjanje novega podjetja
- `GET /api/companies/:id` - Podrobnosti podjetja
- `PUT /api/companies/:id` - Posodobitev podjetja
- `DELETE /api/companies/:id` - Brisanje podjetja

### Letna poročila

- `GET /api/annual-reports` - Seznam letnih poročil
- `POST /api/annual-reports` - Ustvarjanje novega letnega poročila
- `GET /api/annual-reports/:id` - Podrobnosti letnega poročila
- `PUT /api/annual-reports/:id` - Posodobitev letnega poročila
- `DELETE /api/annual-reports/:id` - Brisanje letnega poročila
- `GET /api/annual-reports/:id/validate` - Validacija letnega poročila
- `POST /api/annual-reports/:id/export` - Izvoz letnega poročila (PDF, XML)
- `POST /api/annual-reports/:id/submit` - Oddaja letnega poročila na AJPES

### Bilance stanja

- `GET /api/balance-sheets/:id` - Podrobnosti bilance stanja
- `POST /api/balance-sheets` - Ustvarjanje nove bilance stanja
- `PUT /api/balance-sheets/:id` - Posodobitev bilance stanja
- `DELETE /api/balance-sheets/:id` - Brisanje bilance stanja
- `GET /api/balance-sheets/:id/validate` - Validacija bilance stanja

### Izkazi poslovnega izida

- `GET /api/income-statements/:id` - Podrobnosti izkaza poslovnega izida
- `POST /api/income-statements` - Ustvarjanje novega izkaza poslovnega izida
- `PUT /api/income-statements/:id` - Posodobitev izkaza poslovnega izida
- `DELETE /api/income-statements/:id` - Brisanje izkaza poslovnega izida
- `GET /api/income-statements/:id/validate` - Validacija izkaza poslovnega izida

### Izkazi denarnih tokov

- `GET /api/cash-flow-statements/:id` - Podrobnosti izkaza denarnih tokov
- `POST /api/cash-flow-statements` - Ustvarjanje novega izkaza denarnih tokov
- `PUT /api/cash-flow-statements/:id` - Posodobitev izkaza denarnih tokov
- `DELETE /api/cash-flow-statements/:id` - Brisanje izkaza denarnih tokov
- `GET /api/cash-flow-statements/:id/validate` - Validacija izkaza denarnih tokov

### Izkazi gibanja kapitala

- `GET /api/equity-statements/:id` - Podrobnosti izkaza gibanja kapitala
- `POST /api/equity-statements` - Ustvarjanje novega izkaza gibanja kapitala
- `PUT /api/equity-statements/:id` - Posodobitev izkaza gibanja kapitala
- `DELETE /api/equity-statements/:id` - Brisanje izkaza gibanja kapitala
- `GET /api/equity-statements/:id/validate` - Validacija izkaza gibanja kapitala

### Poslovni dogodki

- `GET /api/business-events` - Seznam poslovnih dogodkov
- `POST /api/business-events` - Ustvarjanje novega poslovnega dogodka
- `GET /api/business-events/:id` - Podrobnosti poslovnega dogodka
- `PUT /api/business-events/:id` - Posodobitev poslovnega dogodka
- `DELETE /api/business-events/:id` - Brisanje poslovnega dogodka

### Osnovna sredstva

- `GET /api/fixed-assets` - Seznam osnovnih sredstev
- `POST /api/fixed-assets` - Ustvarjanje novega osnovnega sredstva
- `GET /api/fixed-assets/:id` - Podrobnosti osnovnega sredstva
- `PUT /api/fixed-assets/:id` - Posodobitev osnovnega sredstva
- `DELETE /api/fixed-assets/:id` - Brisanje osnovnega sredstva
- `POST /api/fixed-assets/:id/depreciate` - Izračun amortizacije

### Zaloge

- `GET /api/inventory` - Seznam zalog
- `POST /api/inventory` - Ustvarjanje nove zaloge
- `GET /api/inventory/:id` - Podrobnosti zaloge
- `PUT /api/inventory/:id` - Posodobitev zaloge
- `DELETE /api/inventory/:id` - Brisanje zaloge

### Integracija z Metakocko

- `GET /api/metakocka/sync` - Sinhronizacija podatkov iz Metakocke
- `POST /api/metakocka/import` - Uvoz podatkov iz Metakocke
- `POST /api/metakocka/export` - Izvoz podatkov v Metakocko

### Integracija z AJPES

- `GET /api/ajpes/status/:submissionId` - Preverjanje statusa oddaje
- `POST /api/ajpes/submit` - Oddaja poročila na AJPES

## Struktura uporabniškega vmesnika

### Glavne strani

1. **Nadzorna plošča (Dashboard)**
   - Pregled stanja letnih poročil
   - Opomniki za roke oddaje
   - Grafični prikaz ključnih finančnih kazalnikov
   - Nedavne aktivnosti

2. **Letna poročila**
   - Seznam letnih poročil po letih
   - Status poročil (osnutek, validirano, izvoženo, oddano)
   - Možnosti za ustvarjanje, urejanje, brisanje, izvoz in oddajo

3. **Računovodski izkazi**
   - Bilanca stanja
   - Izkaz poslovnega izida
   - Izkaz denarnih tokov
   - Izkaz gibanja kapitala

4. **Poslovni dogodki**
   - Seznam poslovnih dogodkov
   - Filtriranje po datumu, tipu, znesku
   - Dodajanje, urejanje in brisanje dogodkov

5. **Osnovna sredstva**
   - Seznam osnovnih sredstev
   - Amortizacijski načrt
   - Dodajanje, urejanje in brisanje sredstev

6. **Zaloge**
   - Seznam zalog
   - Vrednotenje zalog
   - Dodajanje, urejanje in brisanje zalog

7. **Nastavitve**
   - Podatki o podjetju
   - Uporabniški profil
   - Integracija z Metakocko
   - Integracija z AJPES

### Komponente uporabniškega vmesnika

1. **Navigacija**
   - Glavna navigacija (stranska vrstica)
   - Zgornja vrstica (uporabniški profil, obvestila)
   - Drobtinice za navigacijo

2. **Obrazci**
   - Obrazci za vnos podatkov za vse računovodske izkaze
   - Validacija v realnem času
   - Avtomatski izračuni in seštevki

3. **Tabele**
   - Prikaz seznamov (poročila, dogodki, sredstva, zaloge)
   - Sortiranje in filtriranje
   - Paginacija

4. **Grafi in vizualizacije**
   - Prikaz finančnih podatkov
   - Primerjava po letih
   - Ključni kazalniki uspešnosti

5. **Modalna okna**
   - Potrditvena okna
   - Obrazci za hitro urejanje
   - Prikaz podrobnosti

6. **Obvestila**
   - Sistemska obvestila
   - Opomniki za roke
   - Potrditve akcij

## Varnostni vidiki

1. **Avtentikacija**
   - JWT (JSON Web Tokens) za avtentikacijo
   - Varna hramba gesel (bcrypt)
   - Omejevanje poskusov prijave

2. **Avtorizacija**
   - Različne vloge uporabnikov (admin, računovodja, direktor)
   - Preverjanje pravic za vsako akcijo
   - Omejen dostop do podatkov

3. **Varnost podatkov**
   - Šifriranje občutljivih podatkov
   - HTTPS za vse komunikacije
   - Sanitizacija vhodnih podatkov

4. **Varnostne kopije**
   - Redne varnostne kopije baze podatkov
   - Možnost obnovitve podatkov
   - Beleženje sprememb (audit trail)

## Tehnična implementacija

### Frontend (React.js)

```
/src
  /assets        # Statične datoteke (slike, ikone)
  /components    # Ponovno uporabne komponente
    /common      # Splošne komponente (gumbi, vnosna polja)
    /forms       # Obrazci za vnos podatkov
    /layout      # Komponente za postavitev
    /tables      # Komponente za prikaz tabel
    /charts      # Komponente za grafe in vizualizacije
  /contexts      # React konteksti (avtentikacija, obvestila)
  /hooks         # Lastni React hooks
  /pages         # Strani aplikacije
    /dashboard
    /annual-reports
    /financial-statements
    /business-events
    /fixed-assets
    /inventory
    /settings
  /services      # Storitve za komunikacijo z API-jem
  /utils         # Pomožne funkcije
  /validation    # Validacijska pravila
  App.js         # Glavna komponenta aplikacije
  index.js       # Vstopna točka aplikacije
```

### Backend (Node.js z Express)

```
/src
  /config        # Konfiguracijske datoteke
  /controllers   # Kontrolerji za API končne točke
  /middleware    # Vmesna programska oprema (avtentikacija, validacija)
  /models        # Podatkovni modeli
  /routes        # Definicije API poti
  /services      # Poslovne logike in storitve
    /validation  # Validacijska logika
    /export      # Funkcionalnost za izvoz
    /metakocka   # Integracija z Metakocko
    /ajpes       # Integracija z AJPES
  /utils         # Pomožne funkcije
  app.js         # Glavna aplikacija
  server.js      # Strežnik
```

### Baza podatkov (PostgreSQL)

```
/migrations      # Migracijske datoteke za bazo podatkov
/seeds           # Podatki za inicializacijo baze
```

## Načrt implementacije

1. **Vzpostavitev osnovne strukture projekta**
   - Inicializacija React aplikacije
   - Vzpostavitev Express strežnika
   - Konfiguracija PostgreSQL baze podatkov

2. **Implementacija avtentikacije in avtorizacije**
   - Registracija in prijava uporabnikov
   - JWT avtentikacija
   - Upravljanje vlog in pravic

3. **Implementacija podatkovnega modela**
   - Kreiranje tabel v bazi podatkov
   - Implementacija modelov
   - Migracije in seedi

4. **Implementacija API končnih točk**
   - CRUD operacije za vse entitete
   - Validacija vhodnih podatkov
   - Upravljanje napak

5. **Implementacija uporabniškega vmesnika**
   - Postavitev in navigacija
   - Obrazci za vnos podatkov
   - Tabele in seznami
   - Grafi in vizualizacije

6. **Integracija obstoječe validacijske logike**
   - Prenos validacijske logike v spletno aplikacijo
   - Implementacija validacije v realnem času
   - Prikaz validacijskih napak

7. **Implementacija funkcionalnosti za izvoz**
   - Generiranje PDF datotek
   - Generiranje XML datotek
   - Shranjevanje in prenos datotek

8. **Integracija z zunanjimi sistemi**
   - Povezava z Metakocko
   - Povezava z AJPES
   - Testiranje integracij

9. **Testiranje in optimizacija**
   - Testiranje vseh funkcionalnosti
   - Optimizacija zmogljivosti
   - Varnostni pregled

10. **Namestitev v produkcijsko okolje**
    - Konfiguracija DigitalOcean App Platform
    - Namestitev aplikacije
    - Konfiguracija domene in SSL
    - Monitoring in vzdrževanje
