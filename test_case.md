# Testni primer za sistem letne oddaje računovodskih izkazov

## Vzorčni podatki za testiranje

### Osnovni podatki podjetja
```json
{
  "name": "Vzorčno podjetje d.o.o.",
  "registrationNumber": "1234567000",
  "taxNumber": "SI12345678",
  "address": "Slovenska cesta 1, 1000 Ljubljana",
  "size": "micro",
  "activityCode": "62.010",
  "representative": "Janez Novak",
  "foundationDate": "2015-01-01",
  "fiscalYear": {
    "start": "2024-01-01",
    "end": "2024-12-31"
  },
  "contact": {
    "phone": "01 234 5678",
    "email": "info@vzorcno-podjetje.si"
  }
}
```

### Bilanca stanja
```json
{
  "intangibleAssets": 5000,
  "tangibleAssets": 50000,
  "investmentProperty": 0,
  "longTermFinancialInvestments": 0,
  "longTermBusinessReceivables": 0,
  "deferredTaxAssets": 0,
  "assetsForSale": 0,
  "inventory": 10000,
  "shortTermFinancialInvestments": 0,
  "shortTermBusinessReceivables": 30000,
  "cashAndCashEquivalents": 25000,
  "shortTermDeferrals": 1000,
  "calledUpCapital": 7500,
  "capitalReserves": 0,
  "reservesFromProfit": 750,
  "revaluationReserves": 0,
  "fairValueReserves": 0,
  "retainedEarnings": 80000,
  "netProfitForPeriod": 15000,
  "provisions": 0,
  "longTermFinancialLiabilities": 0,
  "longTermBusinessLiabilities": 0,
  "deferredTaxLiabilities": 0,
  "liabilitiesForSale": 0,
  "shortTermFinancialLiabilities": 0,
  "shortTermBusinessLiabilities": 17750,
  "shortTermAccruals": 0
}
```

### Izkaz poslovnega izida
```json
{
  "netSalesRevenue": 150000,
  "changeInInventoryValue": 0,
  "capitalizedOwnProducts": 0,
  "otherOperatingRevenue": 2000,
  "costsOfGoodsMaterialsServices": 70000,
  "laborCosts": 50000,
  "writeOffs": 10000,
  "otherOperatingExpenses": 2000,
  "financialRevenueFromShares": 0,
  "financialRevenueFromLoans": 0,
  "financialRevenueFromReceivables": 0,
  "financialExpensesFromImpairment": 0,
  "financialExpensesFromLiabilities": 0,
  "financialExpensesFromPayables": 0,
  "otherRevenue": 0,
  "otherExpenses": 0,
  "incomeTax": 5000,
  "deferredTax": 0,
  "netProfit": 15000
}
```

### Izkaz denarnih tokov
```json
{
  "operatingCashFlow": 20000,
  "investingCashFlow": -15000,
  "financingCashFlow": -5000,
  "totalCashFlow": 0,
  "initialCashBalance": 25000,
  "finalCashBalance": 25000
}
```

### Izkaz gibanja kapitala
```json
{
  "initialEquity": 88250,
  "equityChanges": 0,
  "comprehensiveIncome": 15000,
  "equityMovements": 0,
  "finalEquity": 103250
}
```

## Testni scenariji

### 1. Testiranje validacije podatkov

#### Test bilančnega ravnotežja
```javascript
const { BalanceSheetValidator } = require('./validation_logic');

const balanceSheet = {
  // Vzorčni podatki bilance stanja
  intangibleAssets: 5000,
  tangibleAssets: 50000,
  // ... ostali podatki
};

const validationResult = BalanceSheetValidator.validateBalance(balanceSheet);
console.log('Validacija bilančnega ravnotežja:', validationResult);
```

#### Test izračuna čistega poslovnega izida
```javascript
const { IncomeStatementValidator } = require('./validation_logic');

const incomeStatement = {
  // Vzorčni podatki izkaza poslovnega izida
  netSalesRevenue: 150000,
  // ... ostali podatki
};

const validationResult = IncomeStatementValidator.validateNetProfit(incomeStatement);
console.log('Validacija čistega poslovnega izida:', validationResult);
```

### 2. Testiranje izvoza podatkov

#### Test generiranja PDF
```javascript
const { PDFGenerator } = require('./export_functionality');

const annualReport = {
  balanceSheet: {
    // Vzorčni podatki bilance stanja
  },
  incomeStatement: {
    // Vzorčni podatki izkaza poslovnega izida
  },
  // ... ostali podatki
};

const companyInfo = {
  // Vzorčni podatki o podjetju
};

async function testPDFGeneration() {
  const pdfData = await PDFGenerator.generateAnnualReportPDF(annualReport, companyInfo);
  console.log('PDF generiran, velikost:', pdfData.length);
}

testPDFGeneration();
```

#### Test generiranja XML
```javascript
const { XMLGenerator } = require('./export_functionality');

const annualReport = {
  // Vzorčni podatki letnega poročila
};

const companyInfo = {
  // Vzorčni podatki o podjetju
};

const xmlData = XMLGenerator.generateAJPESXML(annualReport, companyInfo);
console.log('XML generiran, velikost:', xmlData.length);
```

### 3. Testiranje integracije z Metakocko

```javascript
const { MetakockaIntegration } = require('./export_functionality');

const credentials = {
  username: 'testuser',
  password: 'testpassword'
};

async function testMetakockaIntegration() {
  const data = await MetakockaIntegration.getDataForAnnualReport(credentials, 2024);
  console.log('Podatki pridobljeni iz Metakocke:', data);
}

testMetakockaIntegration();
```

### 4. Testiranje celotnega procesa

```javascript
const { ExportManager } = require('./export_functionality');

const annualReport = {
  year: 2024,
  balanceSheet: {
    // Vzorčni podatki bilance stanja
  },
  incomeStatement: {
    // Vzorčni podatki izkaza poslovnega izida
  },
  cashFlowStatement: {
    // Vzorčni podatki izkaza denarnih tokov
  },
  equityStatement: {
    // Vzorčni podatki izkaza gibanja kapitala
  }
};

const companyInfo = {
  // Vzorčni podatki o podjetju
};

const metakockaCredentials = {
  username: 'metakocka_user',
  password: 'metakocka_password'
};

const ajpesCredentials = {
  username: 'ajpes_user',
  password: 'ajpes_password'
};

async function testFullProcess() {
  // Samo izvoz brez oddaje
  const exportResult = await ExportManager.exportAnnualReport(annualReport, companyInfo);
  console.log('Rezultat izvoza:', exportResult);
  
  // Izvoz in oddaja
  const submissionResult = await ExportManager.exportAndSubmitAnnualReport(
    annualReport,
    companyInfo,
    metakockaCredentials,
    ajpesCredentials
  );
  console.log('Rezultat oddaje:', submissionResult);
}

testFullProcess();
```

## Navodila za testiranje

1. Ustvarite datoteko `test.js` v direktoriju `/home/ubuntu/accounting_system/`
2. Kopirajte želeni testni scenarij v datoteko
3. Zaženite test z ukazom `node test.js`
4. Preverite rezultate v konzoli

## Pričakovani rezultati

### Validacija podatkov
- Bilančno ravnotežje: Sredstva (121.000 EUR) = Obveznosti do virov sredstev (121.000 EUR)
- Čisti poslovni izid: Izračunan (15.000 EUR) = Deklariran (15.000 EUR)

### Izvoz podatkov
- PDF datoteka: Uspešno generirana in shranjena v `/home/ubuntu/accounting_system/exports/`
- XML datoteka: Uspešno generirana in shranjena v `/home/ubuntu/accounting_system/exports/`

### Integracija z Metakocko
- Podatki uspešno pridobljeni iz Metakocke
- Podatki uspešno sinhronizirani z Metakocko

### Celoten proces
- Izvoz: Uspešno generirane in shranjene datoteke
- Oddaja: Uspešno oddano poročilo na AJPES s pridobljenim ID-jem oddaje
