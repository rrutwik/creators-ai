// Content for the public guide pages (/guides/<slug>). These pages are prerendered at build time and listed in
// the sitemap, so every page needs its own title, description and substantive text.
//
// Editorial rules for this file:
//  - Written in our own words. Facts (text structure, core teachings) are common reference knowledge.
//  - Never claim the AI *is* a deity, prophet or religious authority; every page says so plainly.
//  - Keep scripture references to well-known, checkable passages and paraphrase instead of quoting translations.
//  - English only for now (the app UI is translated, these pages are not). Review before changing facts.

export interface GuideFaq {
  q: string;
  a: string;
}

export interface GuidePageContent {
  /** URL segment: /guides/<slug> */
  slug: string;
  /** Matches the i18n key under landing.guides.* on the landing page */
  id: "dharmaGuide" | "divineCounselor" | "enlightenedTeacher" | "gurusVoice" | "alHakeem" | "torahScholar";
  name: string;
  tradition: string;
  avatar: string;
  /** <title>, kept under about 60 characters */
  title: string;
  /** meta description, kept under about 155 characters */
  description: string;
  h1: string;
  /** One-sentence summary shown under the heading */
  lead: string;
  /** Paragraphs about the tradition and its main text(s) */
  about: string[];
  topicsHeading: string;
  topics: string[];
  sampleQuestions: string[];
  faqs: GuideFaq[];
  /** ISO date of the last substantive edit; used for sitemap lastmod */
  updated: string;
}

export const AI_LIMITS_NOTE =
  "This is an AI guide inspired by the teachings of the tradition. It is not the figure it is named after, not a priest, " +
  "scholar or religious authority, and it can make mistakes. For important spiritual, ethical or personal decisions, " +
  "please speak with a trusted teacher or community leader.";

export const GUIDES: GuidePageContent[] = [
  {
    slug: "bhagavad-gita-krishna-guidance",
    id: "dharmaGuide",
    name: "Dharma Guide",
    tradition: "Hinduism",
    avatar: "🙏",
    title: "Bhagavad Gita AI Guide: Ask About Krishna's Teachings",
    description:
      "Chat with an AI guide inspired by the Bhagavad Gita. Explore karma yoga, bhakti, dharma and finding calm in difficult decisions. Free credits to start.",
    h1: "Bhagavad Gita AI guide for everyday questions",
    lead: "Talk through work, duty, doubt and stress using the ideas of the Bhagavad Gita and the teachings of Krishna.",
    about: [
      "The Bhagavad Gita is a scripture of about 700 verses in 18 chapters, set inside the epic Mahabharata. It records a conversation on the battlefield of Kurukshetra between the warrior Arjuna, who is overwhelmed by grief and doubt before a war, and Krishna, who serves as his charioteer and guide.",
      "Its best-known idea is selfless action, often called karma yoga: do what is yours to do with full effort, without being ruled by anxiety about the result. The text also describes the path of devotion (bhakti yoga) and the path of knowledge (jnana yoga), and many readers see these as overlapping ways of living rather than separate boxes.",
      "The Dharma Guide uses these themes to help you reflect. It can explain a concept, help you see how an idea applies to a decision you are facing, or point you to the part of the text that deals with your question.",
    ],
    topicsHeading: "What you can ask the Dharma Guide",
    topics: [
      "What the Gita means by dharma, duty and acting without attachment to results",
      "How to handle stress, fear of failure or a hard career decision",
      "The difference between karma yoga, bhakti yoga and jnana yoga",
      "Who Arjuna and Krishna are, and what happens in each part of the conversation",
      "How to build a calmer daily routine of reflection",
    ],
    sampleQuestions: [
      "How can I work hard without being consumed by worry about the outcome?",
      "What does the Gita say about doing my duty when it feels unfair?",
      "Can you explain karma yoga in simple words?",
    ],
    faqs: [
      {
        q: "Is the Dharma Guide really Krishna?",
        a: "No. It is an AI that draws on the Bhagavad Gita and related teachings to give thoughtful, gentle answers. It does not speak with divine authority and should not replace a teacher or your own reading of the text.",
      },
      {
        q: "Which translation of the Gita does it follow?",
        a: "It explains the ideas in plain language rather than quoting one translation. Translations and commentaries differ, so if a verse matters to you, compare it in a translation you trust.",
      },
      {
        q: "Can I ask personal questions, not just about the text?",
        a: "Yes. Many people ask about work, relationships and stress. The guide answers by connecting those situations to the Gita's themes, but it is not a substitute for professional medical or mental-health support.",
      },
    ],
    updated: "2026-11-03",
  },
  {
    slug: "bible-jesus-guidance",
    id: "divineCounselor",
    name: "Divine Counselor",
    tradition: "Christianity",
    avatar: "✝️",
    title: "Bible & Jesus AI Guide: Christian Guidance Chat",
    description:
      "Chat with an AI guide inspired by the Bible and the teachings of Jesus. Reflect on forgiveness, faith, hope and the Sermon on the Mount. Free credits.",
    h1: "Bible AI guide: reflect on the teachings of Jesus",
    lead: "Ask about forgiveness, faith, hardship and love, drawing on the Bible and the teachings of Jesus Christ.",
    about: [
      "The Christian Bible is made up of the Old Testament and the New Testament. The Gospels, which tell of the life and teaching of Jesus, are at the heart of the New Testament, and many readers start with the Sermon on the Mount in Matthew chapters 5 to 7.",
      "That sermon opens with the Beatitudes (Matthew 5:3-12), a series of blessings for people who are humble, merciful, peacemaking or hungry for justice. It goes on to the images of salt and light (Matthew 5:13-16), teachings on anger, honesty and loving even those who oppose you, the Lord's Prayer (Matthew 6:9-13), and the call to treat others as you would want to be treated (Matthew 7:12).",
      "The Divine Counselor uses these passages and the wider themes of grace, forgiveness and hope as a starting point for reflection. It can explain what a passage means in its context, suggest related passages, and help you think about how a teaching might apply to something in your life.",
    ],
    topicsHeading: "What you can ask the Divine Counselor",
    topics: [
      "The meaning of the Beatitudes and the Sermon on the Mount",
      "Forgiveness: how to forgive, and what to do when it feels impossible",
      "Faith and doubt, and what the Gospels say about both",
      "Finding comfort in grief, illness or a season of change",
      "Background on Bible stories, parables and well-known verses",
    ],
    sampleQuestions: [
      "What did Jesus mean by 'blessed are the peacemakers'?",
      "How do I forgive someone who has hurt me deeply?",
      "Which parts of the Bible speak about hope in hard times?",
    ],
    faqs: [
      {
        q: "Is the Divine Counselor a pastor or priest?",
        a: "No. It is an AI built to reflect Christian teaching in a gentle, encouraging tone. It cannot offer pastoral care, counselling or sacraments, so please talk with a pastor or someone in your community about serious matters.",
      },
      {
        q: "Does it follow a particular denomination?",
        a: "It aims to stay with widely shared Christian teaching and the Bible itself. Traditions differ on many questions, so it may describe more than one view and suggest you speak with your own church.",
      },
      {
        q: "Can it quote Bible verses?",
        a: "It can point to well-known passages and explain them. Wording differs between translations, so check any verse that matters to you in the Bible you use.",
      },
    ],
    updated: "2026-11-03",
  },
  {
    slug: "buddha-mindfulness-guidance",
    id: "enlightenedTeacher",
    name: "Enlightened Teacher",
    tradition: "Buddhism",
    avatar: "🧘",
    title: "Buddha AI Guide: Mindfulness & Buddhist Teachings",
    description:
      "Chat with an AI guide inspired by Buddhist teachings. Learn the Four Noble Truths, the Eightfold Path, mindfulness and the Middle Way. Free credits.",
    h1: "Buddhist AI guide for mindfulness and inner peace",
    lead: "Explore the teachings attributed to Gautama Buddha on suffering, mindfulness and a balanced way of living.",
    about: [
      "Buddhism grew from the teachings of Siddhartha Gautama, known as the Buddha, who taught a path out of suffering. At its core are the Four Noble Truths: that life involves dissatisfaction or suffering (dukkha), that it arises from craving and clinging, that it can end, and that there is a path to that ending.",
      "That path is the Noble Eightfold Path: right view, right intention, right speech, right action, right livelihood, right effort, right mindfulness and right concentration. These are often grouped into ethical conduct, mental training and wisdom, and they are practised together rather than one after another.",
      "The Buddha also described the Middle Way, which avoids both indulgence in pleasure and harsh self-denial. The Enlightened Teacher draws on these ideas to help you reflect on stress, attachment, impermanence and everyday mindfulness, in language that does not assume any background.",
    ],
    topicsHeading: "What you can ask the Enlightened Teacher",
    topics: [
      "The Four Noble Truths explained in everyday terms",
      "Each step of the Eightfold Path and how it looks in daily life",
      "Simple mindfulness and breathing practices to start with",
      "Dealing with anxiety, anger, craving and attachment",
      "The Middle Way and finding balance",
    ],
    sampleQuestions: [
      "What does the Buddha mean when he says life involves suffering?",
      "How do I start a simple mindfulness practice?",
      "What is 'right speech' and how can I practise it at work?",
    ],
    faqs: [
      {
        q: "Is this the Buddha speaking?",
        a: "No. It is an AI guide inspired by Buddhist teachings. It is not the Buddha, a monk or a teacher, and it cannot guide meditation retreats or give formal teachings.",
      },
      {
        q: "Does it follow Theravada, Mahayana or Zen?",
        a: "It focuses on teachings shared across Buddhist traditions, such as the Four Noble Truths and the Eightfold Path. Schools differ in practice and emphasis, so a teacher in your own tradition is the best guide for deeper study.",
      },
      {
        q: "Can it help with anxiety or stress?",
        a: "It can suggest mindfulness ideas and help you reflect, which many people find calming. It is not a replacement for professional mental-health care.",
      },
    ],
    updated: "2026-11-03",
  },
  {
    slug: "sikhism-guru-granth-sahib-guidance",
    id: "gurusVoice",
    name: "Guru's Voice",
    tradition: "Sikhism",
    avatar: "ੴ",
    title: "Sikhism AI Guide: Teachings of the Gurus & Seva",
    description:
      "Chat with an AI guide inspired by Sikh teachings. Learn about Ik Onkar, the Guru Granth Sahib, naam japna, kirat karni, vand chakna and seva. Free credits.",
    h1: "Sikhism AI guide: one creator, honest work, service",
    lead: "Reflect on the teachings of the Sikh Gurus on one God, equality, selfless service and a life of honest work.",
    about: [
      "Sikhism is a monotheistic faith that began in Punjab in the 15th century with Guru Nanak. Its central statement is Ik Onkar, often understood as 'there is one creator'. The Guru Granth Sahib, the Sikh scripture, is treated as the living Guru and opens with the Mool Mantar, which begins with Ik Onkar.",
      "Daily life in Sikh teaching is often summarised by three practices: naam japna (remembering God and meditating on the Name), kirat karni (earning an honest living) and vand chakna (sharing with others). Seva, or selfless service, is closely tied to all three, and the langar, the community kitchen open to everyone, is one of its best-known expressions.",
      "The Guru's Voice guide uses these ideas as a starting point. It can explain terms you meet in the gurdwara or in reading, talk through how the teachings apply to work and family, and help you reflect on service and equality.",
    ],
    topicsHeading: "What you can ask the Guru's Voice",
    topics: [
      "What Ik Onkar and the Mool Mantar mean",
      "Naam japna, kirat karni and vand chakna in modern life",
      "Seva and langar: why service and equality matter",
      "Basics of the Guru Granth Sahib and how it is used",
      "Honest living, humility and facing ego",
    ],
    sampleQuestions: [
      "What does 'Ik Onkar' mean?",
      "How can I practise kirat karni in a stressful job?",
      "Why is langar open to everyone?",
    ],
    faqs: [
      {
        q: "Is this a Sikh Guru or granthi?",
        a: "No. It is an AI guide inspired by Sikh teachings and cannot speak for the Gurus or replace a granthi or your sangat. It may make mistakes, so please check important points with a knowledgeable Sikh teacher.",
      },
      {
        q: "Does it quote the Guru Granth Sahib?",
        a: "It explains ideas in plain language and may refer to well-known themes. Gurbani is meant to be read and treated with respect in its original form, so use a trusted source for the text itself.",
      },
      {
        q: "Can non-Sikhs use it?",
        a: "Yes. It is meant for anyone curious about Sikh teachings as well as Sikhs who want a simple way to reflect.",
      },
    ],
    updated: "2026-11-03",
  },
  {
    slug: "islam-quran-spiritual-guidance",
    id: "alHakeem",
    name: "Al-Hakeem",
    tradition: "Islam",
    avatar: "🌙",
    title: "Islam AI Guide: Quran, Five Pillars & Reflection",
    description:
      "Chat with an AI guide inspired by Islamic teachings. Learn about the Quran, the Five Pillars, patience, gratitude and moral guidance. Free credits.",
    h1: "Islamic AI guide for reflection and everyday questions",
    lead: "Explore the Quran, the Five Pillars and Islamic ideas of patience, gratitude and good character.",
    about: [
      "Islamic teaching is rooted in the Quran, which Muslims believe to be the word of God, and in the Hadith, the recorded sayings and actions of the Prophet Muhammad. Islam centres on the oneness of God (tawhid).",
      "The Five Pillars are the core acts of worship: Shahada (the declaration of faith), Salah (prayer five times a day), Zakat (charitable giving), Sawm (fasting in Ramadan) and Hajj (pilgrimage to Mecca for those who are able). Beyond these, many Muslims also speak of the articles of faith, which include belief in God, angels, scriptures, prophets, the Day of Judgement and divine decree.",
      "Al-Hakeem draws on these themes to help you reflect on patience (sabr), gratitude (shukr) and good character. It can explain terms and practices in plain language. It does not issue religious rulings (fatwas), and questions of Islamic law should go to a qualified scholar.",
    ],
    topicsHeading: "What you can ask Al-Hakeem",
    topics: [
      "The Five Pillars of Islam and what each involves",
      "The Quran and the Hadith: what they are and how they are used",
      "Patience, gratitude and trust in hard times",
      "Ramadan, fasting and prayer: the meaning behind the practice",
      "Good character and ethics in daily life",
    ],
    sampleQuestions: [
      "What are the Five Pillars of Islam?",
      "How can I stay patient when things keep going wrong?",
      "What is the purpose of fasting in Ramadan?",
    ],
    faqs: [
      {
        q: "Can Al-Hakeem give religious rulings?",
        a: "No. It is an AI guide, not a scholar or imam, and it does not issue fatwas. For questions of Islamic law or personal religious obligations, please ask a qualified scholar or your local imam.",
      },
      {
        q: "Does it follow a school of thought?",
        a: "It sticks to broadly shared teachings and says so when views differ between Sunni, Shia and other communities. Practices vary, so check details with someone from your own tradition.",
      },
      {
        q: "Can I use it to learn about Islam if I am not Muslim?",
        a: "Yes. It is designed to explain beliefs and practices respectfully for anyone who is curious.",
      },
    ],
    updated: "2026-11-03",
  },
  {
    slug: "torah-judaism-guidance",
    id: "torahScholar",
    name: "Torah Scholar",
    tradition: "Judaism",
    avatar: "✡️",
    title: "Torah AI Guide: Jewish Teachings & Wisdom",
    description:
      "Chat with an AI guide inspired by Jewish teachings. Explore the Torah, the Tanakh, the Talmud, mitzvot, Shabbat and Jewish ethics. Free credits to start.",
    h1: "Torah AI guide: explore Jewish texts and teachings",
    lead: "Ask about the Torah, the wider Tanakh, the Talmud and how Jewish tradition approaches ethics and daily life.",
    about: [
      "The Torah is the five books of Moses: Genesis, Exodus, Leviticus, Numbers and Deuteronomy. It is the first part of the Tanakh, the Hebrew Bible, which has 24 books in three parts: the Torah, the Nevi'im (the Prophets) and the Ketuvim (the Writings).",
      "Alongside the written Torah, Jewish tradition holds an oral tradition that was later written down in the Mishnah and the Talmud, which record centuries of discussion and debate about law, ethics and interpretation. Traditionally, Jewish law is understood to contain 613 mitzvot (commandments), and practice such as prayer, Shabbat and festivals shapes the rhythm of Jewish life.",
      "The Torah Scholar guide uses these texts and ideas as a starting point. It can explain a weekly portion's themes, introduce key terms, and help you think through ethical questions the way Jewish tradition often does: by looking at the text and the questions it raises, not just a quick answer.",
    ],
    topicsHeading: "What you can ask the Torah Scholar",
    topics: [
      "What the Torah, Tanakh, Mishnah and Talmud are, and how they relate",
      "Themes in the stories of Genesis and Exodus",
      "Shabbat, the festivals and why they matter",
      "Jewish ideas about ethics, justice and kindness",
      "Key Hebrew terms, explained simply",
    ],
    sampleQuestions: [
      "What is the difference between the Torah and the Talmud?",
      "Why is Shabbat so important in Jewish life?",
      "How does Jewish tradition think about asking questions and debating?",
    ],
    faqs: [
      {
        q: "Is the Torah Scholar a rabbi?",
        a: "No. It is an AI guide inspired by Jewish teaching. It cannot rule on halakha (Jewish law) or give a rabbi's counsel, so for religious questions about practice, please ask a rabbi.",
      },
      {
        q: "Which Jewish movement does it follow?",
        a: "It aims to describe widely shared texts and ideas and to note when Orthodox, Conservative, Reform and other communities differ. Check details with someone from your own community.",
      },
      {
        q: "Can non-Jewish people use it?",
        a: "Yes. It is made for anyone who wants to learn about Jewish texts and teachings with respect.",
      },
    ],
    updated: "2026-11-03",
  },
];

export const getGuideBySlug = (slug: string | undefined) => GUIDES.find((g) => g.slug === slug);
export const getGuideById = (id: string) => GUIDES.find((g) => g.id === id);
