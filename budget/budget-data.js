// City of Del Rey Oaks — Budget Allocation Slider: Data
// Source: City Manager monthly financial packets (Dec 2025, Mar 2026, Apr 2026).
//
// Two selectable profiles, same category keys so the widget can swap
// datasets without changing any UI code:
//   "typical"    — rounded figures preserving real category proportions.
//                  Default starting point; reads as "how DRO typically
//                  budgets" rather than one specific fiscal year.
//   "actual2026" — the real FY2026 amended budget (matches Mar & Apr
//                  packets). "See the actual current budget" toggle.

const DRO_BUDGET_PROFILES = {

  typical: {
    label: "Typical Year",
    revenue: {
      propertyTaxes:          { label: "Property Taxes",          amount: 870000 },
      salesTax:                { label: "Sales Tax",               amount: 1190000 },
      otherTaxes:              { label: "Other Taxes",             amount: 570000 },
      licensesAndPermits:      { label: "Licenses and Permits",    amount: 350000 },
      finesAndForfeitures:     { label: "Fines and Forfeitures",   amount: 25000 },
      otherRevenue:            { label: "Other Revenue",           amount: 200000 },
      grants:                  { label: "Grants",                  amount: 245000 },
      airportPoliceServices:   { label: "Airport Police Services", amount: 1490000 },
      currentServices:         { label: "Current Services",        amount: 150000 },
    },
    expenditures: {
      council:                 { label: "Council",                        amount: 30000 },
      cityClerk:               { label: "City Clerk",                     amount: 655000 },
      cityManager:             { label: "City Manager",                   amount: 345000 },
      finance:                 { label: "Finance",                        amount: 290000 },
      legal:                   { label: "Legal",                          amount: 90000 },
      planningAndBuilding:     { label: "Planning & Building Regulation", amount: 255000 },
      governmentBuildings:     { label: "Government Buildings",           amount: 20000 },
      nonDepartmental:         { label: "Non-Departmental",               amount: 55000 },
      police:                  { label: "Police",                         amount: 3075000 },
      fireAnimalControl:       { label: "Fire/Animal Control",            amount: 245000 },
      publicWorksStreets:      { label: "Public Works/Streets",           amount: 260000 },
      parksRecreation:         { label: "Parks/Recreation",                amount: 110000 },
    },
  },

  actual2026: {
    label: "FY2026 Amended Budget",
    revenue: {
      propertyTaxes:          { label: "Property Taxes",          amount: 870000 },
      salesTax:                { label: "Sales Tax",               amount: 1189000 },
      otherTaxes:              { label: "Other Taxes",             amount: 571900 },
      licensesAndPermits:      { label: "Licenses and Permits",    amount: 352450 },
      finesAndForfeitures:     { label: "Fines and Forfeitures",   amount: 25100 },
      otherRevenue:            { label: "Other Revenue",           amount: 200700 },
      grants:                  { label: "Grants",                  amount: 246100 },
      airportPoliceServices:   { label: "Airport Police Services", amount: 1489000 },
      currentServices:         { label: "Current Services",        amount: 148800 },
    },
    expenditures: {
      council:                 { label: "Council",                        amount: 30400 },
      cityClerk:               { label: "City Clerk",                     amount: 654800 },
      cityManager:             { label: "City Manager",                   amount: 345115 },
      finance:                 { label: "Finance",                        amount: 290000 },
      legal:                   { label: "Legal",                          amount: 89300 },
      planningAndBuilding:     { label: "Planning & Building Regulation", amount: 255400 },
      governmentBuildings:     { label: "Government Buildings",           amount: 20200 },
      nonDepartmental:         { label: "Non-Departmental",               amount: 56800 },
      police:                  { label: "Police",                         amount: 3074800 },
      fireAnimalControl:       { label: "Fire/Animal Control",            amount: 243300 },
      publicWorksStreets:      { label: "Public Works/Streets",           amount: 258050 },
      parksRecreation:         { label: "Parks/Recreation",                amount: 111850 },
    },
    // Original-adopted figures (pre mid-year amendment), from the Dec 2025 packet.
    // Kept for an optional "adopted vs. amended" note; not a separate profile.
    adopted: {
      totalRevenue: 5091200,
      totalExpenditures: 5178300,
      revenue: {
        propertyTaxes: 867500,
        otherTaxes: 551400,
        currentServices: 193300,
        // all other categories unchanged from amended figures above
      },
      expenditures: {
        cityClerk: 648200,
        cityManager: 338400,
        finance: 236000,
        planningAndBuilding: 150400,
        police: 2998900,
        publicWorksStreets: 256800,
        parksRecreation: 109600,
        // council, legal, governmentBuildings, nonDepartmental, fireAnimalControl unchanged
      },
    },
  },
};

// Context notes for the widget's UI/copy — apply to either profile
const DRO_BUDGET_NOTES = {
  airportOffset:
    "A large share of the Police budget is reimbursed by Monterey Regional Airport under a " +
    "police-services contract (shown separately as Airport Police Services revenue). Net " +
    "taxpayer cost for police is meaningfully lower than the gross department figure.",
  propertyTaxTiming:
    "California secured property tax installments land in December and April. Revenue collected " +
    "in any month between those two dates will look artificially low — this is normal cash-flow " +
    "timing, not a budget shortfall.",
};

// Compute totals for each profile (kept in sync automatically if amounts change)
function withTotals(profile) {
  const totalRevenue = Object.values(profile.revenue).reduce((sum, c) => sum + c.amount, 0);
  const totalExpenditures = Object.values(profile.expenditures).reduce((sum, c) => sum + c.amount, 0);
  return {
    ...profile,
    totalRevenue,
    totalExpenditures,
    surplusDeficit: totalRevenue - totalExpenditures,
  };
}

const DRO_BUDGET = {
  profiles: {
    typical: withTotals(DRO_BUDGET_PROFILES.typical),
    actual2026: withTotals(DRO_BUDGET_PROFILES.actual2026),
  },
  defaultProfile: "typical",
  notes: DRO_BUDGET_NOTES,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = DRO_BUDGET;
}
