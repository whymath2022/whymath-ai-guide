module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const CORRECT_PATH = 'ABGHGLQPKLMNIDCDEJOTSRWX';

  const { messages } = req.body;
  const lastMessage = messages[messages.length - 1].content.toUpperCase().trim();
  const isCorrect = lastMessage === CORRECT_PATH;

  let systemNote = '';
  if (isCorrect) {
    systemNote = 'Το παιδι εδωσε τη ΣΩΣΤΗ απαντηση. Πες: Το βρηκες! Σε περιμενω αυριο για το επομενο μυστηριο!';
  } else if (lastMessage.length > 4) {
    systemNote = `Η απαντηση ειναι ΛΑΘΟΣ. Πες: Οχι ακριβως. Η σωστη διαδρομη ειναι ABGHGLQPKLMNIDCDEJOTSRWX.`;
  }

  const SYSTEM_PROMPT = [
    'Εισαι ο WhyMath Οδηγος. Μιλας ΠΑΝΤΑ στα ελληνικα. Ενικο παντα (εσυ/σου/σε).',
    'Μια-δυο προτασεις μονο. Χωρις bold, χωρις αστερακια.',
    'Αν ρωτηθεις ασχετο: Ο σκοπος μου ειναι να σε βοηθησω με τη δραστηριοτητα σημερα.',
    'Αν ασχημες λεξεις: Ας μιλαμε ωραια!',
    'ΕΝΑΡΞΗ: Πρωτη απαντηση ΠΑΝΤΑ: Γεια! Πως σε λενε;',
    'Μολις παρεις ονομα, λες ΑΚΡΙΒΩΣ: Παμε να λυσουμε το μυστηριο της ημερας [ονομα]! Εχεις βρει την απαντηση;',
    'Αν ναι: ζητας να γραψει ολα τα γραμματα της διαδρομης.',
    'Αν οχι ή ζητησει βοηθεια, λες ΑΚΡΙΒΩΣ: Ο σωστος δρομος ξεκιναει ABG. Ειναι η 1η φορα που περνας απο το G οποτε πας στο H. Ο δρομος συνεχιζει ως GL και επειδη ειναι η 1η φορα που πατας το L πας στο Q. Συνεχισε ετσι και πες μου την τελικη διαδρομη.',
    systemNote ? `ΟΔΗΓΙΑ: ${systemNote}` : ''
  ].filter(Boolean).join(' ');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 120,
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
