"use client"

import { useState } from "react"
import { Check, Globe, Plus, RefreshCw, Trash } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import type { Currency, TaxRate } from "@/types/invoice"

export function MultiCurrencyTax() {
  const [activeTab, setActiveTab] = useState("currencies")
  const [addCurrencyOpen, setAddCurrencyOpen] = useState(false)
  const [addTaxRateOpen, setAddTaxRateOpen] = useState(false)

  const [newCurrency, setNewCurrency] = useState<Partial<Currency>>({
    code: "",
    name: "",
    symbol: "",
    rate: 1,
  })

  const [newTaxRate, setNewTaxRate] = useState<Partial<TaxRate>>({
    name: "",
    rate: 0,
    country: "",
    region: "",
    default: false,
  })

  // Sample data for currencies
  const [currencies, setCurrencies] = useState<Currency[]>([
    { code: "USD", name: "US Dollar", symbol: "$", rate: 1 },
    { code: "EUR", name: "Euro", symbol: "€", rate: 0.92 },
    { code: "GBP", name: "British Pound", symbol: "£", rate: 0.79 },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 149.82 },
    { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.52 },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.36 },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF", rate: 0.91 },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥", rate: 7.24 },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", rate: 7.82 },
    { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", rate: 1.64 },
    { code: "SEK", name: "Swedish Krona", symbol: "kr", rate: 10.48 },
    { code: "KRW", name: "South Korean Won", symbol: "₩", rate: 1345.42 },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$", rate: 1.35 },
    { code: "NOK", name: "Norwegian Krone", symbol: "kr", rate: 10.71 },
    { code: "MXN", name: "Mexican Peso", symbol: "$", rate: 16.82 },
    { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 83.47 },
    { code: "RUB", name: "Russian Ruble", symbol: "₽", rate: 92.34 },
    { code: "ZAR", name: "South African Rand", symbol: "R", rate: 18.65 },
    { code: "TRY", name: "Turkish Lira", symbol: "₺", rate: 32.15 },
    { code: "BRL", name: "Brazilian Real", symbol: "R$", rate: 5.07 },
    { code: "TWD", name: "Taiwan Dollar", symbol: "NT$", rate: 32.27 },
    { code: "DKK", name: "Danish Krone", symbol: "kr", rate: 6.87 },
    { code: "PLN", name: "Polish Złoty", symbol: "zł", rate: 3.94 },
    { code: "THB", name: "Thai Baht", symbol: "฿", rate: 35.98 },
    { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", rate: 15747.05 },
    { code: "HUF", name: "Hungarian Forint", symbol: "Ft", rate: 356.5 },
    { code: "CZK", name: "Czech Koruna", symbol: "Kč", rate: 23.02 },
    { code: "ILS", name: "Israeli New Shekel", symbol: "₪", rate: 3.69 },
    { code: "CLP", name: "Chilean Peso", symbol: "$", rate: 926.84 },
    { code: "PHP", name: "Philippine Peso", symbol: "₱", rate: 56.83 },
    { code: "AED", name: "United Arab Emirates Dirham", symbol: "د.إ", rate: 3.67 },
    { code: "COP", name: "Colombian Peso", symbol: "$", rate: 3936.45 },
    { code: "SAR", name: "Saudi Riyal", symbol: "﷼", rate: 3.75 },
    { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", rate: 4.73 },
    { code: "RON", name: "Romanian Leu", symbol: "lei", rate: 4.57 },
    { code: "ARS", name: "Argentine Peso", symbol: "$", rate: 871.26 },
    { code: "BGN", name: "Bulgarian Lev", symbol: "лв", rate: 1.81 },
    { code: "HRK", name: "Croatian Kuna", symbol: "kn", rate: 7.02 },
    { code: "PEN", name: "Peruvian Sol", symbol: "S/", rate: 3.7 },
    { code: "MAD", name: "Moroccan Dirham", symbol: "د.م.", rate: 9.95 },
    { code: "PKR", name: "Pakistani Rupee", symbol: "₨", rate: 278.32 },
    { code: "EGP", name: "Egyptian Pound", symbol: "£", rate: 47.85 },
    { code: "VND", name: "Vietnamese Dong", symbol: "₫", rate: 25235.0 },
    { code: "NGN", name: "Nigerian Naira", symbol: "₦", rate: 1413.5 },
    { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", rate: 109.82 },
    { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴", rate: 39.65 },
    { code: "KES", name: "Kenyan Shilling", symbol: "KSh", rate: 129.75 },
    { code: "IQD", name: "Iraqi Dinar", symbol: "ع.د", rate: 1309.5 },
    { code: "DZD", name: "Algerian Dinar", symbol: "د.ج", rate: 134.82 },
    { code: "QAR", name: "Qatari Riyal", symbol: "﷼", rate: 3.64 },
    { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", rate: 0.31 },
    { code: "JOD", name: "Jordanian Dinar", symbol: "د.ا", rate: 0.71 },
    { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب", rate: 0.38 },
    { code: "OMR", name: "Omani Rial", symbol: "﷼", rate: 0.38 },
    { code: "UYU", name: "Uruguayan Peso", symbol: "$U", rate: 38.75 },
    { code: "CRC", name: "Costa Rican Colón", symbol: "₡", rate: 514.25 },
    { code: "BOB", name: "Bolivian Boliviano", symbol: "Bs.", rate: 6.91 },
    { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", rate: 15.35 },
    { code: "ISK", name: "Icelandic Króna", symbol: "kr", rate: 137.5 },
    { code: "LKR", name: "Sri Lankan Rupee", symbol: "₨", rate: 309.75 },
    { code: "ETB", name: "Ethiopian Birr", symbol: "Br", rate: 56.85 },
    { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", rate: 2595.0 },
    { code: "UGX", name: "Ugandan Shilling", symbol: "USh", rate: 3785.0 },
    { code: "RSD", name: "Serbian Dinar", symbol: "дин.", rate: 108.25 },
    { code: "ALL", name: "Albanian Lek", symbol: "Lek", rate: 95.75 },
    { code: "MKD", name: "Macedonian Denar", symbol: "ден", rate: 57.25 },
    { code: "MDL", name: "Moldovan Leu", symbol: "L", rate: 17.85 },
    { code: "AMD", name: "Armenian Dram", symbol: "֏", rate: 387.5 },
    { code: "GEL", name: "Georgian Lari", symbol: "₾", rate: 2.65 },
    { code: "TND", name: "Tunisian Dinar", symbol: "د.ت", rate: 3.12 },
    { code: "KZT", name: "Kazakhstani Tenge", symbol: "₸", rate: 447.5 },
    { code: "AZN", name: "Azerbaijani Manat", symbol: "₼", rate: 1.7 },
    { code: "TMT", name: "Turkmenistan Manat", symbol: "m", rate: 3.5 },
    { code: "UZS", name: "Uzbekistani Som", symbol: "лв", rate: 12850.0 },
    { code: "KGS", name: "Kyrgyzstani Som", symbol: "с", rate: 89.75 },
    { code: "TJS", name: "Tajikistani Somoni", symbol: "ЅМ", rate: 10.95 },
    { code: "MNT", name: "Mongolian Tögrög", symbol: "₮", rate: 3425.0 },
    { code: "NPR", name: "Nepalese Rupee", symbol: "₨", rate: 133.5 },
    { code: "FJD", name: "Fijian Dollar", symbol: "FJ$", rate: 2.25 },
    { code: "PGK", name: "Papua New Guinean Kina", symbol: "K", rate: 3.75 },
    { code: "WST", name: "Samoan Tālā", symbol: "WS$", rate: 2.75 },
    { code: "TOP", name: "Tongan Paʻanga", symbol: "T$", rate: 2.38 },
    { code: "SBD", name: "Solomon Islands Dollar", symbol: "SI$", rate: 8.45 },
    { code: "VUV", name: "Vanuatu Vatu", symbol: "VT", rate: 119.5 },
    { code: "MUR", name: "Mauritian Rupee", symbol: "₨", rate: 45.85 },
    { code: "SCR", name: "Seychellois Rupee", symbol: "₨", rate: 13.25 },
    { code: "MVR", name: "Maldivian Rufiyaa", symbol: "Rf", rate: 15.45 },
    { code: "BTN", name: "Bhutanese Ngultrum", symbol: "Nu.", rate: 83.5 },
    { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA", rate: 604.5 },
    { code: "XOF", name: "West African CFA Franc", symbol: "CFA", rate: 604.5 },
    { code: "XPF", name: "CFP Franc", symbol: "₣", rate: 109.85 },
    { code: "DJF", name: "Djiboutian Franc", symbol: "Fdj", rate: 178.25 },
    { code: "ERN", name: "Eritrean Nakfa", symbol: "Nfk", rate: 15.0 },
    { code: "GNF", name: "Guinean Franc", symbol: "FG", rate: 8650.0 },
    { code: "KMF", name: "Comorian Franc", symbol: "CF", rate: 452.5 },
    { code: "MGA", name: "Malagasy Ariary", symbol: "Ar", rate: 4375.0 },
    { code: "MWK", name: "Malawian Kwacha", symbol: "MK", rate: 1685.0 },
    { code: "RWF", name: "Rwandan Franc", symbol: "FRw", rate: 1275.0 },
    { code: "SLL", name: "Sierra Leonean Leone", symbol: "Le", rate: 19750.0 },
    { code: "STD", name: "São Tomé and Príncipe Dobra", symbol: "Db", rate: 20650.0 },
    { code: "SZL", name: "Swazi Lilangeni", symbol: "L", rate: 18.65 },
    { code: "ZMW", name: "Zambian Kwacha", symbol: "ZK", rate: 26.85 },
    { code: "AOA", name: "Angolan Kwanza", symbol: "Kz", rate: 835.5 },
    { code: "BWP", name: "Botswanan Pula", symbol: "P", rate: 13.65 },
    { code: "LSL", name: "Lesotho Loti", symbol: "L", rate: 18.65 },
    { code: "NAD", name: "Namibian Dollar", symbol: "N$", rate: 18.65 },
    { code: "SYP", name: "Syrian Pound", symbol: "£", rate: 13000.0 },
    { code: "LYD", name: "Libyan Dinar", symbol: "ل.د", rate: 4.85 },
    { code: "SDG", name: "Sudanese Pound", symbol: "ج.س.", rate: 601.5 },
    { code: "YER", name: "Yemeni Rial", symbol: "﷼", rate: 250.5 },
    { code: "BYN", name: "Belarusian Ruble", symbol: "Br", rate: 3.25 },
    { code: "AFN", name: "Afghan Afghani", symbol: "؋", rate: 73.5 },
    { code: "AWG", name: "Aruban Florin", symbol: "ƒ", rate: 1.8 },
    { code: "PAB", name: "Panamanian Balboa", symbol: "B/.", rate: 1.0 },
    { code: "BBD", name: "Barbadian Dollar", symbol: "Bds$", rate: 2.0 },
    { code: "BZD", name: "Belize Dollar", symbol: "BZ$", rate: 2.0 },
    { code: "BMD", name: "Bermudian Dollar", symbol: "BD$", rate: 1.0 },
    { code: "BSD", name: "Bahamian Dollar", symbol: "B$", rate: 1.0 },
    { code: "KYD", name: "Cayman Islands Dollar", symbol: "CI$", rate: 0.83 },
    { code: "DOP", name: "Dominican Peso", symbol: "RD$", rate: 58.5 },
    { code: "GTQ", name: "Guatemalan Quetzal", symbol: "Q", rate: 7.75 },
    { code: "HNL", name: "Honduran Lempira", symbol: "L", rate: 24.75 },
    { code: "JMD", name: "Jamaican Dollar", symbol: "J$", rate: 155.5 },
    { code: "NIO", name: "Nicaraguan Córdoba", symbol: "C$", rate: 36.75 },
    { code: "PYG", name: "Paraguayan Guaraní", symbol: "₲", rate: 7350.0 },
    { code: "SRD", name: "Surinamese Dollar", symbol: "$", rate: 29.5 },
    { code: "TTD", name: "Trinidad and Tobago Dollar", symbol: "TT$", rate: 6.8 },
    { code: "VES", name: "Venezuelan Bolívar Soberano", symbol: "Bs.S", rate: 36.5 },
  ])

  // Sample data for tax rates
  const [taxRates, setTaxRates] = useState<TaxRate[]>([
    { id: "tax-001", name: "US Sales Tax", rate: 8.5, country: "United States", region: "California", default: true },
    { id: "tax-002", name: "UK VAT", rate: 20, country: "United Kingdom", default: false },
    { id: "tax-003", name: "EU VAT", rate: 21, country: "European Union", default: false },
    { id: "tax-004", name: "Canada GST", rate: 5, country: "Canada", default: false },
    { id: "tax-005", name: "Australia GST", rate: 10, country: "Australia", default: false },
  ])

  const [baseCurrency, setBaseCurrency] = useState("USD")
  const [autoUpdateRates, setAutoUpdateRates] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString())

  const handleAddCurrency = () => {
    if (!newCurrency.code || !newCurrency.name || !newCurrency.symbol) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const currency: Currency = {
      code: newCurrency.code,
      name: newCurrency.name,
      symbol: newCurrency.symbol,
      rate: newCurrency.rate || 1,
    }

    setCurrencies([...currencies, currency])
    setAddCurrencyOpen(false)
    setNewCurrency({ code: "", name: "", symbol: "", rate: 1 })

    toast({
      title: "Currency added",
      description: `${currency.name} has been added successfully.`,
    })
  }

  const handleDeleteCurrency = (code: string) => {
    if (code === baseCurrency) {
      toast({
        title: "Cannot delete base currency",
        description: "Please select a different base currency first.",
        variant: "destructive",
      })
      return
    }

    setCurrencies(currencies.filter((c) => c.code !== code))
    toast({
      title: "Currency deleted",
      description: "The currency has been deleted successfully.",
    })
  }

  const handleAddTaxRate = () => {
    if (!newTaxRate.name || !newTaxRate.country || newTaxRate.rate === undefined) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const taxRate: TaxRate = {
      id: `tax-${(taxRates.length + 1).toString().padStart(3, "0")}`,
      name: newTaxRate.name,
      rate: newTaxRate.rate,
      country: newTaxRate.country,
      region: newTaxRate.region,
      default: newTaxRate.default || false,
    }

    // If this is set as default, update other tax rates
    const updatedTaxRates = newTaxRate.default ? taxRates.map((tax) => ({ ...tax, default: false })) : [...taxRates]

    setTaxRates([...updatedTaxRates, taxRate])
    setAddTaxRateOpen(false)
    setNewTaxRate({ name: "", rate: 0, country: "", region: "", default: false })

    toast({
      title: "Tax rate added",
      description: `${taxRate.name} has been added successfully.`,
    })
  }

  const handleDeleteTaxRate = (id: string) => {
    const taxRate = taxRates.find((t) => t.id === id)
    if (taxRate?.default) {
      toast({
        title: "Cannot delete default tax rate",
        description: "Please set another tax rate as default first.",
        variant: "destructive",
      })
      return
    }

    setTaxRates(taxRates.filter((t) => t.id !== id))
    toast({
      title: "Tax rate deleted",
      description: "The tax rate has been deleted successfully.",
    })
  }

  const handleSetDefaultTaxRate = (id: string) => {
    setTaxRates(
      taxRates.map((tax) => ({
        ...tax,
        default: tax.id === id,
      })),
    )

    toast({
      title: "Default tax rate updated",
      description: "The default tax rate has been updated successfully.",
    })
  }

  const handleSetBaseCurrency = (code: string) => {
    // Recalculate all rates relative to the new base currency
    const oldBase = currencies.find((c) => c.code === baseCurrency)
    const newBase = currencies.find((c) => c.code === code)

    if (!oldBase || !newBase) return

    const updatedCurrencies = currencies.map((currency) => {
      if (currency.code === code) {
        return { ...currency, rate: 1 }
      } else {
        // Convert rate relative to new base
        const absoluteRate = currency.rate / oldBase.rate
        const newRate = absoluteRate / (newBase.rate / oldBase.rate)
        return { ...currency, rate: Number.parseFloat(newRate.toFixed(6)) }
      }
    })

    setCurrencies(updatedCurrencies)
    setBaseCurrency(code)

    toast({
      title: "Base currency updated",
      description: `Base currency has been changed to ${code}.`,
    })
  }

  const handleUpdateExchangeRates = () => {
    // In a real app, this would fetch current exchange rates from an API
    // For demo purposes, we'll just simulate an update with random fluctuations

    const updatedCurrencies = currencies.map((currency) => {
      if (currency.code === baseCurrency) return currency

      // Add a small random fluctuation (-2% to +2%)
      const fluctuation = 1 + (Math.random() * 0.04 - 0.02)
      const newRate = Number.parseFloat((currency.rate * fluctuation).toFixed(6))

      return { ...currency, rate: newRate }
    })

    setCurrencies(updatedCurrencies)
    setLastUpdated(new Date().toISOString())

    toast({
      title: "Exchange rates updated",
      description: "The latest exchange rates have been fetched and applied.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Multi-Currency & Tax</h2>
          <p className="text-muted-foreground">Manage currencies and tax rates for your invoices and quotations.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleUpdateExchangeRates}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Update Rates
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="currencies">
            <Globe className="mr-2 h-4 w-4" />
            Currencies
          </TabsTrigger>
          <TabsTrigger value="taxes">
            <Check className="mr-2 h-4 w-4" />
            Tax Rates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="currencies" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Currency Settings</CardTitle>
                  <CardDescription>Configure your base currency and exchange rate settings.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="base-currency">Base Currency</Label>
                  <Select value={baseCurrency} onValueChange={handleSetBaseCurrency}>
                    <SelectTrigger id="base-currency">
                      <SelectValue placeholder="Select base currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">All exchange rates are relative to this currency.</p>
                </div>
                <div className="space-y-2">
                  <Label>Auto-Update Exchange Rates</Label>
                  <div className="flex items-center justify-between rounded-md border p-4">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Daily Exchange Rate Updates</p>
                      <p className="text-xs text-muted-foreground">Automatically update exchange rates daily</p>
                    </div>
                    <Switch checked={autoUpdateRates} onCheckedChange={setAutoUpdateRates} />
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Last updated: {format(new Date(lastUpdated), "PPP 'at' p")}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Available Currencies</h3>
            <Button onClick={() => setAddCurrencyOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Currency
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currencies.map((currency) => (
              <Card key={currency.code} className={currency.code === baseCurrency ? "border-primary" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{currency.code}</CardTitle>
                    {currency.code !== baseCurrency && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Currency</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete {currency.name}? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="mt-4">
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.preventDefault()
                                const closeButton = document.querySelector(
                                  '[data-state="open"] button[aria-label="Close"]',
                                )
                                if (closeButton instanceof HTMLElement) {
                                  closeButton.click()
                                }
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={(e) => {
                                e.preventDefault()
                                handleDeleteCurrency(currency.code)
                                const closeButton = document.querySelector(
                                  '[data-state="open"] button[aria-label="Close"]',
                                )
                                if (closeButton instanceof HTMLElement) {
                                  closeButton.click()
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <CardDescription>{currency.name}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Symbol</span>
                      <span className="font-medium">{currency.symbol}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Exchange Rate</span>
                      <span className="font-medium">
                        {currency.code === baseCurrency ? "1.00 (Base)" : currency.rate.toFixed(6)}
                      </span>
                    </div>
                    {currency.code !== baseCurrency && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Conversion</span>
                        <span className="font-medium">
                          1 {baseCurrency} = {currency.rate.toFixed(4)} {currency.code}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {currency.code === baseCurrency ? (
                    <span className="text-xs font-medium text-primary">Base Currency</span>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleSetBaseCurrency(currency.code)}>
                      Set as Base
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="taxes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tax Settings</CardTitle>
                  <CardDescription>Configure tax rates for different regions.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-medium">Default Tax Rate</h3>
                    <p className="text-xs text-muted-foreground">
                      The default tax rate will be applied to new invoices and quotations.
                    </p>
                  </div>
                  <div className="font-medium">
                    {taxRates.find((tax) => tax.default)?.name || "None"}
                    {taxRates.find((tax) => tax.default) && (
                      <span className="ml-1 text-muted-foreground">({taxRates.find((tax) => tax.default)?.rate}%)</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Tax Rates</h3>
            <Button onClick={() => setAddTaxRateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Tax Rate
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {taxRates.map((tax) => (
              <Card key={tax.id} className={tax.default ? "border-primary" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{tax.name}</CardTitle>
                    {!tax.default && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Tax Rate</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete {tax.name}? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="mt-4">
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.preventDefault()
                                const closeButton = document.querySelector(
                                  '[data-state="open"] button[aria-label="Close"]',
                                )
                                if (closeButton instanceof HTMLElement) {
                                  closeButton.click()
                                }
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={(e) => {
                                e.preventDefault()
                                handleDeleteTaxRate(tax.id)
                                const closeButton = document.querySelector(
                                  '[data-state="open"] button[aria-label="Close"]',
                                )
                                if (closeButton instanceof HTMLElement) {
                                  closeButton.click()
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <CardDescription>
                    {tax.country}
                    {tax.region ? `, ${tax.region}` : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Rate</span>
                      <span className="font-medium">{tax.rate}%</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {tax.default ? (
                    <span className="text-xs font-medium text-primary">Default Tax Rate</span>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleSetDefaultTaxRate(tax.id)}>
                      Set as Default
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Currency Dialog */}
      <Dialog open={addCurrencyOpen} onOpenChange={setAddCurrencyOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Currency</DialogTitle>
            <DialogDescription>Add a new currency to use in your invoices and quotations.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency-code">Currency Code</Label>
                <Input
                  id="currency-code"
                  placeholder="USD"
                  maxLength={3}
                  value={newCurrency.code}
                  onChange={(e) => setNewCurrency({ ...newCurrency, code: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency-symbol">Symbol</Label>
                <Input
                  id="currency-symbol"
                  placeholder="$"
                  value={newCurrency.symbol}
                  onChange={(e) => setNewCurrency({ ...newCurrency, symbol: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency-name">Currency Name</Label>
              <Input
                id="currency-name"
                placeholder="US Dollar"
                value={newCurrency.name}
                onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exchange-rate">Exchange Rate (to {baseCurrency})</Label>
              <Input
                id="exchange-rate"
                type="number"
                step="0.000001"
                min="0.000001"
                placeholder="1.0"
                value={newCurrency.rate}
                onChange={(e) => setNewCurrency({ ...newCurrency, rate: Number.parseFloat(e.target.value) || 1 })}
              />
              <p className="text-xs text-muted-foreground">
                1 {baseCurrency} = ? {newCurrency.code || "XXX"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCurrencyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCurrency}>Add Currency</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tax Rate Dialog */}
      <Dialog open={addTaxRateOpen} onOpenChange={setAddTaxRateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Tax Rate</DialogTitle>
            <DialogDescription>Add a new tax rate for a specific region.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tax-name">Tax Name</Label>
              <Input
                id="tax-name"
                placeholder="US Sales Tax"
                value={newTaxRate.name}
                onChange={(e) => setNewTaxRate({ ...newTaxRate, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-rate">Rate (%)</Label>
              <Input
                id="tax-rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="8.5"
                value={newTaxRate.rate}
                onChange={(e) => setNewTaxRate({ ...newTaxRate, rate: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tax-country">Country</Label>
                <Input
                  id="tax-country"
                  placeholder="United States"
                  value={newTaxRate.country}
                  onChange={(e) => setNewTaxRate({ ...newTaxRate, country: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-region">Region (Optional)</Label>
                <Input
                  id="tax-region"
                  placeholder="California"
                  value={newTaxRate.region}
                  onChange={(e) => setNewTaxRate({ ...newTaxRate, region: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="default-tax"
                checked={newTaxRate.default}
                onCheckedChange={(checked) => setNewTaxRate({ ...newTaxRate, default: checked })}
              />
              <Label htmlFor="default-tax">Set as default tax rate</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTaxRateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTaxRate}>Add Tax Rate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
