// SGD pricing for Bloomie — amounts in cents
// Buy X Free X promo (free extra sachets)

export type SGQuantity = 1 | 2 | 3 | 4

export function calculatePriceSGD(quantity: SGQuantity) {
  switch (quantity) {
    case 4:
      return {
        total: 39900,
        display: "399.00",
        totalBoxes: 8,
        freeBoxes: 5,
        freeSachets: 0,
        label: "Buy 3 Free 3 + Top Up S$60 for Extra 2 Boxes",
        shortLabel: "PWP Set (Buy 3 Free 3 + 2 Boxes)",
      }
    case 3:
      return {
        total: 33900,
        display: "339.00",
        totalBoxes: 6,
        freeBoxes: 3,
        freeSachets: 15,
        label: "3 Free 3 (Free extra 15 sachets)",
        shortLabel: "Buy 3 Free 3",
      }
    case 2:
      return {
        total: 24800,
        display: "248.00",
        totalBoxes: 4,
        freeBoxes: 2,
        freeSachets: 10,
        label: "2 Free 2 (Free extra 10 sachets)",
        shortLabel: "Buy 2 Free 2",
      }
    default:
      return {
        total: 17800,
        display: "178.00",
        totalBoxes: 2,
        freeBoxes: 1,
        freeSachets: 5,
        label: "1 Free 1 (Free extra 5 sachets)",
        shortLabel: "Buy 1 Free 1",
      }
  }
}
