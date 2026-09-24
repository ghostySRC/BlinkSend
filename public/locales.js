(() => {
  const names = {
    en: 'English',
    sv: 'Svenska',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    pt: 'Português',
    zh: '简体中文',
    ja: '日本語',
    ar: 'العربية'
  };

  const titles = {
    en: 'BlinkSend — File transfer',
    sv: 'BlinkSend — Filöverföring',
    es: 'BlinkSend — Transferencia de archivos',
    fr: 'BlinkSend — Transfert de fichiers',
    de: 'BlinkSend — Dateiübertragung',
    pt: 'BlinkSend — Transferência de arquivos',
    zh: 'BlinkSend — 文件传输',
    ja: 'BlinkSend — ファイル転送',
    ar: 'BlinkSend — نقل الملفات'
  };

  const supported = new Set(Object.keys(names));
  const normalize = value => String(value || '').trim().replace(/_/g, '-').toLowerCase();

  function resolve(preferred = []) {
    const list = Array.isArray(preferred) ? preferred : [preferred];
    for (const raw of list) {
      const locale = normalize(raw);
      if (!locale) continue;

      // BlinkSend currently ships Simplified Chinese only. Do not silently show
      // Simplified Chinese to users whose browser explicitly requests Traditional.
      if (/^zh-(tw|hk|mo|hant)(-|$)/.test(locale)) continue;
      if (/^zh-(cn|sg|hans)(-|$)/.test(locale) || locale === 'zh') return 'zh';

      const base = locale.split('-')[0];
      if (supported.has(base)) return base;
    }
    return 'en';
  }

  window.BlinkLocalePacks = window.BlinkLocalePacks || {};
  window.BlinkLocaleMeta = { names, titles, resolve };
})();
