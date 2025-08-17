import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'mr', label: 'मराठी' }
];
interface LanguageSwitcherProps {
  language: string;
  onChange: (language: string) => void;
}

export function LanguageSwitcher({ language, onChange }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  return (
    <select
      aria-label="Change language"
      className="fixed top-4 right-28 z-50 border bg-card text-card-foreground px-2 py-2 text-sm rounded-md shadow-sm"
      value={i18n.language}
      onChange={(e) => {
        i18n.changeLanguage(e.target.value)
        onChange(e.target.value)
      }}
    >
      {languages.map(l => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
}
