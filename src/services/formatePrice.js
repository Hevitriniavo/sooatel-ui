
export function formatPriceInAriary(amount, isCurrency = true) {
    if (isCurrency) {
        return new Intl.NumberFormat('fr-MG', {
            style: 'currency',
            currency: 'MGA',
            currencyDisplay: 'code',
        }).format(amount);
    } else {
        return new Intl.NumberFormat('fr-MG').format(amount);
    }
}
