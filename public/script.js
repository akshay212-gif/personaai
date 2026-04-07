// ─────────────────────────────────────────────────────────────────
// PersonaAI — Frontend Script
// Calls our own /ask endpoint (key is safe on the server)
// ─────────────────────────────────────────────────────────────────

async function askAI() {
  const name     = document.getElementById('personaName').value.trim();
  const memory   = document.getElementById('memory').value.trim();
  const question = document.getElementById('question').value.trim();
  const btn      = document.getElementById('askBtn');
  const respEl   = document.getElementById('response');
  const box      = document.getElementById('responseBox');
  const tag      = document.getElementById('personaTag');

  // ── Validation ──────────────────────────────────────────────────
  if (!name || !memory || !question) {
    respEl.className = 'error';
    respEl.textContent = '⚠ Please fill in all three fields before asking.';
    box.className = 'response-box error-state';
    return;
  }

  // ── Loading state ────────────────────────────────────────────────
  btn.disabled = true;
  btn.textContent = 'Channeling twin…';
  box.className = 'response-box active';
  tag.textContent = name;
  respEl.className = '';
  respEl.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';

  try {
    // Calls our Express server — NO API key in frontend!
    const res = await fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, memory, question })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || `Server error ${res.status}`);
    }

    const reply = data.reply || '(No response returned)';

    // ── Typewriter effect ─────────────────────────────────────────
    respEl.textContent = '';
    respEl.className = '';
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    respEl.appendChild(cursor);

    const typeTimer = setInterval(() => {
      if (i < reply.length) {
        respEl.insertBefore(document.createTextNode(reply[i]), cursor);
        i++;
      } else {
        clearInterval(typeTimer);
        cursor.remove();
      }
    }, 18);

  } catch (err) {
    respEl.className = 'error';
    respEl.textContent = '✗ ' + (err.message || 'Something went wrong. Please try again.');
    box.className = 'response-box error-state';
  } finally {
    btn.disabled = false;
    btn.textContent = '⚡ Ask the Twin';
  }
}

// ── Enter key on question field ──────────────────────────────────
document.getElementById('question').addEventListener('keydown', e => {
  if (e.key === 'Enter') askAI();
});

// ── Live persona tag update ──────────────────────────────────────
document.getElementById('personaName').addEventListener('input', e => {
  const tag = document.getElementById('personaTag');
  tag.textContent = e.target.value.trim() || 'No persona set';
});
