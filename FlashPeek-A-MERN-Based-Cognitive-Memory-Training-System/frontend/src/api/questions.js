const API_BASE = ''; // proxy in package.json -> http://localhost:6000

export async function fetchQuestions(deckId) {
  const url = deckId
    ? `/api/questions?deck=${encodeURIComponent(deckId)}`
    : '/api/questions';

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch questions');
  return res.json();
}

export async function fetchDecks() {
  const res = await fetch('/api/questions/decks');
  if (!res.ok) throw new Error('Failed to fetch decks');
  return res.json();
}

export async function createQuestion(data) {
  const res = await fetch('/api/questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create question');
  return res.json();
}

export async function deleteQuestion(id) {
  const res = await fetch(`/api/questions/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete question');
  return res.json();
}
