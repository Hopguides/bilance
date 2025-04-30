// Logika za izračune in validacijo za sistem letne oddaje računovodskih izkazov

/**
 * Razred za validacijo in izračune bilance stanja
 */
class BalanceSheetValidator {
  /**
   * Preveri bilančno ravnotežje (sredstva = obveznosti do virov sredstev)
   * @param {Object} balanceSheet - Objekt z vrednostmi bilance stanja
   * @returns {Object} - Rezultat validacije
   */
  static validateBalance(balanceSheet) {
    const totalAssets = this.calculateTotalAssets(balanceSheet);
    const totalLiabilities = this.calculateTotalLiabilities(balanceSheet);
    
    const isBalanced = Math.abs(totalAssets - totalLiabilities) < 0.01; // Dovolimo majhno razliko zaradi zaokroževanja
    
    return {
      isValid: isBalanced,
      totalAssets,
      totalLiabilities,
      difference: totalAssets - totalLiabilities,
      message: isBalanced ? 'Bilanca je uravnotežena' : 'Bilanca ni uravnotežena: sredstva niso enaka obveznostim do virov sredstev'
    };
  }
  
  /**
   * Izračuna skupna sredstva
   * @param {Object} balanceSheet - Objekt z vrednostmi bilance stanja
   * @returns {number} - Vsota vseh sredstev
   */
  static calculateTotalAssets(balanceSheet) {
    // A. Dolgoročna sredstva
    const longTermAssets = (
      (balanceSheet.intangibleAssets || 0) +
      (balanceSheet.tangibleAssets || 0) +
      (balanceSheet.investmentProperty || 0) +
      (balanceSheet.longTermFinancialInvestments || 0) +
      (balanceSheet.longTermBusinessReceivables || 0) +
      (balanceSheet.deferredTaxAssets || 0)
    );
    
    // B. Kratkoročna sredstva
    const shortTermAssets = (
      (balanceSheet.assetsForSale || 0) +
      (balanceSheet.inventory || 0) +
      (balanceSheet.shortTermFinancialInvestments || 0) +
      (balanceSheet.shortTermBusinessReceivables || 0) +
      (balanceSheet.cashAndCashEquivalents || 0)
    );
    
    // C. Kratkoročne aktivne časovne razmejitve
    const shortTermDeferrals = balanceSheet.shortTermDeferrals || 0;
    
    return longTermAssets + shortTermAssets + shortTermDeferrals;
  }
  
  /**
   * Izračuna skupne obveznosti do virov sredstev
   * @param {Object} balanceSheet - Objekt z vrednostmi bilance stanja
   * @returns {number} - Vsota vseh obveznosti do virov sredstev
   */
  static calculateTotalLiabilities(balanceSheet) {
    // A. Kapital
    const equity = (
      (balanceSheet.calledUpCapital || 0) +
      (balanceSheet.capitalReserves || 0) +
      (balanceSheet.reservesFromProfit || 0) +
      (balanceSheet.revaluationReserves || 0) +
      (balanceSheet.fairValueReserves || 0) +
      (balanceSheet.retainedEarnings || 0) +
      (balanceSheet.netProfitForPeriod || 0)
    );
    
    // B. Rezervacije in dolgoročne pasivne časovne razmejitve
    const provisions = balanceSheet.provisions || 0;
    
    // C. Dolgoročne obveznosti
    const longTermLiabilities = (
      (balanceSheet.longTermFinancialLiabilities || 0) +
      (balanceSheet.longTermBusinessLiabilities || 0) +
      (balanceSheet.deferredTaxLiabilities || 0)
    );
    
    // Č. Kratkoročne obveznosti
    const shortTermLiabilities = (
      (balanceSheet.liabilitiesForSale || 0) +
      (balanceSheet.shortTermFinancialLiabilities || 0) +
      (balanceSheet.shortTermBusinessLiabilities || 0)
    );
    
    // D. Kratkoročne pasivne časovne razmejitve
    const shortTermAccruals = balanceSheet.shortTermAccruals || 0;
    
    return equity + provisions + longTermLiabilities + shortTermLiabilities + shortTermAccruals;
  }
  
  /**
   * Preveri obvezna polja v bilanci stanja
   * @param {Object} balanceSheet - Objekt z vrednostmi bilance stanja
   * @returns {Object} - Rezultat validacije
   */
  static validateRequiredFields(balanceSheet) {
    const requiredFields = [
      'calledUpCapital',
      'cashAndCashEquivalents'
    ];
    
    const missingFields = requiredFields.filter(field => 
      balanceSheet[field] === undefined || balanceSheet[field] === null
    );
    
    return {
      isValid: missingFields.length === 0,
      missingFields,
      message: missingFields.length === 0 ? 
        'Vsa obvezna polja so izpolnjena' : 
        `Manjkajo naslednja obvezna polja: ${missingFields.join(', ')}`
    };
  }
}

/**
 * Razred za validacijo in izračune izkaza poslovnega izida
 */
class IncomeStatementValidator {
  /**
   * Izračuna čisti poslovni izid
   * @param {Object} incomeStatement - Objekt z vrednostmi izkaza poslovnega izida
   * @returns {number} - Čisti poslovni izid
   */
  static calculateNetProfit(incomeStatement) {
    // Prihodki
    const revenues = (
      (incomeStatement.netSalesRevenue || 0) +
      (incomeStatement.changeInInventoryValue || 0) +
      (incomeStatement.capitalizedOwnProducts || 0) +
      (incomeStatement.otherOperatingRevenue || 0) +
      (incomeStatement.financialRevenueFromShares || 0) +
      (incomeStatement.financialRevenueFromLoans || 0) +
      (incomeStatement.financialRevenueFromReceivables || 0) +
      (incomeStatement.otherRevenue || 0)
    );
    
    // Odhodki
    const expenses = (
      (incomeStatement.costsOfGoodsMaterialsServices || 0) +
      (incomeStatement.laborCosts || 0) +
      (incomeStatement.writeOffs || 0) +
      (incomeStatement.otherOperatingExpenses || 0) +
      (incomeStatement.financialExpensesFromImpairment || 0) +
      (incomeStatement.financialExpensesFromLiabilities || 0) +
      (incomeStatement.financialExpensesFromPayables || 0) +
      (incomeStatement.otherExpenses || 0)
    );
    
    // Davek
    const tax = (
      (incomeStatement.incomeTax || 0) +
      (incomeStatement.deferredTax || 0)
    );
    
    return revenues - expenses - tax;
  }
  
  /**
   * Preveri skladnost izračunanega in vnesenega čistega poslovnega izida
   * @param {Object} incomeStatement - Objekt z vrednostmi izkaza poslovnega izida
   * @returns {Object} - Rezultat validacije
   */
  static validateNetProfit(incomeStatement) {
    const calculatedNetProfit = this.calculateNetProfit(incomeStatement);
    const declaredNetProfit = incomeStatement.netProfit || 0;
    
    const isValid = Math.abs(calculatedNetProfit - declaredNetProfit) < 0.01;
    
    return {
      isValid,
      calculatedNetProfit,
      declaredNetProfit,
      difference: calculatedNetProfit - declaredNetProfit,
      message: isValid ? 
        'Čisti poslovni izid je pravilno izračunan' : 
        'Čisti poslovni izid ni skladen z izračunom iz posameznih postavk'
    };
  }
  
  /**
   * Preveri obvezna polja v izkazu poslovnega izida
   * @param {Object} incomeStatement - Objekt z vrednostmi izkaza poslovnega izida
   * @returns {Object} - Rezultat validacije
   */
  static validateRequiredFields(incomeStatement) {
    const requiredFields = [
      'netSalesRevenue',
      'netProfit'
    ];
    
    const missingFields = requiredFields.filter(field => 
      incomeStatement[field] === undefined || incomeStatement[field] === null
    );
    
    return {
      isValid: missingFields.length === 0,
      missingFields,
      message: missingFields.length === 0 ? 
        'Vsa obvezna polja so izpolnjena' : 
        `Manjkajo naslednja obvezna polja: ${missingFields.join(', ')}`
    };
  }
}

/**
 * Razred za validacijo in izračune izkaza denarnih tokov
 */
class CashFlowStatementValidator {
  /**
   * Preveri skladnost začetnega stanja, končnega stanja in denarnega izida
   * @param {Object} cashFlowStatement - Objekt z vrednostmi izkaza denarnih tokov
   * @returns {Object} - Rezultat validacije
   */
  static validateCashBalance(cashFlowStatement) {
    const operatingCashFlow = cashFlowStatement.operatingCashFlow || 0;
    const investingCashFlow = cashFlowStatement.investingCashFlow || 0;
    const financingCashFlow = cashFlowStatement.financingCashFlow || 0;
    
    const totalCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;
    const initialCashBalance = cashFlowStatement.initialCashBalance || 0;
    const finalCashBalance = cashFlowStatement.finalCashBalance || 0;
    
    const calculatedFinalBalance = initialCashBalance + totalCashFlow;
    const isValid = Math.abs(calculatedFinalBalance - finalCashBalance) < 0.01;
    
    return {
      isValid,
      totalCashFlow,
      calculatedFinalBalance,
      declaredFinalBalance: finalCashBalance,
      difference: calculatedFinalBalance - finalCashBalance,
      message: isValid ? 
        'Končno stanje denarnih sredstev je pravilno izračunano' : 
        'Končno stanje denarnih sredstev ni skladno z izračunom'
    };
  }
  
  /**
   * Preveri obvezna polja v izkazu denarnih tokov
   * @param {Object} cashFlowStatement - Objekt z vrednostmi izkaza denarnih tokov
   * @returns {Object} - Rezultat validacije
   */
  static validateRequiredFields(cashFlowStatement) {
    const requiredFields = [
      'initialCashBalance',
      'finalCashBalance'
    ];
    
    const missingFields = requiredFields.filter(field => 
      cashFlowStatement[field] === undefined || cashFlowStatement[field] === null
    );
    
    return {
      isValid: missingFields.length === 0,
      missingFields,
      message: missingFields.length === 0 ? 
        'Vsa obvezna polja so izpolnjena' : 
        `Manjkajo naslednja obvezna polja: ${missingFields.join(', ')}`
    };
  }
}

/**
 * Razred za validacijo in izračune izkaza gibanja kapitala
 */
class EquityStatementValidator {
  /**
   * Preveri skladnost začetnega stanja, sprememb in končnega stanja kapitala
   * @param {Object} equityStatement - Objekt z vrednostmi izkaza gibanja kapitala
   * @returns {Object} - Rezultat validacije
   */
  static validateEquityBalance(equityStatement) {
    const initialEquity = equityStatement.initialEquity || 0;
    const equityChanges = equityStatement.equityChanges || 0;
    const comprehensiveIncome = equityStatement.comprehensiveIncome || 0;
    const equityMovements = equityStatement.equityMovements || 0;
    
    const calculatedFinalEquity = initialEquity + equityChanges + comprehensiveIncome + equityMovements;
    const declaredFinalEquity = equityStatement.finalEquity || 0;
    
    const isValid = Math.abs(calculatedFinalEquity - declaredFinalEquity) < 0.01;
    
    return {
      isValid,
      calculatedFinalEquity,
      declaredFinalEquity,
      difference: calculatedFinalEquity - declaredFinalEquity,
      message: isValid ? 
        'Končno stanje kapitala je pravilno izračunano' : 
        'Končno stanje kapitala ni skladno z izračunom'
    };
  }
  
  /**
   * Preveri obvezna polja v izkazu gibanja kapitala
   * @param {Object} equityStatement - Objekt z vrednostmi izkaza gibanja kapitala
   * @returns {Object} - Rezultat validacije
   */
  static validateRequiredFields(equityStatement) {
    const requiredFields = [
      'initialEquity',
      'finalEquity'
    ];
    
    const missingFields = requiredFields.filter(field => 
      equityStatement[field] === undefined || equityStatement[field] === null
    );
    
    return {
      isValid: missingFields.length === 0,
      missingFields,
      message: missingFields.length === 0 ? 
        'Vsa obvezna polja so izpolnjena' : 
        `Manjkajo naslednja obvezna polja: ${missingFields.join(', ')}`
    };
  }
}

/**
 * Razred za validacijo in izračune osnovnih sredstev
 */
class FixedAssetsCalculator {
  /**
   * Izračuna amortizacijo osnovnega sredstva
   * @param {Object} fixedAsset - Objekt s podatki o osnovnem sredstvu
   * @returns {number} - Znesek amortizacije
   */
  static calculateDepreciation(fixedAsset) {
    const purchaseValue = fixedAsset.purchaseValue || 0;
    const depreciationRate = fixedAsset.depreciationRate || 0;
    const accumulatedDepreciation = fixedAsset.accumulatedDepreciation || 0;
    const residualValue = fixedAsset.residualValue || 0;
    
    // Osnova za amortizacijo
    const depreciationBase = purchaseValue - residualValue;
    
    // Preostala vrednost za amortizacijo
    const remainingValue = depreciationBase - accumulatedDepreciation;
    
    // Če je preostala vrednost manjša ali enaka 0, ni več amortizacije
    if (remainingValue <= 0) {
      return 0;
    }
    
    // Izračun letne amortizacije
    const annualDepreciation = depreciationBase * (depreciationRate / 100);
    
    // Če je letna amortizacija večja od preostale vrednosti, vrnemo preostalo vrednost
    return Math.min(annualDepreciation, remainingValue);
  }
  
  /**
   * Izračuna trenutno vrednost osnovnega sredstva
   * @param {Object} fixedAsset - Objekt s podatki o osnovnem sredstvu
   * @returns {number} - Trenutna vrednost
   */
  static calculateCurrentValue(fixedAsset) {
    const purchaseValue = fixedAsset.purchaseValue || 0;
    const accumulatedDepreciation = fixedAsset.accumulatedDepreciation || 0;
    
    return purchaseValue - accumulatedDepreciation;
  }
}

/**
 * Razred za validacijo in izračune zalog
 */
class InventoryCalculator {
  /**
   * Izračuna vrednost zaloge po metodi FIFO (First In, First Out)
   * @param {Array} inventoryItems - Seznam postavk zaloge z datumom, količino in ceno
   * @returns {number} - Vrednost zaloge
   */
  static calculateFIFOValue(inventoryItems) {
    if (!inventoryItems || inventoryItems.length === 0) {
      return 0;
    }
    
    // Razvrsti postavke po datumu (od najstarejše do najnovejše)
    const sortedItems = [...inventoryItems].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    // Izračunaj vrednost zaloge
    return sortedItems.reduce((total, item) => 
      total + (item.quantity || 0) * (item.price || 0), 0
    );
  }
  
  /**
   * Izračuna vrednost zaloge po metodi tehtane povprečne cene
   * @param {Array} inventoryItems - Seznam postavk zaloge z datumom, količino in ceno
   * @returns {number} - Vrednost zaloge
   */
  static calculateWeightedAverageValue(inventoryItems) {
    if (!inventoryItems || inventoryItems.length === 0) {
      return 0;
    }
    
    // Izračunaj skupno količino in vrednost
    const totalQuantity = inventoryItems.reduce((sum, item) => 
      sum + (item.quantity || 0), 0
    );
    
    const totalValue = inventoryItems.reduce((sum, item) => 
      sum + (item.quantity || 0) * (item.price || 0), 0
    );
    
    // Izračunaj tehtano povprečno ceno
    const weightedAveragePrice = totalQuantity > 0 ? totalValue / totalQuantity : 0;
    
    return totalQuantity * weightedAveragePrice;
  }
}

/**
 * Razred za validacijo in izračune DDV
 */
class VATCalculator {
  /**
   * Izračuna znesek DDV
   * @param {number} amount - Znesek brez DDV
   * @param {number} vatRate - Stopnja DDV (v odstotkih)
   * @returns {number} - Znesek DDV
   */
  static calculateVAT(amount, vatRate) {
    return amount * (vatRate / 100);
  }
  
  /**
   * Izračuna znesek z DDV
   * @param {number} amount - Znesek brez DDV
   * @param {number} vatRate - Stopnja DDV (v odstotkih)
   * @returns {number} - Znesek z DDV
   */
  static calculateAmountWithVAT(amount, vatRate) {
    return amount + this.calculateVAT(amount, vatRate);
  }
  
  /**
   * Izračuna znesek brez DDV
   * @param {number} amountWithVAT - Znesek z DDV
   * @param {number} vatRate - Stopnja DDV (v odstotkih)
   * @returns {number} - Znesek brez DDV
   */
  static calculateAmountWithoutVAT(amountWithVAT, vatRate) {
    return amountWithVAT / (1 + vatRate / 100);
  }
}

/**
 * Razred za validacijo in izračune poslovnih dogodkov
 */
class BusinessEventValidator {
  /**
   * Preveri pravilnost knjiženja poslovnega dogodka
   * @param {Object} businessEvent - Objekt s podatki o poslovnem dogodku
   * @returns {Object} - Rezultat validacije
   */
  static validateBooking(businessEvent) {
    // Preveri, ali je podan konto
    if (!businessEvent.account) {
      return {
        isValid: false,
        message: 'Manjka konto za knjiženje'
      };
    }
    
    // Preveri, ali je podan znesek
    if (businessEvent.amount === undefined || businessEvent.amount === null) {
      return {
        isValid: false,
        message: 'Manjka znesek za knjiženje'
      };
    }
    
    // Preveri, ali je podan datum
    if (!businessEvent.date) {
      return {
        isValid: false,
        message: 'Manjka datum poslovnega dogodka'
      };
    }
    
    // Preveri, ali je podan opis
    if (!businessEvent.description) {
      return {
        isValid: false,
        message: 'Manjka opis poslovnega dogodka'
      };
    }
    
    return {
      isValid: true,
      message: 'Poslovni dogodek je pravilno knjižen'
    };
  }
}

/**
 * Razred za validacijo in izračune celotnega letnega poročila
 */
class AnnualReportValidator {
  /**
   * Preveri skladnost med različnimi izkazi v letnem poročilu
   * @param {Object} annualReport - Objekt s podatki letnega poročila
   * @returns {Object} - Rezultat validacije
   */
  static validateConsistency(annualReport) {
    const balanceSheet = annualReport.balanceSheet || {};
    const incomeStatement = annualReport.incomeStatement || {};
    const cashFlowStatement = annualReport.cashFlowStatement || {};
    const equityStatement = annualReport.equityStatement || {};
    
    const validationResults = [];
    
    // Preveri skladnost čistega poslovnega izida v izkazu poslovnega izida in bilanci stanja
    const netProfitInIncomeStatement = incomeStatement.netProfit || 0;
    const netProfitInBalanceSheet = balanceSheet.netProfitForPeriod || 0;
    
    if (Math.abs(netProfitInIncomeStatement - netProfitInBalanceSheet) >= 0.01) {
      validationResults.push({
        isValid: false,
        message: 'Čisti poslovni izid v izkazu poslovnega izida ni enak čistemu poslovnemu izidu v bilanci stanja',
        difference: netProfitInIncomeStatement - netProfitInBalanceSheet
      });
    }
    
    // Preveri skladnost končnega stanja denarnih sredstev v izkazu denarnih tokov in bilanci stanja
    const cashInCashFlowStatement = cashFlowStatement.finalCashBalance || 0;
    const cashInBalanceSheet = balanceSheet.cashAndCashEquivalents || 0;
    
    if (Math.abs(cashInCashFlowStatement - cashInBalanceSheet) >= 0.01) {
      validationResults.push({
        isValid: false,
        message: 'Končno stanje denarnih sredstev v izkazu denarnih tokov ni enako stanju denarnih sredstev v bilanci stanja',
        difference: cashInCashFlowStatement - cashInBalanceSheet
      });
    }
    
    // Preveri skladnost končnega stanja kapitala v izkazu gibanja kapitala in bilanci stanja
    const equityInEquityStatement = equityStatement.finalEquity || 0;
    const equityInBalanceSheet = (
      (balanceSheet.calledUpCapital || 0) +
      (balanceSheet.capitalReserves || 0) +
      (balanceSheet.reservesFromProfit || 0) +
      (balanceSheet.revaluationReserves || 0) +
      (balanceSheet.fairValueReserves || 0) +
      (balanceSheet.retainedEarnings || 0) +
      (balanceSheet.netProfitForPeriod || 0)
    );
    
    if (Math.abs(equityInEquityStatement - equityInBalanceSheet) >= 0.01) {
      validationResults.push({
        isValid: false,
        message: 'Končno stanje kapitala v izkazu gibanja kapitala ni enako stanju kapitala v bilanci stanja',
        difference: equityInEquityStatement - equityInBalanceSheet
      });
    }
    
    // Če ni napak, je poročilo skladno
    if (validationResults.length === 0) {
      return {
        isValid: true,
        message: 'Letno poročilo je skladno med različnimi izkazi'
      };
    }
    
    return {
      isValid: false,
      message: 'Letno poročilo ni skladno med različnimi izkazi',
      details: validationResults
    };
  }
  
  /**
   * Preveri, ali so vsi potrebni izkazi prisotni v letnem poročilu
   * @param {Object} annualReport - Objekt s podatki letnega poročila
   * @returns {Object} - Rezultat validacije
   */
  static validateCompleteness(annualReport) {
    const requiredStatements = [
      'balanceSheet',
      'incomeStatement'
    ];
    
    // Za mikro podjetja nista obvezna izkaz denarnih tokov in izkaz gibanja kapitala
    if (annualReport.companySize !== 'micro') {
      requiredStatements.push('cashFlowStatement', 'equityStatement');
    }
    
    const missingStatements = requiredStatements.filter(statement => 
      !annualReport[statement] || Object.keys(annualReport[statement]).length === 0
    );
    
    return {
      isValid: missingStatements.length === 0,
      missingStatements,
      message: missingStatements.length === 0 ? 
        'Letno poročilo vsebuje vse potrebne izkaze' : 
        `Manjkajo naslednji izkazi: ${missingStatements.join(', ')}`
    };
  }
}

// Izvoz razredov za uporabo v drugih modulih
module.exports = {
  BalanceSheetValidator,
  IncomeStatementValidator,
  CashFlowStatementValidator,
  EquityStatementValidator,
  FixedAssetsCalculator,
  InventoryCalculator,
  VATCalculator,
  BusinessEventValidator,
  AnnualReportValidator
};
