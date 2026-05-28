module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const CORRECT_PATH = 'ABGHGLQPKLMNIDCDEJOTSRWX';
  const GROUPS = ['ABGH', 'GLQP', 'KLMN', 'IDCD', 'EJOT', 'SRWX'];

  const { messages } = req.body;
  const lastMessage = messages[messages.length - 1].content.toUpperCase().trim();

  // Ελεγχος αν ειναι ομαδα 4 γραμματων
  const matchedGroup = GROUPS.find(g => lastMessage === g);
  const isFullPath = lastMessage === CORRECT_PATH;

  let systemNote = '';

  if (isFullPath) {
    systemNote = 'Το παιδι εδωσε ολο το σωστο μονοπατι. Πες: Το βρηκες! Σε περιμενω αυριο για το επομενο μυστηριο!';
  } else if (matchedGroup) {
    const idx = GROUPS.indexOf(matchedGroup);
    const next = GROUPS[idx + 1];
    if (next) {
      systemNote = `Η ομαδα ${matchedGroup} ειναι ΣΩΣΤΗ. Πες: Σωστα! Συνεχισε με τα επομενα 4.`;
    }
  } else if (lastMessage.length === 4) {
    // Βρισκουμε ποια ομαδα ειναι λαθος
    let wrongAt = '';
    for (let i = 0; i < GROUPS.length; i++) {
      if (lastMessage !== GROUPS[i]) {
        wrongAt = GROUPS[i];
        break;
      }
    }
    if (wrongAt.includes('G') || wrongAt.includes('L') || wrongAt.includes('D')) {
     const correct = GROUPS[i];
const wrongLetter = lastMessage.split('').find((c, idx) => c !== correct[idx]);
systemNote = `Η ομαδα ειναι ΛΑΘΟΣ. Τα πρωτα γραμματα πριν το λαθος ειναι σωστα, αλλα το γραμμα ${wrongLetter} δεν ειναι σωστο. Πες ΑΚΡΙΒΩΣ: Σωστα τα πρωτα γραμματα, αλλα το ${wrongLetter} δεν ειναι σωστο. Δες το τετραγωνο G - ειναι η 1η φορα που περνας εκει;`;
    } else {
      systemNote = `Η ομαδα ειναι ΛΑΘΟΣ. Η σωστη ειναι ${wrongAt}. Πες στο παιδι οτι εκανε λαθος και να ξαναπροσπαθησει.`;
    }
  }

  const SYSTEM_PROMPT = [
    'Εισαι ο WhyMath Οδηγος. Μιλας ΠΑΝΤΑ στα ελληνικα. Ενικο παντα (εσυ/σου/σε).',
    'Μια-δυο προτασεις μονο. Χωρις bold, χωρις αστερακια.',
    'Αν ρωτηθεις ασχετο: Ο σκοπος μου ειναι να σε βοηθησω με τη δραστηριοτητα σημερα.',
    'Αν ασχημες λεξεις: Ας μιλαμε ωραια!',
    'ΕΝΑΡΞΗ: Πρωτη απαντηση ΠΑΝΤΑ: Γεια! Πως σε λενε;',
    'Μολις παρεις ονομα, λες ΑΚΡΙΒΩΣ: Παμε να λυσουμε το μυστηριο της ημερας [ονομα]! Εχεις βρει την απαντηση;',
    'Αν ναι: ζητας να γραψει ολα τα γραμματα.',
    'Αν οχι: λες: Εντοξει! Γραψε μου τα πρωτα 4 γραμματα της διαδρομης σου.',
    'Αν ρωτησει για G, L, D: λες: Ειναι η πρωτη φορα που πατας εκει η εχεις ξαναπερασει;',
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
