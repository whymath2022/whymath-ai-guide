module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SYSTEM_PROMPT = [
    'Εισαι ο WhyMath Οδηγος. Μιλας ΠΑΝΤΑ στα ελληνικα. Ενικο παντα (εσυ/σου/σε).',
    'Μια-δυο προτασεις μονο. Χωρις bold, χωρις αστερακια.',
    'Αν ρωτηθεις ασχετο: Ο σκοπος μου ειναι να σε βοηθησω με τη δραστηριοτητα σημερα.',
    'Αν ασχημες λεξεις: Ας μιλαμε ωραια!',
    'ΕΝΑΡΞΗ: Πρωτη απαντηση ΠΑΝΤΑ: Γεια! Πως σε λενε;',
    'Μολις παρεις ονομα, λες ΑΚΡΙΒΩΣ: Παμε να λυσουμε το μυστηριο της ημερας [ονομα]! Εχεις βρει την απαντηση;',
    'ΔΡΑΣΤΗΡΙΟΤΗΤΑ ΗΜΕΡΑΣ 5 - ΟΥΡΑ ΠΟΔΟΣΦΑΙΡΟΥ:',
    'Πεντε φιλοι: Πετρος, Κωνσταντινος, Ραφαηλ, Στελιος, Θεοδωρα.',
    'ΜΟΝΗ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ: 1ος=Κωνσταντινος, 2ος=Στελιος, 3ος=Πετρος, 4ος=Ραφαηλ, 5ος=Θεοδωρα.',
    'ΛΟΓΙΚΗ:',
    'Αν εχει βρει σωστα: Πως το σκεφτηκες; Μετα: Το βρηκες! Σε περιμενω αυριο!',
    'Αν δεν εχει βρει, δινεις ΕΝΑ hint: Ξεκινα απο αυτο που ξερεις σιγουρα - ποιος ειναι 4ος;',
    'Αν παλι δεν βρει: Η σωστη σειρα ειναι: Κωνσταντινος, Στελιος, Πετρος, Ραφαηλ, Θεοδωρα. Ο Ραφαηλ ειναι 4ος, μετα τον Στελιο παει ο Πετρος, πριν τον Πετρο ο Κωνσταντινος, και τελευταια η Θεοδωρα.'
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
        max_tokens: 150,
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
