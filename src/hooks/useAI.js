const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

export async function generateResume(profile, projects, skills, role, company) {
  const projList = projects.map((p, i) =>
    `${i + 1}. "${p.name}" — ${p.desc} | Tech: ${(p.tech || []).join(', ')} | Category: ${p.category || 'general'}${p.impact ? ' | Impact: ' + p.impact : ''}`
  ).join('\n')

  const eduList = (profile.educations || []).map(e =>
    `${e.university} — ${e.degree} in ${e.major}${e.doubleMajor ? ' & ' + e.doubleMajor : ''}${e.minor ? ', Minor: ' + e.minor : ''}, Grad: ${e.expected ? 'Expected ' : ''}${e.grad}${e.gpa ? ', GPA: ' + e.gpa : ''}${e.honors ? ', ' + e.honors : ''}${e.coursework ? ' | Coursework: ' + e.coursework : ''}`
  ).join('\n')

  const prompt = `You are an expert resume writer. Given a student's profile and projects, select the 3 most relevant projects for a specific internship role and generate a tailored resume in JSON.

ROLE: ${role}${company ? ' at ' + company : ''}

STUDENT PROFILE:
Name: ${profile.name || '[Your Name]'}
Education:
${eduList || profile.university + ' ' + profile.degree}
Skills: ${skills.join(', ') || '(not specified)'}

ALL PROJECTS (${projects.length} total):
${projList}

TASK:
1. Score each project 0-100 for relevance to the role
2. Pick the top 3 projects
3. Write 2 punchy bullet points per project (action verb + metric, max 12 words each)
4. Write a 2-sentence professional summary tailored to the role
5. Suggest 8-10 skills to highlight

Respond ONLY with valid JSON, no markdown, no explanation:
{
  "summary": "string",
  "tailoredTitle": "string",
  "selectedProjects": [
    {
      "id": "project_id",
      "name": "string",
      "score": 0-100,
      "scoreReason": "short reason",
      "bullets": ["bullet 1", "bullet 2"]
    }
  ],
  "highlightedSkills": ["skill1", "skill2"]
}`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()
  const text = data.content?.[0]?.text || ''
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}