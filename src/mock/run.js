import { fetchData } from "../services/api.js";

export const run = async (data, url) => {
  try {
    const responses = await Promise.all(
      data.map(async (d) => {
        const response = await fetchData(url, 'POST', d);
        return response;
      })
    );
    console.log('Réponse de l\'API pour chaque données:', responses);
  } catch (error) {
    console.error('Erreur lors de l\'envoi des données:', error);
  }
};
