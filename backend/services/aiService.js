const axios = require('axios');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

function buildPrompt(employees, mode) {
  const employeeJson = JSON.stringify(employees, null, 2);

  const system =
    'You are an HR assistant that generates actionable, concise employee performance recommendations. ' +
    'Return STRICT JSON only. Do not include markdown.';

  let instruction = '';
  if (mode === 'promotion') {
    instruction =
      'For each employee, decide if they are ready for promotion. ' +
      'If performanceScore >= 85 and they have strong skills, recommend promotion. ' +
      'If score is low, provide improvement steps. ' +
      'Also include reasons and a confidence score 0-1.';
  } else if (mode === 'ranking') {
    instruction =
      'Rank employees from best to worst for current role based on performanceScore, experience, and skills match. ' +
      'Return an array with rank and short justification. Include overall summary.';
  } else if (mode === 'training') {
    instruction =
      'Provide training suggestions per employee. ' +
      'If they are missing skills, recommend skill enhancement training modules. ' +
      'Make it actionable (courses/topics + 1-week plan).';
  } else {
    instruction =
      'Provide AI feedback generation: performance analysis + next steps for HR and for the employee. ' +
      'Use performanceScore and experience to tailor feedback. If score is low, suggest improvement feedback.';
  }

  return { system, instruction, employeeJson };
}

async function getChatCompletion({ employees, mode }) {
  const { system, instruction, employeeJson } = buildPrompt(employees, mode);

  const payload = {
    model: 'openai/gpt-4o-mini',
    temperature: 0.2,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: `${instruction}\n\nEmployees JSON:\n${employeeJson}\n\nReturn format: {"mode":"${mode}","result":<your result>}` }
    ],
    response_format: { type: 'json_object' }
  };

  const headers = {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json'
  };

  const resp = await axios.post(OPENROUTER_URL, payload, { headers, timeout: 60000 });
  const content = resp?.data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('AI response missing content');
  }

  // OpenRouter can return JSON as a string; parse robustly.
  if (typeof content === 'string') {
    return JSON.parse(content);
  }
  return content;
}

async function recommend({ employees, mode }) {
  if (!Array.isArray(employees) || employees.length === 0) {
    throw new Error('employees must be a non-empty array');
  }

  const safeMode = ['promotion', 'ranking', 'training', 'feedback'].includes(mode) ? mode : 'feedback';

  try {
    return await getChatCompletion({ employees, mode: safeMode });
  } catch (err) {
    const fallback = {
      mode: safeMode,
      result: {
        message: 'AI generation failed. Please verify OPENROUTER_API_KEY and try again.',
        error: err?.response?.data || err?.message || 'Unknown error'
      }
    };
    return fallback;
  }
}

module.exports = { recommend };

