export type UseCase = {
  title: string;
  description: string;
  hero: string;
  categories: string[];
  limit: number;
  affiliate: { name: string; url: string; desc: string; cta: string } | null;
  faqs: { q: string; a: string }[];
};

export const USE_CASES: Record<string, UseCase> = {
  'content-creators': {
    title: 'Best AI Tools for Content Creators',
    description: 'Top AI tools for YouTubers, bloggers, podcasters, and social media creators. Save hours every week on content production.',
    hero: 'Save hours every week with AI-powered content creation',
    categories: ['Writing', 'Video', 'Audio', 'Image'],
    limit: 12,
    affiliate: {
      name: 'ElevenLabs',
      url: 'https://try.elevenlabs.io/f4il4v3cm496?sub1=for-content-creators',
      desc: 'Clone your voice and generate studio-quality narration for videos, podcasts, and social media in seconds. Used by 1M+ creators worldwide.',
      cta: 'Try ElevenLabs Free →'
    },
    faqs: [
      { q: 'What is the best AI tool for content creators?', a: 'For content creators, ElevenLabs (AI voice), Synthesia (AI video), and Jasper (AI writing) consistently rank highest. The best choice depends on your content format — voice-first creators should start with ElevenLabs.' },
      { q: 'Can AI tools help with YouTube content creation?', a: 'Yes — AI writing tools help with scripts and titles, AI voice tools create narration, and AI video tools like Synthesia generate talking-head videos automatically. Many YouTubers use 3-4 AI tools in their production pipeline.' },
      { q: 'Are there free AI tools for content creators?', a: 'Several top tools have generous free tiers. ElevenLabs, Canva AI, and ChatGPT all offer free plans with enough capacity to get started without a credit card.' }
    ]
  },
  'freelancers': {
    title: 'Best AI Tools for Freelancers',
    description: 'AI tools that help freelancers work faster, win more clients, and automate the repetitive tasks that eat into billable hours.',
    hero: 'Work smarter, win more clients, and automate the boring stuff',
    categories: ['Writing', 'Productivity', 'Marketing'],
    limit: 10,
    affiliate: {
      name: 'Zaap',
      url: 'https://app.zaap.ai/create-url/?ref=matt&sub1=for-freelancers',
      desc: 'The all-in-one creator platform — sell digital products, build a link-in-bio, and grow your freelance business with built-in payments and analytics.',
      cta: 'Try Zaap Free →'
    },
    faqs: [
      { q: 'What AI tools are best for freelancers?', a: 'Top picks include AI writing tools for proposals and deliverables (Jasper, Grammarly), productivity tools (Notion AI), and marketing tools for finding clients. The right stack depends on your freelance niche.' },
      { q: 'Can AI replace freelancers?', a: 'AI augments freelancers rather than replacing them. Freelancers who use AI tools consistently report taking on 30-50% more work at the same quality — making them more competitive, not obsolete.' },
      { q: 'What is the best free AI tool for freelancers?', a: 'ChatGPT free tier is the most versatile starting point for freelancers. For specific tasks: Grammarly (writing polish), Canva AI (design), and ElevenLabs (voice) all offer strong free tiers.' }
    ]
  },
  'marketers': {
    title: 'Best AI Tools for Marketers',
    description: 'AI marketing tools for content creation, campaign automation, email marketing, and ad optimization. Scale your output without scaling headcount.',
    hero: 'Scale your marketing with AI — more campaigns, less effort',
    categories: ['Marketing', 'Writing', 'Image'],
    limit: 12,
    affiliate: {
      name: 'EmailOctopus',
      url: 'https://emailoctopus.com/pricing?ref=matt&sub1=for-marketers',
      desc: 'Affordable email marketing with powerful automation — grow your list and drive conversions at a fraction of the cost of Mailchimp or HubSpot.',
      cta: 'Try EmailOctopus Free →'
    },
    faqs: [
      { q: 'What are the best AI tools for digital marketing?', a: 'Top AI marketing tools include Jasper (content at scale), Albert AI (paid ads automation), Copy.ai (copywriting), and EmailOctopus (email marketing). The best stack depends on your primary channel.' },
      { q: 'How can AI help with marketing automation?', a: 'AI marketing tools automate email sequences, generate ad copy variations, optimize bidding strategies, and personalize content at scale — saving marketing teams 10+ hours per week per person.' },
      { q: 'Are AI marketing tools worth the investment?', a: 'Teams using AI writing tools report 3x faster content production. AI ad optimization tools typically achieve 20-30% better ROAS. Most marketers see positive ROI within the first month.' }
    ]
  },
  'developers': {
    title: 'Best AI Tools for Developers',
    description: 'AI coding assistants, code completion tools, and developer productivity tools that help you ship faster and write better code.',
    hero: 'Ship faster with AI pair programming and code automation',
    categories: ['Coding', 'Productivity'],
    limit: 10,
    affiliate: null,
    faqs: [
      { q: 'What is the best AI coding assistant in 2026?', a: 'GitHub Copilot, Cursor, and Codeium are the top picks. Cursor is best for complex multi-file edits; Copilot has the widest IDE integration; Codeium offers the most generous free tier.' },
      { q: 'Is GitHub Copilot worth the subscription cost?', a: 'For most developers, yes. Copilot saves 2-4 hours per day on boilerplate and repetitive code. At $10/mo, ROI is nearly instant for anyone billing above minimum wage.' },
      { q: 'What free AI coding tools are available?', a: 'Codeium and Tabnine both have generous free tiers. GitHub Copilot is free for verified students. ChatGPT free tier is excellent for architecture questions and debugging.' }
    ]
  },
  'small-business-owners': {
    title: 'Best AI Tools for Small Business Owners',
    description: 'AI tools that help small businesses automate tasks, market smarter, and compete with larger companies without hiring a full team.',
    hero: 'Run your business smarter with AI automation and fewer hires',
    categories: ['Marketing', 'Productivity', 'Writing'],
    limit: 12,
    affiliate: {
      name: 'Outseta',
      url: 'https://outseta.com/pricing?via=matt-morales&sub1=for-small-business',
      desc: 'All-in-one business platform — CRM, billing, email marketing, and member portal in one tool. Perfect for small businesses that want to avoid SaaS sprawl.',
      cta: 'Try Outseta Free →'
    },
    faqs: [
      { q: 'What AI tools are best for small businesses?', a: 'The highest-ROI AI tools for small businesses are AI writing tools (replace $500-2k/mo in copywriting costs), AI customer service chatbots, and AI marketing automation. Start with one problem and solve it completely before expanding.' },
      { q: 'Are AI tools affordable for small businesses?', a: 'Most AI tools start at $20-50/mo and replace multiple expensive services or contractor costs. Many have free tiers that are sufficient for getting started with zero upfront investment.' },
      { q: 'How can AI help my small business grow?', a: 'AI tools help small businesses by automating content creation, improving customer response times, generating more qualified leads, and freeing up owner time for higher-value strategic activities.' }
    ]
  },
  'students': {
    title: 'Best AI Tools for Students',
    description: 'AI tools for studying, essay writing, research, and learning — all student-budget friendly, many with free plans.',
    hero: 'Study smarter, write faster, learn more with AI',
    categories: ['Writing', 'Productivity', 'Coding'],
    limit: 10,
    affiliate: null,
    faqs: [
      { q: 'What are the best free AI tools for students?', a: 'ChatGPT (free tier), Grammarly (free plan), and Notion AI (free tier) are the top picks. They cover writing, grammar, and organization without subscription costs — enough to get significant value immediately.' },
      { q: 'Is using AI tools for studying considered cheating?', a: 'Using AI for research, brainstorming, and learning is generally accepted and encouraged. Using AI to write submitted assignments varies by institution — always check your school\'s specific AI policy before submitting AI-assisted work.' },
      { q: 'Can AI tools help computer science students?', a: 'Yes — GitHub Copilot is free for verified students and is widely used in CS courses. It helps you understand new syntax, debug errors, and learn best practices faster than documentation alone.' }
    ]
  },
  'podcasters': {
    title: 'Best AI Tools for Podcasters',
    description: 'AI podcast tools for voice generation, transcription, show notes, editing, and audience growth.',
    hero: 'Produce professional podcasts in half the time with AI',
    categories: ['Audio', 'Writing'],
    limit: 10,
    affiliate: {
      name: 'ElevenLabs',
      url: 'https://try.elevenlabs.io/f4il4v3cm496?sub1=for-podcasters',
      desc: 'The #1 AI voice platform — create realistic AI voiceovers, clone your voice for intros, and automatically generate multilingual versions of your podcast from one master recording.',
      cta: 'Try ElevenLabs Free →'
    },
    faqs: [
      { q: 'What is the best AI tool for podcasters?', a: 'ElevenLabs (AI voice cloning), Descript (editing via transcript), and Otter.ai (transcription) are the top picks. ElevenLabs is best for voice generation; Descript is the most powerful tool for the overall production workflow.' },
      { q: 'Can AI write podcast show notes automatically?', a: 'Yes — AI writing tools like Jasper or ChatGPT can generate show notes, chapters, and social clips from your episode transcript in minutes. Many podcasters run this workflow after every episode.' },
      { q: 'Is there an AI tool that removes filler words from podcasts?', a: 'Descript is the market leader for AI podcast editing — it can automatically detect and remove filler words, silences, and background noise, and lets you edit audio by editing the text transcript.' }
    ]
  },
  'video-creators': {
    title: 'Best AI Tools for Video Creators',
    description: 'AI video tools for script writing, AI avatar videos, editing automation, and thumbnail generation. Create professional content without expensive production.',
    hero: 'Create professional videos without studios or expensive gear',
    categories: ['Video', 'Image', 'Writing'],
    limit: 12,
    affiliate: {
      name: 'Synthesia',
      url: 'https://synthesia.io/pricing?via=matt-morales&sub1=for-video-creators',
      desc: 'Create professional presenter videos from text in minutes. 140+ AI avatars, 120+ languages, no camera or crew required. Used by 50,000+ companies.',
      cta: 'Try Synthesia Free →'
    },
    faqs: [
      { q: 'What is the best AI tool for video creation in 2026?', a: 'Synthesia (AI avatar videos), HeyGen (talking-head personalization), and Runway (AI video editing) are the top picks. Synthesia is best for training and explainer content; HeyGen excels at personalized outreach at scale.' },
      { q: 'Can AI create YouTube videos automatically?', a: 'AI tools can handle scripts (Jasper), voiceovers (ElevenLabs), and editing (Descript), but fully automated YouTube channels still require human creative direction for quality content. The tools reduce production time by 60-80%.' },
      { q: 'Are AI video tools worth the cost for businesses?', a: 'For businesses creating regular training or marketing content, yes — Synthesia and HeyGen typically save $2-5k per video compared to hiring a production company, while allowing much faster iteration.' }
    ]
  },
  'social-media-managers': {
    title: 'Best AI Tools for Social Media Managers',
    description: 'AI tools for social media content creation, caption writing, scheduling, and analytics. Build weeks of content in hours.',
    hero: 'Create weeks of social content in hours with AI',
    categories: ['Marketing', 'Writing', 'Image'],
    limit: 12,
    affiliate: {
      name: 'EmailOctopus',
      url: 'https://emailoctopus.com/pricing?ref=matt&sub1=for-social-media',
      desc: 'Convert your social following into owned subscribers — EmailOctopus is the most affordable way to build an email list alongside your social channels, with powerful automations and beautiful templates.',
      cta: 'Try EmailOctopus Free →'
    },
    faqs: [
      { q: 'What AI tool is best for social media management?', a: 'Jasper (captions and copy), Canva AI (visuals), and Buffer AI (scheduling) are the most widely used. For pure content generation, Copy.ai and ChatGPT give you unlimited caption variations fast.' },
      { q: 'Can AI write social media captions that feel authentic?', a: 'Yes — with proper brand voice training. Provide 5-10 examples of your existing captions and your brand guidelines, and tools like Jasper or Copy.ai generate on-brand content that sounds human.' },
      { q: 'Are there free AI tools for social media managers?', a: 'ChatGPT free tier, Canva free plan, and Buffer free tier are the best starting points for social media managers. These three alone cover most content creation and scheduling needs without a budget.' }
    ]
  },
  'startups': {
    title: 'Best AI Tools for Startups',
    description: 'AI tools that help startups move fast, validate ideas, build products, and grow revenue with a small team.',
    hero: 'Move at startup speed with an AI-powered team of one',
    categories: ['Coding', 'Marketing', 'Productivity', 'Writing', 'Data'],
    limit: 15,
    affiliate: {
      name: 'Baremetrics',
      url: 'https://baremetrics.com/pricing?via=matt&sub1=for-startups',
      desc: 'Real-time SaaS metrics and revenue analytics — see MRR, churn, LTV, and cohort data in one dashboard. Essential for subscription businesses that want to make data-driven growth decisions.',
      cta: 'Try Baremetrics Free →'
    },
    faqs: [
      { q: 'What AI tools should every startup use?', a: 'Top picks: GitHub Copilot or Cursor (ship 30-50% faster), Jasper or Copy.ai (marketing content without a team), ChatGPT (everything else), and Baremetrics (revenue tracking). Focus on tools that eliminate your current biggest bottleneck.' },
      { q: 'How can AI help a startup grow faster?', a: 'AI tools compress timelines dramatically — coding assistants cut dev time by 30-50%, AI marketing tools eliminate the content bottleneck, and AI analytics surface growth insights before they become obvious. Speed is the startup\'s only structural advantage over incumbents.' },
      { q: 'Are AI tools too expensive for early-stage startups?', a: 'Most startup-essential AI tools are $10-50/mo per seat. GitHub Copilot is $10/user/mo, Jasper starts at $39/mo, ChatGPT Plus is $20/mo. Combined, these typically replace $2-5k/mo in contractor costs at a fraction of the price.' }
    ]
  },
  'ecommerce-sellers': {
    title: 'Best AI Tools for Ecommerce Sellers',
    description: 'AI tools for product descriptions, ad copy, customer service automation, and ecommerce growth.',
    hero: 'Sell more with AI-powered product listings and marketing',
    categories: ['Marketing', 'Writing', 'Image'],
    limit: 10,
    affiliate: {
      name: 'EmailOctopus',
      url: 'https://emailoctopus.com/pricing?ref=matt&sub1=for-ecommerce',
      desc: 'Run powerful email marketing campaigns for your store at a fraction of Klaviyo\'s cost — automations, segmentation, abandoned cart flows, and beautiful templates included.',
      cta: 'Try EmailOctopus Free →'
    },
    faqs: [
      { q: 'What are the best AI tools for ecommerce in 2026?', a: 'Top picks include Jasper (product descriptions), Copy.ai (ad copy variations), Canva AI (product images and banners), and ChatGPT (customer service templates). These directly impact conversion rates and customer acquisition costs.' },
      { q: 'Can AI write ecommerce product descriptions that convert?', a: 'Yes — tools like Jasper and Copy.ai specialize in ecommerce copy. Provide your product specs, target audience, and tone, and get SEO-optimized descriptions in seconds. Most sellers report 15-30% higher conversion rates on AI-rewritten listings.' },
      { q: 'How can AI help improve my ecommerce sales?', a: 'AI improves ecommerce through better product copy (higher on-page conversion), personalized email campaigns (higher repeat purchase rate), AI-generated ad variations (better ROAS), and 24/7 customer service chatbots (lower support costs).' }
    ]
  },
  'remote-teams': {
    title: 'Best AI Tools for Remote Teams',
    description: 'AI collaboration, communication, and productivity tools that keep distributed teams aligned and productive.',
    hero: 'Keep your distributed team aligned and productive with AI',
    categories: ['Productivity', 'Writing'],
    limit: 10,
    affiliate: {
      name: 'Zaap',
      url: 'https://app.zaap.ai/create-url/?ref=matt&sub1=for-remote-teams',
      desc: 'The modern team knowledge hub — build a central home for your remote team\'s resources, links, and tools so everyone stays aligned without the Slack chaos.',
      cta: 'Try Zaap Free →'
    },
    faqs: [
      { q: 'What AI tools are best for remote teams?', a: 'Notion AI (knowledge management), Otter.ai (meeting transcription), ChatGPT (writing and research), and Loom AI (async video) are top picks for distributed teams. The highest-ROI tool is whatever eliminates your team\'s biggest async communication bottleneck.' },
      { q: 'How can AI improve remote team productivity?', a: 'AI tools reduce friction in remote work by automating meeting notes, generating status update drafts, summarizing long discussions, and making institutional knowledge instantly searchable — cutting the "where is that?" overhead that plagues distributed teams.' },
      { q: 'Are there affordable AI tools for small remote teams?', a: 'Yes — most AI tools are per-seat and very affordable for small teams. Notion AI at $10/user/mo and ChatGPT Plus at $20/person/mo both deliver excellent ROI even for 2-5 person remote teams.' }
    ]
  }
};
