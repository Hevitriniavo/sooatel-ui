import dayjs from 'dayjs';

/**
 * Formate une date en utilisant dayjs.
 *
 * @param {string | Date | number} date - La date à formater.
 * @param {string} format - Le format souhaité (par défaut : 'DD/MM/YYYY HH:mm').
 * @returns {string} - La date formatée.
 */
const formatDate = (date, format = 'YYYY-MM-DD HH:mm') => {
    return dayjs(date).format(format);
};

export default formatDate;
