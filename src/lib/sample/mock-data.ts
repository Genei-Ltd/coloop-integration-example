export interface Message {
  role: 'moderator' | 'participant'
  text: string
  timestamp: string
}

export interface Conversation {
  id: string
  participantName: string
  createdAt: string
  duration: string
  language: string
  quality: string
  status: 'completed' | 'incomplete' | 'screened_out'
  summary: string
  messages: Message[]
}

export const conversations: Conversation[] = [
  {
    id: '69efd529b64a941b0e88ce55',
    participantName: 'Participant 1',
    createdAt: '2026-04-27T22:29:13.000Z',
    duration: '00:04:32',
    language: 'English',
    quality: 'High',
    status: 'completed',
    summary:
      'The respondent uses Notion and Google Drive to organise research findings. They find tagging unreliable and want better search across documents. They have tried Dovetail but found it expensive for a small team.',
    messages: [
      {
        role: 'moderator',
        text: "Hi, thanks for participating in the interview! Let's get started. How are you doing today?",
        timestamp: '2026-04-27T22:29:14.000Z',
      },
      {
        role: 'participant',
        text: "I'm doing well, thanks for asking!",
        timestamp: '2026-04-27T22:29:29.000Z',
      },
      {
        role: 'moderator',
        text: "Great to hear! Let's dive in. I'd love to know a bit about how you currently handle your research data. Could you tell me about the tools or methods you use for storing and organising your research findings?",
        timestamp: '2026-04-27T22:29:30.000Z',
      },
      {
        role: 'participant',
        text: "Sure. We mostly use Notion for notes and tagging, and Google Drive for raw files like recordings and spreadsheets. It's a bit scattered honestly, but it works for now.",
        timestamp: '2026-04-27T22:30:15.000Z',
      },
      {
        role: 'moderator',
        text: "That's really helpful. You mentioned it feels a bit scattered. What's the biggest pain point with that setup?",
        timestamp: '2026-04-27T22:30:16.000Z',
      },
      {
        role: 'participant',
        text: "Searching across everything. Tags in Notion don't always get applied consistently, and finding a specific quote from an interview three months ago is basically impossible without scrolling through the full doc.",
        timestamp: '2026-04-27T22:31:42.000Z',
      },
      {
        role: 'moderator',
        text: 'Have you looked at any dedicated research repository tools to address that?',
        timestamp: '2026-04-27T22:31:43.000Z',
      },
      {
        role: 'participant',
        text: "We trialled Dovetail for a month. It was good but expensive for a team of three. We couldn't justify the cost at the time.",
        timestamp: '2026-04-27T22:33:10.000Z',
      },
      {
        role: 'moderator',
        text: 'Thank you so much for sharing your insights. It sounds like search and cost are the two main factors for you. I really appreciate your time and input. Have a great day!',
        timestamp: '2026-04-27T22:33:45.000Z',
      },
    ],
  },
  {
    id: '69efd529b64a941b0e88ce56',
    participantName: 'Participant 2',
    createdAt: '2026-04-27T23:05:00.000Z',
    duration: '00:06:18',
    language: 'English',
    quality: 'High',
    status: 'completed',
    summary:
      'The respondent manages a UX research team at a mid-size fintech. They use Confluence and Miro for synthesis but struggle with discoverability of past research. They are actively evaluating new tools and have budget approval for Q3.',
    messages: [
      {
        role: 'moderator',
        text: "Hi, thanks for joining! Let's get started. Could you tell me a bit about your role and how research fits into your day-to-day?",
        timestamp: '2026-04-27T23:05:01.000Z',
      },
      {
        role: 'participant',
        text: 'I lead a UX research team of five at a fintech company. We run about 20 studies a quarter, mix of moderated interviews and unmoderated usability tests.',
        timestamp: '2026-04-27T23:05:45.000Z',
      },
      {
        role: 'moderator',
        text: "That's a solid volume. How do you currently store and share your research findings across the team?",
        timestamp: '2026-04-27T23:05:46.000Z',
      },
      {
        role: 'participant',
        text: "Confluence for the write-ups and Miro for synthesis boards. Recordings go into a shared Google Drive folder. It's functional but honestly the biggest problem is nobody outside the research team ever finds anything.",
        timestamp: '2026-04-27T23:07:02.000Z',
      },
      {
        role: 'moderator',
        text: 'Interesting. So discoverability is a core issue. Have stakeholders missed insights that were already documented?',
        timestamp: '2026-04-27T23:07:03.000Z',
      },
      {
        role: 'participant',
        text: "All the time. We had a PM commission a study on onboarding friction that we'd literally done six months prior. Same questions, same audience segment. That was the moment I decided we need a proper research repository.",
        timestamp: '2026-04-27T23:08:54.000Z',
      },
      {
        role: 'moderator',
        text: 'Are you actively looking at tools to solve this, or is it more of a future consideration?',
        timestamp: '2026-04-27T23:08:55.000Z',
      },
      {
        role: 'participant',
        text: "Actively looking. We've got budget approval for Q3. I've shortlisted three tools and we're running pilots with each of them over the next few weeks.",
        timestamp: '2026-04-27T23:10:30.000Z',
      },
      {
        role: 'moderator',
        text: 'What criteria are most important to you when evaluating these tools?',
        timestamp: '2026-04-27T23:10:31.000Z',
      },
      {
        role: 'participant',
        text: 'Search quality is number one. Then integrations, we need it to play nicely with Slack and Confluence. And pricing that scales with our team size rather than per-seat enterprise pricing.',
        timestamp: '2026-04-27T23:11:18.000Z',
      },
      {
        role: 'moderator',
        text: "That's really valuable context. Thank you so much for your time and the detailed answers. Best of luck with the tool evaluation!",
        timestamp: '2026-04-27T23:11:19.000Z',
      },
    ],
  },
  {
    id: '69efd529b64a941b0e88ce57',
    participantName: 'Participant 3',
    createdAt: '2026-04-28T09:15:00.000Z',
    duration: '00:03:45',
    language: 'English',
    quality: 'Medium',
    status: 'completed',
    summary:
      'The respondent is a solo freelance researcher who uses spreadsheets and local folders. They have no budget for tooling and are not actively looking for a repository solution. Insights are shared via email and slide decks.',
    messages: [
      {
        role: 'moderator',
        text: "Hi there! Thanks for taking the time. Let's jump in. Can you tell me about your research practice and how you organise your work?",
        timestamp: '2026-04-28T09:15:01.000Z',
      },
      {
        role: 'participant',
        text: "I'm a freelance UX researcher. I work solo, mostly for startups. I keep everything in Google Sheets and folders on my laptop.",
        timestamp: '2026-04-28T09:15:40.000Z',
      },
      {
        role: 'moderator',
        text: 'How do you share findings with your clients?',
        timestamp: '2026-04-28T09:15:41.000Z',
      },
      {
        role: 'participant',
        text: 'Slide decks mostly. Sometimes a Loom video walkthrough. Whatever the client prefers.',
        timestamp: '2026-04-28T09:16:50.000Z',
      },
      {
        role: 'moderator',
        text: 'Have you ever wished you had a centralised place to store research across projects?',
        timestamp: '2026-04-28T09:16:51.000Z',
      },
      {
        role: 'participant',
        text: "Not really. Each client is a separate engagement and they own the deliverables. I don't have a need to look back across projects.",
        timestamp: '2026-04-28T09:18:00.000Z',
      },
      {
        role: 'moderator',
        text: "Fair enough. Thanks for sharing your perspective, it's really useful to hear from solo practitioners too. Have a great day!",
        timestamp: '2026-04-28T09:18:45.000Z',
      },
    ],
  },
  {
    id: '69efd529b64a941b0e88ce58',
    participantName: 'Participant 4',
    createdAt: '2026-04-28T14:00:00.000Z',
    duration: '00:01:12',
    language: 'English',
    quality: 'Low',
    status: 'completed',
    summary:
      'The respondent gave minimal single-word answers and did not elaborate on any topic. Insufficient data to draw conclusions about their research practices or needs.',
    messages: [
      {
        role: 'moderator',
        text: "Hi, thanks for participating! Let's get started. How are you doing today?",
        timestamp: '2026-04-28T14:00:01.000Z',
      },
      {
        role: 'participant',
        text: 'good',
        timestamp: '2026-04-28T14:00:15.000Z',
      },
      {
        role: 'moderator',
        text: 'Great to hear! Could you tell me about the tools or methods you use for storing and organising your research findings?',
        timestamp: '2026-04-28T14:00:16.000Z',
      },
      {
        role: 'participant',
        text: 'yes',
        timestamp: '2026-04-28T14:00:45.000Z',
      },
      {
        role: 'moderator',
        text: 'Thank you for your time. I appreciate your input. Have a great day!',
        timestamp: '2026-04-28T14:01:12.000Z',
      },
    ],
  },
]

export function getConversation(id: string): Conversation | undefined {
  return conversations.find((c) => c.id === id)
}
