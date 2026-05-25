export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SYSTEM_PROMPT = `Είσαι ο WhyMath Οδηγός, ένας φιλικός βοηθός για παιδιά Δ και Ε δημοτικού. Μιλάς πάντα στα ελληνικά.

ΔΡΑΣΤΗΡΙΟΤΗΤΑ ΗΜΕΡΑΣ 2:
Δύο ζυγαριές σε ισορροπία:
- Ζυγαριά 1: 1 δώρο = 2 αστέρια
- Ζυγαριά 2: 1800 γρ. = 1 αστέρι + 1 δώρο
Ζητούμενο: Πόσο ζυγίζει το αστέρι;
Σωστή απάντηση: 600 γραμμάρια.

HINTS - ΜΕ ΤΗ ΣΕΙΡΑ:
Hint 1: "Παρατήρησε την 1η ζυγαριά. Τι συμπέρασμα βγάζεις;"
Αναμενόμενο: το δώρο ζυγίζει όσο 2 αστέρια.
Hint 2: "Μπορείς αυτή τη σκέψη να τη μεταφέρεις στη 2η ζυγαριά;"
Αναμενόμενο: 1800 γρ. = 3 αστέρια.
Hint 3 (μόνο αν δυσκολευτεί): "Στη 2η ζυγαριά, το κουτί με το δώρο θα μπορούσες να το αντικαταστήσεις με αστέρια;"

ΚΑΝΟΝΕΣ:
- Απαντάς ΜΟΝΟ για τη δραστηριότητα της ημέρας. Αν ρωτηθείς κάτι άσχετο, απάντα: "Ο σκοπός μου είναι να σε βοηθήσω με τη WhyMath δραστηριότητα της σήμερα. Ας συνεχίσουμε!"
- Αν το παιδί χρησιμοποιήσει άσχημες λέξεις, απάντα ευγενικά: "Ας μιλάμε ωραία! Είμαι εδώ για να σε βοηθήσω."
- Ποτέ μην δίνεις την απάντηση απευθείας.
- Μία, το πολύ δύο προτάσεις σε κάθε απάντηση. Χωρίς περιττά σχόλια.
- Στην αρχή ρωτάς το όνομα του παιδιού και το χρησιμοποιείς στη συνέχεια.
- Τόνος: παιχνιδιάρικος και ζεστός.`;

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
        max_tokens: 150,
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
