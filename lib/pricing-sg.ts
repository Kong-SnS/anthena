// SGD pricing for Bloomie — amounts in cents
// Buy X Free X promo (free extra sachets)

export type SGQuantity = 1 | 2 | 3

export function calculatePriceSGD(quantity: SGQuantity) {
  switch (quantity) {
    case 3:
      return {
        total: 35800,
        display: "358.00",
        totalBoxes: 6,
        freeBoxes: 3,
        freeSachets: 15,
        label: "3 Free 3 (Free extra 15 sachets)",
        shortLabel: "Buy 3 Free 3",
      }
    case 2:
      return {
        total: 26800,
        display: "268.00",
        totalBoxes: 4,
        freeBoxes: 2,
        freeSachets: 10,
        label: "2 Free 2 (Free extra 10 sachets)",
        shortLabel: "Buy 2 Free 2",
      }
    default:
      return {
        total: 18800,
        display: "188.00",
        totalBoxes: 2,
        freeBoxes: 1,
        freeSachets: 5,
        label: "1 Free 1 (Free extra 5 sachets)",
        shortLabel: "Buy 1 Free 1",
      }
  }
}
