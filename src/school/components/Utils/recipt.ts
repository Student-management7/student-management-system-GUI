// Utility function to convert number to words (Indian Rupee format)
export function convertToWords(amount: number): string {
  if (amount === 0) return "Zero Rupees Only"

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ]
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

  const numToWord = (num: number): string => {
    if (num < 20) return ones[num]
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "")
    if (num < 1000)
      return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " " + numToWord(num % 100) : "")
    if (num < 100000)
      return numToWord(Math.floor(num / 1000)) + " Thousand" + (num % 1000 !== 0 ? " " + numToWord(num % 1000) : "")
    if (num < 10000000)
      return numToWord(Math.floor(num / 100000)) + " Lakh" + (num % 100000 !== 0 ? " " + numToWord(num % 100000) : "")
    return (
      numToWord(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 !== 0 ? " " + numToWord(num % 10000000) : "")
    )
  }

  return numToWord(amount) + " Rupees Only"
}
