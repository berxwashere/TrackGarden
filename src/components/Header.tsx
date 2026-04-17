interface HeaderProps {
  language: 'TR' | 'ENG';
  setLanguage: (lang: 'TR' | 'ENG') => void;
  heroText?: string;
  weatherHint?: string;
}

const Header = ({ language, setLanguage, heroText, weatherHint }: HeaderProps) => {
  return (
    <header className="mb-4 flex flex-col gap-4 rounded-3xl bg-white px-5 py-4 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <p className="text-base uppercase tracking-[0.35em] font-semibold text-emerald-600">TrackGarden</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Smart Garden Agenda</h1>
        </div>
        <div className="relative inline-flex items-center rounded-full bg-slate-100 p-1 sm:self-start">
          <button
            onClick={() => setLanguage('TR')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              language === 'TR'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            TR
          </button>
          <button
            onClick={() => setLanguage('ENG')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              language === 'ENG'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ENG
          </button>
        </div>
      </div>
      {heroText && weatherHint && (
        <div className="border-t border-slate-100 pt-4">
          <p className="text-slate-700">{heroText}</p>
          <p className="mt-1 text-sm text-slate-500">{weatherHint}</p>
        </div>
      )}
    </header>
  );
};

export default Header;
