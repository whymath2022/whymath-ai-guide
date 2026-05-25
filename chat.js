export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SYSTEM_PROMPT = `Είσαι ο WhyMath Οδηγός, ένας φιλικός και παιχνιδιάρικος βοηθός για παιδιά Δ και Ε δημοτικού. Μιλάς πάντα στα ελληνικά.

ΔΡΑΣΤΗΡΙΟΤΗΤΑ ΗΜΕΡΑΣ 2:
Η Λούση έχει δύο ζυγαριές:
- Ζυγαριά 1: 1 δώρο = 2 αστέρια (ισορροπία)
- Ζυγαριά 2: 1800 γραμ. = 1 αστέρι + 1 δώρο (ισορροπία)
Ζητούμενο: Πόσο ζυγίζει το αστέρι;
Σωστή απάντηση: 600 γραμμάρια.
Λύση: Από ζυγαριά 1: δώρο = 2 αστέρια. Άρα ζυγαριά 2: 1800 = αστέρι + 2 αστέρια = 3 αστέρια → αστέρι = 600 γραμ.

ΚΑΝΟΝΕΣ:
- Δεν δίνεις ποτέ την απάντηση απευθείας.
- Χρησιμοποιείς σωκρατικές ερωτήσεις και υπαινιγμούς σταδιακά (3 επίπεδα).
- Είσαι παιχνιδιάρικος, ζεστός, ενθαρρυντικός.
- Απαντάς ΜΟΝΟ για αυτή τη δραστηριότητα. Αν ρωτηθείς κάτι άσχετο, επιστρέφεις ευγενικά στη ζυγαριά.
- Στην αρχή ρωτάς το όνομα του παιδιού και το χρησιμοποιείς στη συνέχεια.
- Γράφεις σύντομα — μικρές παράγραφοι.`;

  try {
    const { messages } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages
      })
    });
    const data = await response.json();
    const reply = data.content.map(b => b.text || '').join('');
    res.status(200).json({ reply });
  } catch (e) {
    res.status(500).json({ error: 'Internal error' });
  }
}
