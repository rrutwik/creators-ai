import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sun,
  Moon,
  MessageSquare,
  Check,
  HelpCircle,
  Sparkles,
  Lock,
  Smartphone,
  BookOpen,
  Globe,
  ArrowRight,
  Menu,
  X
} from "lucide-react";
import { useSEO } from "../../components/hooks/useSEO";
import type { THEME_MODES } from "../../utils/consts";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_TITLE,
  buildLandingSchema,
} from "../../utils/seo";

interface LandingPageProps {
  user: any;
  onLogout: () => void;
  theme: THEME_MODES;
  setTheme: (theme: THEME_MODES) => void;
}

export function LandingPage({ user, theme, setTheme }: LandingPageProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Featured Guides with Custom Theme/Visual Gradient
  const featuredGuides = [
    {
      id: "dharmaGuide",
      name: t("landing.guides.dharmaGuide"),
      desc: t("landing.guides.dharmaGuideDesc"),
      avatar: "🙏",
      bgGradient: "from-amber-500/20 to-orange-500/20 border-orange-500/30",
      badgeColor: "bg-orange-500/10 text-orange-500 border-orange-500/20"
    },
    {
      id: "divineCounselor",
      name: t("landing.guides.divineCounselor"),
      desc: t("landing.guides.divineCounselorDesc"),
      avatar: "✝️",
      bgGradient: "from-yellow-500/20 to-emerald-500/20 border-yellow-500/30",
      badgeColor: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20"
    },
    {
      id: "enlightenedTeacher",
      name: t("landing.guides.enlightenedTeacher"),
      desc: t("landing.guides.enlightenedTeacherDesc"),
      avatar: "🧘",
      bgGradient: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
      badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    },
    {
      id: "gurusVoice",
      name: t("landing.guides.gurusVoice"),
      desc: t("landing.guides.gurusVoiceDesc"),
      avatar: "ੴ",
      bgGradient: "from-orange-500/20 to-yellow-500/20 border-orange-500/30",
      badgeColor: "bg-orange-500/10 text-orange-600 dark:text-orange-500 border-orange-500/20"
    },
    {
      id: "alHakeem",
      name: t("landing.guides.alHakeem"),
      desc: t("landing.guides.alHakeemDesc"),
      avatar: "🌙",
      bgGradient: "from-purple-500/20 to-indigo-500/20 border-purple-500/30",
      badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
    },
    {
      id: "torahScholar",
      name: t("landing.guides.torahScholar"),
      desc: t("landing.guides.torahScholarDesc"),
      avatar: "✡️",
      bgGradient: "from-blue-500/20 to-sky-500/20 border-blue-500/30",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
    }
  ];

  const faqs = [
    {
      q: t("landing.faq.q1"),
      a: t("landing.faq.a1")
    },
    {
      q: t("landing.faq.q2"),
      a: t("landing.faq.a2")
    },
    {
      q: t("landing.faq.q3"),
      a: t("landing.faq.a3")
    },
    {
      q: t("landing.faq.q4"),
      a: t("landing.faq.a4")
    }
  ];

  // Structured data. There is deliberately no aggregateRating: we have no real review data to back it.
  useSEO({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    keywords: DEFAULT_KEYWORDS,
    path: "/",
    schema: buildLandingSchema(faqs),
  });

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navigateToApp = () => {
    if (user) {
      navigate("/chat");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans relative overflow-x-hidden">
      {/* Dynamic Ambient Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-60"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none opacity-50"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[45%] h-[45%] bg-primary/5 rounded-full blur-[110px] pointer-events-none opacity-40"></div>

      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <span className="text-2xl">🙏</span>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-muted-foreground bg-clip-text text-transparent">
              CreatorsAI
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary/80 transition-colors text-muted-foreground">
              {t("landing.nav.features")}
            </a>
            <a href="#guides" className="text-sm font-medium hover:text-primary/80 transition-colors text-muted-foreground">
              {t("landing.nav.guides")}
            </a>
            <a href="#free-credits" className="text-sm font-medium hover:text-primary/80 transition-colors text-muted-foreground">
              {t("landing.nav.freeCredits")}
            </a>
            <a href="#faq" className="text-sm font-medium hover:text-primary/80 transition-colors text-muted-foreground">
              {t("landing.nav.faq")}
            </a>
          </nav>

          {/* Header Controls (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Dropdown Selector */}
            <div className="flex items-center gap-1 border border-border/60 rounded-md px-2 py-1 bg-card/50">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <select
                aria-label="Language Selector"
                id="language-select-desktop"
                value={i18n.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="text-xs bg-transparent border-none outline-none cursor-pointer pr-1 py-0.5 text-foreground font-medium"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="gu">ગુજરાતી</option>
                <option value="mr">मराठी</option>
              </select>
            </div>

            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-desktop"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 border border-border/60 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* CTA Button */}
            <button
              id="cta-nav-desktop"
              onClick={navigateToApp}
              className="px-4 py-2 text-sm font-semibold rounded-md shadow-sm bg-primary text-primary-foreground hover:bg-primary/95 transition-all cursor-pointer border border-primary/20"
            >
              {user ? t("landing.nav.goToChat") : t("landing.nav.login")}
            </button>
          </div>

          {/* Hamburger Menu Icon (Mobile) */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="theme-toggle-mobile-quick"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              id="hamburger-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border/60 bg-background/95 backdrop-blur-md transition-all animate-in slide-in-from-top duration-200">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <nav className="flex flex-col gap-3 font-medium">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 text-muted-foreground hover:text-foreground"
                >
                  {t("landing.nav.features")}
                </a>
                <a
                  href="#guides"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 text-muted-foreground hover:text-foreground"
                >
                  {t("landing.nav.guides")}
                </a>
                <a
                  href="#free-credits"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 text-muted-foreground hover:text-foreground"
                >
                  {t("landing.nav.freeCredits")}
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 text-muted-foreground hover:text-foreground"
                >
                  {t("landing.nav.faq")}
                </a>
              </nav>

              <hr className="border-border/60" />

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* Language Select */}
                <div className="flex items-center justify-between gap-2 border border-border/60 rounded-md px-3 py-2 bg-card/50">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" /> Language
                  </span>
                  <select
                    aria-label="Language Selector"
                    id="language-select-mobile"
                    value={i18n.language}
                    onChange={(e) => {
                      handleLanguageChange(e.target.value);
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs bg-transparent border-none outline-none font-semibold cursor-pointer text-foreground"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी</option>
                    <option value="gu">ગુજરાતી</option>
                    <option value="mr">मराठी</option>
                  </select>
                </div>

                {/* Primary CTA */}
                <button
                  id="cta-nav-mobile"
                  onClick={() => {
                    navigateToApp();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-4 rounded-md text-sm font-semibold text-center bg-primary text-primary-foreground hover:bg-primary/95 transition-all cursor-pointer"
                >
                  {user ? t("landing.nav.goToChat") : t("landing.nav.getStarted")}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 border border-primary/10 rounded-full px-4 py-1.5 bg-primary/5 text-xs font-semibold text-primary mb-6 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Powered Spiritual Wisdom</span>
          </div>

          {/* Heading H1 (Single H1 on page for SEO) */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-balance">
            {t("landing.hero.title")}
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed text-balance">
            {t("landing.hero.subtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              id="hero-cta-start"
              onClick={navigateToApp}
              className="w-full sm:w-auto px-8 py-4 rounded-md text-base font-bold shadow-md hover:shadow-lg transition-all bg-primary text-primary-foreground hover:bg-primary/95 border border-primary/20 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{t("landing.hero.cta")}</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              id="hero-cta-guides"
              href="#guides"
              className="w-full sm:w-auto px-8 py-4 rounded-md text-base font-semibold border border-border/80 hover:bg-muted/50 transition-colors flex items-center justify-center"
            >
              {t("landing.hero.subcta")}
            </a>
          </div>

          {/* Trust stats */}
          <div className="grid grid-cols-3 gap-4 border border-border/40 rounded-xl px-4 py-6 bg-card/30 backdrop-blur-sm max-w-xl mx-auto text-center divide-x divide-border/40 shadow-sm">
            <div>
              <p className="text-xl md:text-2xl font-black text-primary">100k+</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">{t("landing.hero.stats.messages")}</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-black text-primary">50+</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">{t("landing.hero.stats.guides")}</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-black text-primary">4</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">{t("landing.hero.stats.languages")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CHAT INTERFACE MOCKUP SECTION */}
      <section className="py-8 bg-muted/20 border-y border-border/40 relative">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="relative border border-border/80 rounded-2xl overflow-hidden shadow-2xl bg-card transition-all hover:border-primary/20">
            {/* Header Mockup */}
            <div className="border-b border-border/60 px-4 py-3 bg-muted/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                <span className="h-3 w-3 rounded-full bg-green-400"></span>
                <span className="text-xs font-semibold text-muted-foreground ml-2">CreatorsAI Console</span>
              </div>
              <div className="h-4 w-28 bg-border/40 rounded"></div>
            </div>

            {/* Chat Mockup Body */}
            <div className="grid grid-cols-1 md:grid-cols-4 h-[350px] md:h-[450px]">
              {/* Sidebar Mockup */}
              <div className="hidden md:block border-r border-border/60 bg-muted/20 p-4 space-y-4">
                <div className="h-8 bg-border/50 rounded-md"></div>
                <div className="space-y-2">
                  <div className="h-10 bg-primary/5 border border-primary/10 rounded-md flex items-center px-2 gap-2">
                    <span className="text-base">🙏</span>
                    <div className="h-3 w-20 bg-primary/20 rounded"></div>
                  </div>
                  <div className="h-10 bg-border/20 rounded-md flex items-center px-2 gap-2">
                    <span className="text-base">🧘</span>
                    <div className="h-3 w-20 bg-border/30 rounded"></div>
                  </div>
                  <div className="h-10 bg-border/20 rounded-md flex items-center px-2 gap-2">
                    <span className="text-base">✝️</span>
                    <div className="h-3 w-20 bg-border/30 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Chat Message Window Mockup */}
              <div className="md:col-span-3 flex flex-col justify-between p-4 bg-background">
                <div className="space-y-4 overflow-y-auto">
                  {/* Guide Message */}
                  <div className="flex items-start gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-sm shrink-0">
                      🙏
                    </div>
                    <div className="border border-border/40 rounded-2xl rounded-tl-none px-4 py-3 bg-card text-sm shadow-sm leading-relaxed">
                      Greetings. I am here to share the wisdom of the Bhagavad Gita with you. What guidance or clarity do you seek today in your journey of karma and duty?
                    </div>
                  </div>

                  {/* User Message */}
                  <div className="flex items-start gap-3 max-w-[85%] ml-auto justify-end">
                    <div className="border border-primary/10 rounded-2xl rounded-tr-none px-4 py-3 bg-primary text-primary-foreground text-sm shadow-sm leading-relaxed">
                      How do I find peace of mind when everything around me feels so chaotic and stressful?
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs shrink-0 text-primary-foreground">
                      👤
                    </div>
                  </div>

                  {/* Guide Response */}
                  <div className="flex items-start gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-sm shrink-0">
                      🙏
                    </div>
                    <div className="border border-border/40 rounded-2xl rounded-tl-none px-4 py-3 bg-card text-sm shadow-sm leading-relaxed">
                      The Gita teaches us: <span className="font-semibold text-primary">"Perform your duty, but do not seek the fruits of your actions."</span> True peace arises when you surrender control of external outcomes and anchor yourself in your pure effort and present awareness.
                    </div>
                  </div>
                </div>

                {/* Input Bar Mockup */}
                <div className="border border-border/80 rounded-xl px-4 py-2 flex items-center justify-between bg-muted/10 mt-4 gap-2">
                  <span className="text-xs text-muted-foreground">Ask Lord Krishna for spiritual guidance...</span>
                  <button className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 md:py-28 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-balance">
              {t("landing.features.title")}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              {t("landing.features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="border border-border/50 hover:border-primary/20 rounded-2xl p-6 bg-card/40 backdrop-blur-sm transition-all hover:-translate-y-1 shadow-sm flex flex-col h-full">
              <div className="w-12 h-12 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-center mb-5 text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t("landing.features.f1.title")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mt-auto">{t("landing.features.f1.desc")}</p>
            </div>

            {/* Feature 2 */}
            <div className="border border-border/50 hover:border-primary/20 rounded-2xl p-6 bg-card/40 backdrop-blur-sm transition-all hover:-translate-y-1 shadow-sm flex flex-col h-full">
              <div className="w-12 h-12 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-center mb-5 text-primary">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t("landing.features.f2.title")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mt-auto">{t("landing.features.f2.desc")}</p>
            </div>

            {/* Feature 3 */}
            <div className="border border-border/50 hover:border-primary/20 rounded-2xl p-6 bg-card/40 backdrop-blur-sm transition-all hover:-translate-y-1 shadow-sm flex flex-col h-full">
              <div className="w-12 h-12 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-center mb-5 text-primary">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t("landing.features.f3.title")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mt-auto">{t("landing.features.f3.desc")}</p>
            </div>

            {/* Feature 4 */}
            <div className="border border-border/50 hover:border-primary/20 rounded-2xl p-6 bg-card/40 backdrop-blur-sm transition-all hover:-translate-y-1 shadow-sm flex flex-col h-full">
              <div className="w-12 h-12 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-center mb-5 text-primary">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t("landing.features.f4.title")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mt-auto">{t("landing.features.f4.desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* GUIDES showcase SECTION */}
      <section id="guides" className="py-20 md:py-28 bg-muted/20 border-y border-border/40 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-balance">
              {t("landing.guides.title")}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              {t("landing.guides.subtitle")}
            </p>
          </div>

          {/* Interactive Guides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {featuredGuides.map((guide) => (
              <div
                key={guide.id}
                className={`border rounded-2xl p-6 bg-gradient-to-b ${guide.bgGradient} backdrop-blur-sm transition-all hover:scale-[1.02] shadow-md flex flex-col h-full`}
              >
                {/* Guide Meta Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-background/90 border border-border/60 flex items-center justify-center text-2xl shadow-sm">
                    {guide.avatar}
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${guide.badgeColor}`}>
                    AI Deity
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-2 text-primary">{guide.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">{guide.desc}</p>

                <button
                  id={`chat-guide-${guide.id}`}
                  onClick={navigateToApp}
                  className="w-full py-2.5 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/95 transition-all flex items-center justify-center gap-2 border border-primary/20 cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{t("landing.guides.cta", { name: guide.name })}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 md:py-28 relative">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-balance">
              {t("landing.howItWorks.title")}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              {t("landing.howItWorks.subtitle")}
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Visual connector lines */}
            <div className="absolute top-[25%] left-[20%] right-[20%] h-0.5 border-t border-dashed border-border/80 hidden md:block z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-black text-lg flex items-center justify-center mb-4 shadow-md border border-primary/20">
                1
              </div>
              <h3 className="text-lg font-bold mb-2">{t("landing.howItWorks.s1Title")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{t("landing.howItWorks.s1Desc")}</p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-black text-lg flex items-center justify-center mb-4 shadow-md border border-primary/20">
                2
              </div>
              <h3 className="text-lg font-bold mb-2">{t("landing.howItWorks.s2Title")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{t("landing.howItWorks.s2Desc")}</p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-black text-lg flex items-center justify-center mb-4 shadow-md border border-primary/20">
                3
              </div>
              <h3 className="text-lg font-bold mb-2">{t("landing.howItWorks.s3Title")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{t("landing.howItWorks.s3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FREE MESSAGES / CREDITS SECTION */}
      <section id="free-credits" className="py-20 md:py-28 bg-muted/20 border-y border-border/40 relative">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <div className="max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-balance">
              {t("landing.freeCredits.title")}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              {t("landing.freeCredits.subtitle")}
            </p>
          </div>

          <div className="border border-border/60 rounded-2xl p-8 md:p-12 bg-card max-w-2xl mx-auto shadow-sm transition-all hover:border-primary/20">
            <div className="w-16 h-16 bg-primary/5 rounded-full border border-primary/10 flex items-center justify-center mb-6 mx-auto text-primary animate-pulse">
              <Sparkles className="h-8 w-8" />
            </div>
            
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-6">
              {t("landing.freeCredits.desc1")}
            </p>
            <p className="text-sm md:text-base leading-relaxed text-muted-foreground font-semibold text-primary">
              {t("landing.freeCredits.desc2")}
            </p>

            <button
              id="free-credits-cta"
              onClick={navigateToApp}
              className="mt-8 px-8 py-4 rounded-md text-base font-bold shadow-md hover:shadow-lg transition-all bg-primary text-primary-foreground hover:bg-primary/95 border border-primary/20 cursor-pointer inline-flex items-center gap-2 group"
            >
              <span>{t("landing.ctaSection.button")}</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 md:py-28 relative">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-balance">
              {t("landing.testimonials.title")}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              {t("landing.testimonials.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* T1 */}
            <div className="border border-border/50 rounded-2xl p-6 bg-card/30 backdrop-blur-sm flex flex-col justify-between shadow-sm">
              <p className="text-sm italic leading-relaxed text-muted-foreground mb-6">
                "{t("landing.testimonials.t1Text")}"
              </p>
              <div>
                <p className="font-bold text-sm text-primary">{t("landing.testimonials.t1Author")}</p>
                <p className="text-xs text-muted-foreground">{t("landing.testimonials.t1Role")}</p>
              </div>
            </div>

            {/* T2 */}
            <div className="border border-border/50 rounded-2xl p-6 bg-card/30 backdrop-blur-sm flex flex-col justify-between shadow-sm">
              <p className="text-sm italic leading-relaxed text-muted-foreground mb-6">
                "{t("landing.testimonials.t2Text")}"
              </p>
              <div>
                <p className="font-bold text-sm text-primary">{t("landing.testimonials.t2Author")}</p>
                <p className="text-xs text-muted-foreground">{t("landing.testimonials.t2Role")}</p>
              </div>
            </div>

            {/* T3 */}
            <div className="border border-border/50 rounded-2xl p-6 bg-card/30 backdrop-blur-sm flex flex-col justify-between shadow-sm">
              <p className="text-sm italic leading-relaxed text-muted-foreground mb-6">
                "{t("landing.testimonials.t3Text")}"
              </p>
              <div>
                <p className="font-bold text-sm text-primary">{t("landing.testimonials.t3Author")}</p>
                <p className="text-xs text-muted-foreground">{t("landing.testimonials.t3Role")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION (Accordion) */}
      <section id="faq" className="py-20 md:py-28 bg-muted/20 border-t border-border/40 relative">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-balance">
              {t("landing.faq.title")}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="border border-border/60 rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm transition-all"
                >
                  <button
                    id={`faq-btn-${index}`}
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="w-full px-6 py-4 flex items-center justify-between font-bold text-left text-sm md:text-base hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <HelpCircle className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {/* Always in the DOM (just hidden when closed) so the answers are indexable. */}
                  <div
                    role="region"
                    aria-labelledby={`faq-btn-${index}`}
                    hidden={!isOpen}
                    className="px-6 pb-5 pt-1 text-sm text-muted-foreground border-t border-border/40 bg-card/30 leading-relaxed"
                  >
                    {faq.a}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="py-20 md:py-28 border-t border-border/40 relative bg-gradient-to-b from-transparent to-primary/5">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-balance">
            {t("landing.ctaSection.title")}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-xl mx-auto text-balance">
            {t("landing.ctaSection.desc")}
          </p>
          <button
            id="bottom-cta-btn"
            onClick={navigateToApp}
            className="px-8 py-4 text-base font-bold shadow-md hover:shadow-lg rounded-md bg-primary text-primary-foreground hover:bg-primary/95 transition-all border border-primary/20 inline-flex items-center gap-2 group cursor-pointer"
          >
            <span>{t("landing.ctaSection.button")}</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/40 py-12 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg">🙏</span>
            <span className="font-extrabold text-base tracking-tight text-primary">CreatorsAI</span>
          </div>

          <p className="text-xs text-muted-foreground order-last md:order-none">
            &copy; {new Date().getFullYear()} CreatorsAI. All rights reserved. Made with devotions.
          </p>

          <div className="flex items-center gap-6 text-xs text-muted-foreground font-semibold">
            <a href="#features" className="hover:text-primary transition-colors">
              {t("landing.nav.features")}
            </a>
            <a href="#guides" className="hover:text-primary transition-colors">
              {t("landing.nav.guides")}
            </a>
            <a href="#free-credits" className="hover:text-primary transition-colors">
              {t("landing.nav.freeCredits")}
            </a>
            <a href="#faq" className="hover:text-primary transition-colors">
              {t("landing.nav.faq")}
            </a>
            <a href="https://techkarmic.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              {t("landing.footer.privacy", { defaultValue: "Privacy Policy" })}
            </a>
            <a href="https://techkarmic.com/terms" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              {t("landing.footer.terms", { defaultValue: "Terms" })}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
