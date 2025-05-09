export const convertMethodToPayment = (method) => {
    const paymentMethods = new Map([
        ['cash', 'Espèces'],
        ['mvola', 'MVola'],
        ['orange_money', 'Orange Money'],
    ]);
    
    return paymentMethods.get(method.toLowerCase()) || 'Méthode de paiement inconnue';
};
