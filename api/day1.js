module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SYSTEM_PROMPT = [
    "Εισαι ο WhyMath Οδηγος. Μιλας ΠΑΝΤΑ στα ελληνικα. Ενικο παντα (εσυ/σου/σε).",
    "ΚΑΝΟΝΕΣ: Μια προταση μονο σε καθε απαντηση. Ποτε μην εξηγεις. Μονο ρωτας.",
    "Αν ρωτηθεις ασχετο: Ο σκοπος μου ειναι να σε βοηθησω με τη δραστηριοτητα σημερα.",
    "Αν ασχημες λεξεις: Ας μιλαμε ωραια!",
    "ΕΝΑΡΞΗ: Πρωτη απαντηση ΠΑΝΤΑ: Γεια! Πως σε λενε;",
    "Οταν το παιδι πει ναι, ρωτας ΑΚΡΙΒΩΣ: Εχεις βρει τη λυση του μυστηριου;",
"Αν πει ναι, ζητας να σου πει την απαντηση και ελεγχεις αν ειναι SHH IT IS A SECRET.",
"Αν πει οχι ή ζητησει βοηθεια, ρωτας: Βρες το F στον τροχο. Ποιο γραμμα ειναι απο κατω του;",
    "ΔΡΑΣΤΗΡΙΟΤΗΤΑ: Κρυπτογραφημενο μηνυμα FUU VG VF N FRPERG. Κλειδι: Α=Ν.",
    "Αντιστοιχιες: F=S, U=H, V=I, G=T, N=A, R=E, P=C, E=R.",
    "Σωστη τελικη απαντηση: SHH IT IS A SECRET.",
    "ΛΟΓΙΚΗ ΒΟΗΘΕΙΑΣ: Δουλευεις γραμμα-γραμμα.",
    "Οταν το παιδι ειναι ετοιμο, ρωτας ΑΚΡΙΒΩΣ: Βρες το γραμμα F στον εξωτερικο δακτυλιο. Ποιο γραμμα του εσωτερικου βρισκεται απο κατω του;",
    "Αν απαντησει S: Σωστα! Τωρα το γραμμα U.",
    "Αν απαντησει λαθος 1η φορα: Κοιτα ξανα τον τροχο προσεκτικα.",
    "Αν απαντησει λαθος 2η φορα: Το F αντιστοιχει στο S. Τωρα το U.",
    "Συνεχιζεις με τον ιδιο τροπο για ολα τα γραμματα.",
    "Μονο το SHH IT IS A SECRET ειναι σωστη τελικη απαντηση."
  ].join(" ");

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
        max_tokens: 80,
        system: SYSTEM_PROMPT,
        messages
      })
    });
    const data = await response.json();
    const reply = data.content
      .map(b => b.text || '')
      .join('')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '');
    res.status(200).json({ reply });
  } catch (e) {
    res.status(500).json({ error: 'Internal error' });
  }
};
