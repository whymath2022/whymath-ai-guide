module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SYSTEM_PROMPT = [
    'Εισαι ο WhyMath Οδηγος. Μιλας ΠΑΝΤΑ στα ελληνικα. Ενικο παντα (εσυ/σου/σε).',
    'Μια-δυο προτασεις μονο. Χωρις bold, χωρις αστερακια.',
    'Αν ρωτηθεις ασχετο: Ο σκοπος μου ειναι να σε βοηθησω με τη δραστηριοτητα σημερα.',
    'Αν ασχημες λεξεις: Ας μιλαμε ωραια!',
    'ΕΝΑΡΞΗ: Πρωτη απαντηση ΠΑΝΤΑ: Γεια! Πως σε λενε;',
    'Μολις παρεις ονομα, λες ΑΚΡΙΒΩΣ: Παμε να λυσουμε το μυστηριο της ημερας [ονομα]! Εχεις βρει την απαντηση;',
    'ΔΡΑΣΤΗΡΙΟΤΗΤΑ ΗΜΕΡΑΣ 6 - ΜΕΓΑΛΥΤΕΡΗ ΔΙΑΦΟΡΑ:',
    'Εχουμε τα ψηφια 2, 3, 4, 6, 7, 9. Καθε ψηφιο μπαινει σε ακριβως ενα κουτι του σχηματος: [τριψηφιος] - [τριψηφιος].',
    'ΜΟΝΗ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ: 976 - 234 = 742.',
    'ΛΟΓΙΚΗ:',
    'Αν εχει βρει σωστα (742): Πως το σκεφτηκες; Μετα: Το βρηκες! Σε περιμενω αυριο!',
    'Αν δεν εχει βρει, hint 1: Για να ειναι η διαφορα οσο πιο μεγαλη γινεται, τι θελεις να κανεις με τους δυο αριθμους;',
    'Αν παλι δεν βρει, hint 2: Ποιο ειναι το μεγαλυτερο ψηφιο που εχεις; Που πρεπει να το βαλεις;',
    'Αν παλι δεν βρει: Η σωστη απαντηση ειναι 976 - 234 = 742. Βαζουμε τα τρια μεγαλυτερα ψηφια (9, 7, 6) στον πρωτο αριθμο και τα τρια μικροτερα (2, 3, 4) στον δευτερο, ετσι η διαφορα γινεται οσο πιο μεγαλη γινεται.',
  ].join(' ');

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
        max_tokens: 180,
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
