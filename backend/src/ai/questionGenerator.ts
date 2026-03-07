import { callLLM, FAST_MODEL, SMART_MODEL } from './client'
import type { InterviewConfig, SpeechConfig } from '@spotlightready/shared'

// ─────────────────────────────────────────────────────────────────────────────
// Question Generator  v2
// Uses SMART model for question generation (quality > token saving here).
// Domain-aware: maps 25+ roles to specific technical topics, frameworks,
// and common real-world interview patterns so questions never feel generic.
// ─────────────────────────────────────────────────────────────────────────────

interface RoleDomain {
  technicalTopics: string[]
  behavioralThemes: string[]
  situationalContext: string
  commonMistakes: string[]   // what interviewers often probe for
}

// ── 25+ role domains ──────────────────────────────────────────────────────────
const ROLE_DOMAINS: Record<string, RoleDomain> = {
  // ── Software Engineering ────────────────────────────────────────────────────
  sde: {
    technicalTopics: ['data structures (arrays, trees, graphs, heaps)', 'algorithms (sorting, searching, dynamic programming)', 'system design (scalability, caching, databases)', 'OOP principles', 'concurrency and threading', 'API design', 'time & space complexity'],
    behavioralThemes: ['debugging a production issue under pressure', 'disagreeing with a technical decision', 'mentoring a junior developer', 'shipping with incomplete requirements'],
    situationalContext: 'software engineering — building and maintaining production systems',
    commonMistakes: ['not clarifying requirements before coding', 'jumping to code without thinking through edge cases', 'poor communication of thought process'],
  },
  frontend: {
    technicalTopics: ['React/component lifecycle', 'state management (Redux, Zustand)', 'CSS specificity and layout (flexbox, grid)', 'browser rendering pipeline', 'web performance optimization', 'accessibility (ARIA, WCAG)', 'TypeScript generics'],
    behavioralThemes: ['cross-functional work with designers', 'performance regressions in production', 'balancing DX vs UX tradeoffs'],
    situationalContext: 'frontend engineering — building web UIs at scale',
    commonMistakes: ['no mention of accessibility', 'ignoring performance implications', 'over-engineering simple UI components'],
  },
  backend: {
    technicalTopics: ['REST vs GraphQL vs gRPC', 'database design (normalization, indexing, query optimization)', 'distributed systems concepts (CAP theorem, eventual consistency)', 'message queues (Kafka, RabbitMQ)', 'authentication & authorization', 'microservices patterns', 'load balancing'],
    behavioralThemes: ['handling a database outage', 'API versioning decisions', 'debugging a latency spike'],
    situationalContext: 'backend engineering — building reliable APIs and infrastructure',
    commonMistakes: ['ignoring error handling', 'not considering scale', 'weak on security implications'],
  },
  'data scientist': {
    technicalTopics: ['supervised vs unsupervised learning', 'feature engineering', 'model evaluation metrics (precision, recall, AUC)', 'overfitting and regularization', 'SQL and data wrangling', 'A/B testing and statistical significance', 'neural networks basics'],
    behavioralThemes: ['communicating model results to non-technical stakeholders', 'handling dirty/incomplete data', 'when a model fails in production'],
    situationalContext: 'data science — building and deploying machine learning models',
    commonMistakes: ['treating accuracy as the only metric', 'not validating assumptions', 'ignoring business impact'],
  },
  'data analyst': {
    technicalTopics: ['SQL (joins, window functions, CTEs)', 'data visualization principles', 'Excel/spreadsheet modeling', 'statistical analysis (mean, median, regression)', 'dashboard tools (Tableau, Power BI)', 'cohort analysis'],
    behavioralThemes: ['discovering unexpected insight in data', 'stakeholder disagreeing with your analysis', 'prioritizing multiple data requests'],
    situationalContext: 'data analysis — turning raw data into business decisions',
    commonMistakes: ['reporting metrics without context', 'correlation vs causation errors'],
  },
  'product manager': {
    technicalTopics: ['product roadmap prioritization (RICE, MoSCoW)', 'user story writing', 'market sizing (TAM/SAM/SOM)', 'metrics and OKRs', 'A/B testing', 'go-to-market strategy', 'competitive analysis'],
    behavioralThemes: ['saying no to a feature request from leadership', 'product that failed — lessons learned', 'aligning engineering and business goals', 'handling conflicting stakeholder priorities'],
    situationalContext: 'product management — owning product strategy and execution',
    commonMistakes: ['features over outcomes', 'no user empathy shown', 'vague success metrics'],
  },
  'investment banking': {
    technicalTopics: ['DCF valuation', 'comparable company analysis (comps)', 'LBO model basics', 'M&A deal process', 'debt vs equity financing', 'enterprise value vs equity value', 'WACC calculation', 'financial statement analysis'],
    behavioralThemes: ['working extremely long hours under a deadline', 'handling a deal that fell through', 'managing client expectations'],
    situationalContext: 'investment banking — financial advisory, M&A, and capital markets',
    commonMistakes: ['weak on technicals (DCF walk-through)', 'not knowing recent deals', 'poor understanding of market conditions'],
  },
  finance: {
    technicalTopics: ['financial modeling', 'P&L analysis', 'budgeting and forecasting', 'variance analysis', 'working capital management', 'ratio analysis (ROE, EBITDA, current ratio)', 'GAAP accounting principles'],
    behavioralThemes: ['identifying a financial discrepancy', 'tight month-end close under pressure', 'presenting financials to non-finance stakeholders'],
    situationalContext: 'finance — FP&A, financial planning, and analysis',
    commonMistakes: ['confusing revenue and profit', 'no specific examples of financial impact', 'ignoring business context'],
  },
  'sales': {
    technicalTopics: ['sales funnel stages', 'objection handling techniques', 'SPIN selling', 'CRM usage (Salesforce)', 'pipeline management', 'negotiation tactics', 'cold outreach strategy'],
    behavioralThemes: ['losing a major deal — what happened', 'exceeding quota in a tough market', 'handling a difficult client', 'shortest path to close'],
    situationalContext: 'sales — B2B/B2C selling, prospecting, and closing',
    commonMistakes: ['talking more than listening', 'no metrics on past performance', 'not qualifying leads properly'],
  },
  marketing: {
    technicalTopics: ['marketing funnel (TOFU/MOFU/BOFU)', 'SEO and content strategy', 'paid acquisition (Google Ads, Meta)', 'email marketing and automation', 'brand positioning', 'campaign ROI measurement', 'customer segmentation'],
    behavioralThemes: ['a campaign that underperformed', 'cross-functional coordination with sales', 'pivoting strategy based on data'],
    situationalContext: 'marketing — driving awareness, acquisition, and brand growth',
    commonMistakes: ['vanity metrics over conversion', 'no attribution understanding', 'ignoring customer retention'],
  },
  'hr': {
    technicalTopics: ['recruitment lifecycle (JD → offer)', 'behavioral interview techniques', 'performance management frameworks', 'compensation benchmarking', 'employment law basics', 'employee engagement metrics', 'HRIS systems'],
    behavioralThemes: ['handling a difficult termination', 'resolving a conflict between employees', 'improving hiring speed without cutting quality'],
    situationalContext: 'human resources — talent acquisition, retention, and people ops',
    commonMistakes: ['vague answers on conflict resolution', 'no metrics on hiring improvements'],
  },
  'consultant': {
    technicalTopics: ['case framework (issue tree, MECE)', 'market sizing estimation', 'profitability analysis', 'hypothesis-driven problem solving', 'slide deck structuring', 'stakeholder management', 'change management'],
    behavioralThemes: ['client resistant to your recommendation', 'tight deadline on a complex deliverable', 'working in an unfamiliar industry'],
    situationalContext: 'management consulting — problem solving, strategy, and client advisory',
    commonMistakes: ['not structuring answers (MECE)', 'jumping to solutions without data', 'weak numerical reasoning in cases'],
  },
  'devops': {
    technicalTopics: ['CI/CD pipeline design (GitHub Actions, Jenkins)', 'containerization (Docker, Kubernetes)', 'infrastructure as code (Terraform, Ansible)', 'monitoring and observability (Prometheus, Grafana)', 'cloud platforms (AWS/GCP/Azure)', 'incident response runbooks', 'zero-downtime deployments'],
    behavioralThemes: ['production incident at 3am', 'reducing deployment frequency safely', 'convincing developers to adopt new tooling'],
    situationalContext: 'DevOps/SRE — reliability, automation, and deployment pipelines',
    commonMistakes: ['no SLA/SLO awareness', 'weak on post-mortems and blameless culture'],
  },
  'ux designer': {
    technicalTopics: ['user research methods (interviews, usability testing)', 'wireframing and prototyping (Figma)', 'information architecture', 'design systems', 'accessibility standards', 'design thinking process', 'A/B testing designs'],
    behavioralThemes: ['design rejected by engineering for feasibility', 'conflicting feedback from users and stakeholders', 'designing for edge case users'],
    situationalContext: 'UX design — user research, interaction design, and product experience',
    commonMistakes: ['aesthetic over usability', 'no user research validation', 'not considering mobile'],
  },
  'cybersecurity': {
    technicalTopics: ['OWASP Top 10 vulnerabilities', 'network security fundamentals', 'penetration testing methodology', 'cryptography basics', 'incident response procedures', 'zero trust architecture', 'SOC monitoring'],
    behavioralThemes: ['discovering a security breach in progress', 'communicating risk to non-technical leadership', 'prioritizing vulnerabilities under limited resources'],
    situationalContext: 'cybersecurity — protecting systems, detecting threats, and incident response',
    commonMistakes: ['no understanding of threat modeling', 'only defensive mindset (no offensive thinking)'],
  },
  'project manager': {
    technicalTopics: ['PMBOK vs Agile vs Scrum', 'risk management matrix', 'stakeholder communication plan', 'critical path method', 'budget tracking and variance', 'resource allocation', 'scope creep management'],
    behavioralThemes: ['project that went over budget/deadline', 'managing remote cross-functional teams', 'escalating a risk to senior leadership'],
    situationalContext: 'project management — delivering projects on scope, time, and budget',
    commonMistakes: ['no concrete examples with metrics', 'no risk mitigation examples', 'weak on stakeholder management'],
  },
  'machine learning engineer': {
    technicalTopics: ['ML pipeline design (data → training → deployment)', 'model serving and latency optimization', 'feature stores', 'MLOps (experiment tracking, model versioning)', 'distributed training', 'LLM fine-tuning and RAG', 'monitoring model drift'],
    behavioralThemes: ['model degradation in production', 'balancing research vs engineering speed', 'collaborating with data scientists vs SWEs'],
    situationalContext: 'ML engineering — taking ML models from research to production at scale',
    commonMistakes: ['only theory, no production experience mentioned', 'ignoring inference latency'],
  },
  'business analyst': {
    technicalTopics: ['requirements elicitation techniques', 'process mapping (BPMN)', 'gap analysis', 'SQL for data analysis', 'user story writing (Agile)', 'KPI definition', 'stakeholder interviews'],
    behavioralThemes: ['conflicting requirements from stakeholders', 'scope creep mid-project', 'translating business needs to technical teams'],
    situationalContext: 'business analysis — bridging business requirements and technical delivery',
    commonMistakes: ['vague requirements documentation', 'no examples of measurable impact'],
  },
  'operations': {
    technicalTopics: ['process optimization (Lean, Six Sigma)', 'supply chain fundamentals', 'KPI dashboards', 'vendor management', 'SOP creation', 'capacity planning', 'root cause analysis (5 Whys, fishbone)'],
    behavioralThemes: ['operational bottleneck you identified and fixed', 'vendor failing to deliver', 'implementing a process change with resistant teams'],
    situationalContext: 'operations — optimizing processes, efficiency, and logistics',
    commonMistakes: ['no quantified improvements', 'vague process descriptions'],
  },
}

// Fuzzy match role string to domain key
function resolveDomain(role: string): RoleDomain | null {
  const r = role.toLowerCase()
  // Direct keys
  for (const key of Object.keys(ROLE_DOMAINS)) {
    if (r.includes(key)) return ROLE_DOMAINS[key]
  }
  // Common aliases
  if (r.includes('software') || r.includes(' dev') || r.includes('engineer') || r.includes('java') || r.includes('python') || r.includes('fullstack') || r.includes('full stack') || r.includes('full-stack')) return ROLE_DOMAINS['sde']
  if (r.includes('front') || r.includes('react') || r.includes('ui dev')) return ROLE_DOMAINS['frontend']
  if (r.includes('back') || r.includes('api') || r.includes('node') || r.includes('spring')) return ROLE_DOMAINS['backend']
  if (r.includes('ml') || r.includes('deep learning') || r.includes('ai engineer')) return ROLE_DOMAINS['machine learning engineer']
  if (r.includes('data sci')) return ROLE_DOMAINS['data scientist']
  if (r.includes('data anal') || r.includes('analyst') && r.includes('data')) return ROLE_DOMAINS['data analyst']
  if (r.includes('product') || r.includes(' pm ') || r.includes(' pm,') || r === 'pm') return ROLE_DOMAINS['product manager']
  if (r.includes('invest') || r.includes('ibank') || r.includes('i-bank')) return ROLE_DOMAINS['investment banking']
  if (r.includes('financ') || r.includes('fp&a') || r.includes('fpa')) return ROLE_DOMAINS['finance']
  if (r.includes('sale') || r.includes('account executive') || r.includes('ae')) return ROLE_DOMAINS['sales']
  if (r.includes('market')) return ROLE_DOMAINS['marketing']
  if (r.includes('hr') || r.includes('human resource') || r.includes('talent') || r.includes('recruit')) return ROLE_DOMAINS['hr']
  if (r.includes('consult')) return ROLE_DOMAINS['consultant']
  if (r.includes('devops') || r.includes('sre') || r.includes('platform') || r.includes('infra') || r.includes('cloud')) return ROLE_DOMAINS['devops']
  if (r.includes('ux') || r.includes('ui/ux') || r.includes('design')) return ROLE_DOMAINS['ux designer']
  if (r.includes('security') || r.includes('cyber') || r.includes('infosec') || r.includes('soc')) return ROLE_DOMAINS['cybersecurity']
  if (r.includes('project') || r.includes('delivery') || r.includes('scrum master')) return ROLE_DOMAINS['project manager']
  if (r.includes('business anal') || r.includes(' ba ') || r === 'ba') return ROLE_DOMAINS['business analyst']
  if (r.includes('operat') || r.includes('supply chain') || r.includes('logistics')) return ROLE_DOMAINS['operations']
  return null  // Unknown role — let AI handle with pure intelligence
}

const QUESTION_SYSTEM = `You are a senior interviewer at a top-tier company conducting a real interview.
Your job is to generate realistic, intelligent, and non-repetitive interview questions.

RULES:
- Each question must feel like something a real interviewer would actually ask
- Technical questions must be specific to the domain topics provided — not generic
- Behavioral questions must follow STAR situations (Situation-Task-Action-Result)
- Questions must progress in difficulty (first = warm-up, last = hardest)
- NEVER repeat similar questions
- NEVER ask "Tell me about yourself" or "What are your strengths/weaknesses"
- DO ask about real-world scenarios, tradeoffs, failure cases, and reasoning
- If you reference a technology, make sure it is relevant to the role

Return ONLY valid JSON: { "questions": ["q1", "q2", ...] }
No explanations, no markdown, no preamble.`

export async function generateQuestions(config: InterviewConfig): Promise<string[]> {
  const domain = resolveDomain(config.role)
  
  // Build a rich context block for the AI
  const n = config.totalQuestions
  const techCount = Math.ceil(n * 0.6)
  const behavCount = n - techCount

  let domainContext = ''
  if (domain) {
    domainContext = `
DOMAIN KNOWLEDGE FOR THIS ROLE:
Technical areas to probe: ${domain.technicalTopics.join('; ')}
Behavioral situations relevant to this role: ${domain.behavioralThemes.join('; ')}
What interviewers typically test: ${domain.commonMistakes.join('; ')}
Context: ${domain.situationalContext}
`
  }

  const experienceCtx = {
    fresher: 'The candidate is a fresh graduate — avoid deep system design, focus on fundamentals and learning mindset',
    junior: 'The candidate has 1-2 years experience — mix fundamentals with real-world application',
    mid: 'The candidate has 3-5 years experience — expect hands-on project knowledge, some system design',
    senior: 'The candidate has 5-8 years experience — deep system design, leadership, architectural decisions',
    lead: 'The candidate is a tech lead / principal — expect vision, cross-team influence, complex tradeoffs',
  }[config.experienceLevel] || ''

  const difficultyCtx = {
    beginner: 'Start easy — definitions, basic concepts, simple scenarios',
    intermediate: 'Mix of conceptual depth and practical experience',
    advanced: 'Deep technical questions, architectural thinking, hard tradeoffs',
    expert: 'Ambiguous real-world problems, no right answers — evaluate reasoning quality',
  }[config.difficulty] || ''

  const companyCtx = {
    startup: 'Startup: Ask about wearing multiple hats, moving fast, ambiguity, and ownership',
    faang: 'FAANG/Big Tech: Bar-raiser questions, scale (millions of users), operational excellence',
    'mid-size': 'Mid-size company: Balance of impact, process, and growth trajectory',
    enterprise: 'Enterprise: Process, compliance, stakeholder management, large codebase',
    consulting: 'Consulting firm: Communication, structured thinking, client empathy',
  }[config.companyType] || config.companyType

  const user = `Generate ${n} interview questions for:
Role: ${config.role}
Experience level: ${config.experienceLevel} — ${experienceCtx}
Company type: ${config.companyType} — ${companyCtx}
Difficulty: ${config.difficulty} — ${difficultyCtx}
${domainContext}
Generate EXACTLY ${techCount} technical questions and ${behavCount} behavioral/situational questions.
Questions must be in this order: warm-up first, progressively harder, most challenging last.
Make each question feel like it came from a different part of the interview — vary the angle.`

  try {
    const result = await callLLM<{ questions: string[] }>(QUESTION_SYSTEM, user, SMART_MODEL)
    const questions = result.questions || []
    if (questions.length > 0) return questions
  } catch (err) {
    console.error('[questionGenerator] LLM call failed, using domain fallback', err)
  }

  // Smart fallback: use domain topics if LLM fails
  if (domain) {
    return domain.technicalTopics.slice(0, Math.ceil(n * 0.6)).map(
      (topic) => `Walk me through how you would approach a problem involving ${topic} in a production system.`
    ).concat(
      domain.behavioralThemes.slice(0, Math.floor(n * 0.4)).map(
        (theme) => `Tell me about a time when you had to handle ${theme}. What was your approach and outcome?`
      )
    ).slice(0, n)
  }

  return [`Tell me about a challenging project you've worked on as ${config.role} and how you handled it.`]
}

// ─────────────────────────────────────────────────────────────────────────────
// Speech Topic Opener
// For speech mode: generate a strong opening line suggestion
// ─────────────────────────────────────────────────────────────────────────────

export async function generateSpeechOpener(config: SpeechConfig): Promise<string> {
  const SPEECH_SYS = `You are a speechwriting coach. Return JSON: { "opener": "..." }`
  const user = `Generate a compelling opening line for a speech on: "${config.topic}"
Audience: ${config.audienceSize}, Tone: ${config.formality}.
One powerful sentence that hooks attention immediately.`

  const result = await callLLM<{ opener: string }>(SPEECH_SYS, user, FAST_MODEL)
  return result.opener || ''
}
