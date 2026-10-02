const numberFormat = new Intl.NumberFormat('fr-FR');

// 235000 -> "235 000 FCFA"
export function formatFCFA(amount) {
    return `${numberFormat.format(amount)} FCFA`;
}

// 15 -> "15 jours restants"
export function formatDaysLeft(days) {
    if (days <= 0) return 'Campagne terminée';
    return days === 1 ? '1 jour restant' : `${days} jours restants`;
}