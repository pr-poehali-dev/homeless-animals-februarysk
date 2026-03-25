import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const NAV_ITEMS = [
  { id: 'home', label: 'Главная' },
  { id: 'about', label: 'О проекте' },
  { id: 'animals', label: 'Животные' },
  { id: 'help', label: 'Поддержка' },
  { id: 'news', label: 'Новости' },
  { id: 'volunteers', label: 'Волонтёры' },
  { id: 'reports', label: 'Отчёты' },
  { id: 'contacts', label: 'Связь' },
];

const ANIMALS = [
  { id: 1, name: 'Барсик', type: 'Кот', age: '2 года', status: 'ищет дом', emoji: '🐱', color: 'рыжий', desc: 'Ласковый и игривый, привит, стерилизован.' },
  { id: 2, name: 'Найда', type: 'Собака', age: '3 года', status: 'ищет дом', emoji: '🐶', color: 'чёрно-белая', desc: 'Добрая, хорошо ладит с детьми.' },
  { id: 3, name: 'Рыжик', type: 'Кот', age: '1 год', status: 'на передержке', emoji: '🐈', color: 'рыжий', desc: 'Активный котёнок, очень ласковый.' },
  { id: 4, name: 'Шарик', type: 'Собака', age: '4 года', status: 'ищет дом', emoji: '🐕', color: 'белый', desc: 'Обученный, знает базовые команды.' },
  { id: 5, name: 'Мурка', type: 'Кошка', age: '5 лет', status: 'на передержке', emoji: '🐈‍⬛', color: 'чёрная', desc: 'Спокойная кошка, любит тишину.' },
  { id: 6, name: 'Дружок', type: 'Собака', age: '2 года', status: 'ищет дом', emoji: '🦮', color: 'коричневый', desc: 'Активный и преданный, обожает прогулки.' },
];

const NEWS = [
  { date: '15 марта 2026', title: 'Завершена первая волна стерилизации', text: 'В феврале–марте было стерилизовано 24 животных. Ветеринары работали в режиме мобильных бригад.', tag: 'Ветеринария' },
  { date: '1 марта 2026', title: 'Открытие временного приюта', text: 'Приют на 30 мест официально открыт. Первые 12 животных уже находятся под опекой волонтёров.', tag: 'Приют' },
  { date: '14 февраля 2026', title: 'Поддержка администрации посёлка', text: 'Администрация пгт Февральск выделила помещение под приют и частичное финансирование проекта.', tag: 'Новости' },
];

const VOLUNTEERS = [
  { name: 'Слесь Владимир Григорьевич', role: 'Руководитель проекта', emoji: '👨‍💼', desc: 'Координация, взаимодействие с администрацией.' },
  { name: 'Узлова Светлана Сергеевна', role: 'Ветеринарный куратор', emoji: '🩺', desc: 'Организация осмотров и лечения животных.' },
  { name: 'Слесь Алина Владимировна', role: 'Координатор приюта', emoji: '🏠', desc: 'Уход за животными, ведение документации.' },
  { name: 'Смагин Владислав Дмитриевич', role: 'Волонтёр-водитель', emoji: '🚗', desc: 'Транспортировка животных, помощь в отлове.' },
];

const REPORTS = [
  { period: 'Февраль–Март 2026', animals: 36, sterilized: 24, vaccinated: 36, adopted: 8 },
  { period: 'Январь 2026', animals: 12, sterilized: 8, vaccinated: 12, adopted: 3 },
];

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
}

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeAnimalFilter, setActiveAnimalFilter] = useState('все');

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map(item => document.getElementById(item.id));
      const scrollPos = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i]!.offsetTop <= scrollPos) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const filteredAnimals = activeAnimalFilter === 'все'
    ? ANIMALS
    : ANIMALS.filter(a => a.type.toLowerCase().includes(activeAnimalFilter));

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: 'var(--color-beige)' }}>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 shadow-sm" style={{ backgroundColor: 'rgba(253, 246, 238, 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--color-beige-dark)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          <button onClick={() => scrollTo('home')} className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <div className="text-left">
              <div className="font-display font-semibold text-sm leading-none" style={{ color: 'var(--color-terra)' }}>Беспризорные животные</div>
              <div className="text-xs leading-none mt-0.5" style={{ color: 'var(--color-text-muted)' }}>пгт Февральск</div>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  color: activeSection === item.id ? 'var(--color-terra)' : 'var(--color-text-muted)',
                  backgroundColor: activeSection === item.id ? 'rgba(201, 104, 48, 0.1)' : 'transparent',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            className="lg:hidden p-2 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: 'var(--color-terra)' }}
          >
            <Icon name={menuOpen ? 'X' : 'Menu'} size={22} />
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden px-4 pb-4 grid grid-cols-2 gap-1" style={{ borderTop: '1px solid var(--color-beige-dark)' }}>
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-left"
                style={{ color: 'var(--color-text)', backgroundColor: activeSection === item.id ? 'rgba(201, 104, 48, 0.1)' : 'transparent' }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://cdn.poehali.dev/projects/98dd3c1b-ac2c-454a-9750-17f20d0fc41a/files/86f855c5-4597-438a-9ad1-91b42d9b2024.jpg)`,
            filter: 'brightness(0.45)',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(201,104,48,0.3) 0%, rgba(47,82,52,0.4) 100%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-24">
          <div className="max-w-3xl" style={{ animation: 'fade-in 0.8s ease-out forwards' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ backgroundColor: 'rgba(253,246,238,0.15)', color: '#fdf6ee', border: '1px solid rgba(253,246,238,0.3)' }}>
              <span>🐾</span>
              <span>пгт Февральск · Амурская область</span>
            </div>

            <h1 className="font-display font-semibold leading-tight mb-6"
              style={{ color: '#fdf6ee', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
              Каждое животное<br />
              <em className="not-italic" style={{ color: 'var(--color-terra-light)' }}>заслуживает</em><br />
              заботы и дома
            </h1>

            <p className="text-lg leading-relaxed mb-10"
              style={{ color: 'rgba(253,246,238,0.85)', maxWidth: '560px' }}>
              Мы помогаем бездомным животным Февральска — отлов, лечение, стерилизация, поиск хозяев. Вместе мы можем изменить жизнь сотен питомцев.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo('animals')}
                className="px-8 py-3 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: 'var(--color-terra)', color: '#fdf6ee' }}
              >
                Помочь животному
              </button>
              <button
                onClick={() => scrollTo('help')}
                className="px-8 py-3 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: 'rgba(253,246,238,0.15)', color: '#fdf6ee', border: '1px solid rgba(253,246,238,0.4)' }}
              >
                Стать волонтёром
              </button>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: '48', label: 'Животных спасено', icon: '🐾' },
              { num: '32', label: 'Стерилизовано', icon: '💉' },
              { num: '11', label: 'Нашли дом', icon: '🏠' },
              { num: '18', label: 'Волонтёров', icon: '🤝' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-5 text-center"
                style={{ backgroundColor: 'rgba(253,246,238,0.12)', border: '1px solid rgba(253,246,238,0.2)' }}
              >
                <div className="text-3xl mb-1">{stat.icon}</div>
                <div className="font-display font-bold text-3xl" style={{ color: '#fdf6ee' }}>{stat.num}</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(253,246,238,0.7)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-14">
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: 'var(--color-terra)' }}>О нас</span>
            <h2 className="font-display font-semibold mt-2" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-text)' }}>
              Комплексный подход<br />к защите животных
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <AnimatedSection>
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
              <img
                src="https://cdn.poehali.dev/projects/98dd3c1b-ac2c-454a-9750-17f20d0fc41a/files/42f568c2-5d09-4389-b43a-dd3bdee188cd.jpg"
                alt="Волонтёры помогают животным"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl p-4"
                style={{ backgroundColor: 'rgba(253,246,238,0.92)', backdropFilter: 'blur(8px)' }}>
                <div className="font-display font-semibold text-lg" style={{ color: 'var(--color-text)' }}>Цель проекта</div>
                <div className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  Снижение численности бездомных животных на 30% и повышение гуманного отношения к ним в Февральске
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="space-y-5">
            {[
              { icon: 'Syringe', title: 'Ветеринарная помощь', desc: 'Отлов, осмотр, лечение, стерилизация и вакцинация животных силами профессиональных ветеринаров.' },
              { icon: 'Home', title: 'Временный приют', desc: 'Содержание и реабилитация животных в безопасных условиях до момента передачи новым хозяевам.' },
              { icon: 'Users', title: 'Работа с населением', desc: 'Информационные кампании, просвещение жителей, встречи с представителями администрации.' },
              { icon: 'Heart', title: 'Передача в добрые руки', desc: 'Система проверки и подбора ответственных хозяев, поддержка после передачи животного.' },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 p-5 rounded-2xl transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: 'white', border: '1px solid var(--color-beige-dark)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(201, 104, 48, 0.1)' }}>
                  <Icon name={item.icon} size={22} fallback="Heart" style={{ color: 'var(--color-terra)' }} />
                </div>
                <div>
                  <div className="font-semibold text-base" style={{ color: 'var(--color-text)' }}>{item.title}</div>
                  <div className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Animals */}
      <section id="animals" className="py-16 px-4 md:px-8 lg:px-16" style={{ backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-10">
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: 'var(--color-terra)' }}>Наши подопечные</span>
            <h2 className="font-display font-semibold mt-2" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-text)' }}>
              Животные ищут дом
            </h2>
            <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
              Все животные прошли ветеринарный осмотр, привиты и стерилизованы
            </p>
          </AnimatedSection>

          <AnimatedSection className="flex justify-center gap-2 mb-8 flex-wrap">
            {['все', 'кот', 'собак'].map(f => (
              <button
                key={f}
                onClick={() => setActiveAnimalFilter(f)}
                className="px-5 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200"
                style={{
                  backgroundColor: activeAnimalFilter === f ? 'var(--color-terra)' : 'var(--color-beige-dark)',
                  color: activeAnimalFilter === f ? '#fdf6ee' : 'var(--color-text)',
                }}
              >
                {f === 'все' ? 'Все' : f === 'кот' ? '🐱 Кошки' : '🐶 Собаки'}
              </button>
            ))}
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnimals.map((animal, i) => (
              <AnimatedSection key={animal.id}>
                <div
                  className="rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                  style={{ backgroundColor: 'var(--color-beige)', border: '1px solid var(--color-beige-dark)' }}
                >
                  <div className="h-44 flex items-center justify-center text-7xl"
                    style={{ backgroundColor: i % 2 === 0 ? 'rgba(201,104,48,0.08)' : 'rgba(74,127,80,0.08)' }}>
                    {animal.emoji}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-display font-semibold text-xl" style={{ color: 'var(--color-text)' }}>{animal.name}</div>
                        <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{animal.type} · {animal.age} · {animal.color}</div>
                      </div>
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: animal.status === 'ищет дом' ? 'rgba(74,127,80,0.12)' : 'rgba(201,104,48,0.12)',
                          color: animal.status === 'ищет дом' ? 'var(--color-sage)' : 'var(--color-terra)',
                        }}
                      >
                        {animal.status}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-muted)' }}>{animal.desc}</p>
                    <button
                      className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-80"
                      style={{ backgroundColor: 'var(--color-terra)', color: '#fdf6ee' }}
                    >
                      Взять домой
                    </button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How to Help */}
      <section id="help" className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-14">
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: 'var(--color-terra)' }}>Поддержка</span>
          <h2 className="font-display font-semibold mt-2" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-text)' }}>
            Как вы можете помочь
          </h2>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { emoji: '❤️', title: 'Взять питомца', desc: 'Дайте животному любящий дом. Мы поможем подобрать подходящего питомца под ваш образ жизни.', cta: 'Посмотреть животных', action: () => scrollTo('animals') },
            { emoji: '🤝', title: 'Стать волонтёром', desc: 'Помогайте с выгулом, кормлением, уходом или транспортировкой животных в приюте.', cta: 'Записаться', action: () => scrollTo('contacts') },
            { emoji: '💰', title: 'Пожертвование', desc: 'Финансовая помощь идёт на корм, лечение, оборудование и содержание приюта.', cta: 'Помочь финансово', action: () => scrollTo('contacts') },
            { emoji: '📢', title: 'Распространить', desc: 'Расскажите друзьям о проекте. Репост в соцсетях — это тоже огромная помощь!', cta: 'Поделиться', action: () => scrollTo('contacts') },
          ].map((item) => (
            <AnimatedSection key={item.title}>
              <div
                className="rounded-2xl p-7 h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ backgroundColor: 'white', border: '1px solid var(--color-beige-dark)' }}
              >
                <div className="text-4xl mb-4">{item.emoji}</div>
                <div className="font-display font-semibold text-xl mb-2" style={{ color: 'var(--color-text)' }}>{item.title}</div>
                <div className="text-sm leading-relaxed flex-1 mb-5" style={{ color: 'var(--color-text-muted)' }}>{item.desc}</div>
                <button
                  onClick={item.action}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 hover:opacity-80"
                  style={{ borderColor: 'var(--color-terra)', color: 'var(--color-terra)', backgroundColor: 'transparent' }}
                >
                  {item.cta}
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* News */}
      <section id="news" className="py-16 px-4 md:px-8 lg:px-16" style={{ backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: 'var(--color-terra)' }}>Новости</span>
            <h2 className="font-display font-semibold mt-2" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-text)' }}>
              Что происходит в проекте
            </h2>
          </AnimatedSection>

          <div className="space-y-6">
            {NEWS.map((item, i) => (
              <AnimatedSection key={i}>
                <div
                  className="rounded-2xl p-7 flex gap-6 items-start transition-all duration-200 hover:shadow-md"
                  style={{ backgroundColor: 'var(--color-beige)', border: '1px solid var(--color-beige-dark)' }}
                >
                  <div className="text-center flex-shrink-0 w-16">
                    <div className="font-display font-bold text-3xl" style={{ color: 'var(--color-terra)' }}>
                      {item.date.split(' ')[0]}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {item.date.split(' ').slice(1).join(' ')}
                    </div>
                  </div>
                  <div className="border-l-2 pl-6 flex-1" style={{ borderColor: 'var(--color-terra-light)' }}>
                    <span
                      className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold mb-2"
                      style={{ backgroundColor: 'rgba(201,104,48,0.1)', color: 'var(--color-terra)' }}
                    >
                      {item.tag}
                    </span>
                    <div className="font-display font-semibold text-xl mb-2" style={{ color: 'var(--color-text)' }}>{item.title}</div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{item.text}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteers */}
      <section id="volunteers" className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-14">
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: 'var(--color-terra)' }}>Команда</span>
          <h2 className="font-display font-semibold mt-2" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-text)' }}>
            Наши волонтёры
          </h2>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {VOLUNTEERS.map((v) => (
            <AnimatedSection key={v.name}>
              <div
                className="rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ backgroundColor: 'white', border: '1px solid var(--color-beige-dark)' }}
              >
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl"
                  style={{ backgroundColor: 'rgba(201,104,48,0.08)' }}>
                  {v.emoji}
                </div>
                <div className="font-display font-semibold text-lg" style={{ color: 'var(--color-text)' }}>{v.name}</div>
                <div className="text-xs font-semibold uppercase tracking-wide mt-1 mb-2" style={{ color: 'var(--color-terra)' }}>{v.role}</div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{v.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection>
          <div
            className="rounded-3xl p-10 text-center"
            style={{
              background: 'linear-gradient(135deg, var(--color-terra) 0%, var(--color-terra-dark) 100%)',
            }}
          >
            <div className="text-4xl mb-4">🐾</div>
            <h3 className="font-display font-semibold text-3xl mb-3" style={{ color: '#fdf6ee' }}>Присоединяйтесь к команде!</h3>
            <p className="text-base mb-6 max-w-lg mx-auto" style={{ color: 'rgba(253,246,238,0.85)' }}>
              Мы всегда рады новым волонтёрам. Любая помощь важна — от прогулок с собаками до публикаций в социальных сетях.
            </p>
            <button
              onClick={() => scrollTo('contacts')}
              className="px-8 py-3 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: '#fdf6ee', color: 'var(--color-terra)' }}
            >
              Стать волонтёром
            </button>
          </div>
        </AnimatedSection>
      </section>

      {/* Reports */}
      <section id="reports" className="py-16 px-4 md:px-8 lg:px-16" style={{ backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: 'var(--color-terra)' }}>Прозрачность</span>
            <h2 className="font-display font-semibold mt-2" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-text)' }}>
              Отчёты о работе
            </h2>
          </AnimatedSection>

          <div className="space-y-4">
            {REPORTS.map((r, i) => (
              <AnimatedSection key={i}>
                <div
                  className="rounded-2xl p-6 md:p-8"
                  style={{ backgroundColor: 'var(--color-beige)', border: '1px solid var(--color-beige-dark)' }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="font-display font-semibold text-xl" style={{ color: 'var(--color-text)' }}>{r.period}</div>
                      <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Отчётный период</div>
                    </div>
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-80"
                      style={{ backgroundColor: 'var(--color-terra)', color: '#fdf6ee' }}
                    >
                      <Icon name="Download" size={15} />
                      Скачать PDF
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Животных принято', value: r.animals, emoji: '🐾' },
                      { label: 'Стерилизовано', value: r.sterilized, emoji: '💉' },
                      { label: 'Вакцинировано', value: r.vaccinated, emoji: '🩺' },
                      { label: 'Переданы хозяевам', value: r.adopted, emoji: '🏠' },
                    ].map(stat => (
                      <div key={stat.label}
                        className="rounded-xl p-4 text-center"
                        style={{ backgroundColor: 'white', border: '1px solid var(--color-beige-dark)' }}>
                        <div className="text-2xl mb-1">{stat.emoji}</div>
                        <div className="font-display font-bold text-3xl" style={{ color: 'var(--color-terra)' }}>{stat.value}</div>
                        <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section id="contacts" className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-14">
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: 'var(--color-terra)' }}>Связь</span>
          <h2 className="font-display font-semibold mt-2" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-text)' }}>
            Свяжитесь с нами
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8">
          <AnimatedSection className="space-y-4">
            {[
              { icon: 'MapPin', label: 'Адрес приюта', value: 'пгт Февральск, Амурская область' },
              { icon: 'Phone', label: 'Телефон', value: '+7 (XXX) XXX-XX-XX' },
              { icon: 'Mail', label: 'Email', value: 'animals@fevralsk.ru' },
              { icon: 'Clock', label: 'Режим работы', value: 'Пн–Вс: 10:00 – 18:00' },

            ].map(item => (
              <div key={item.label}
                className="flex gap-4 items-center p-5 rounded-2xl"
                style={{ backgroundColor: 'white', border: '1px solid var(--color-beige-dark)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(201,104,48,0.1)' }}>
                  <Icon name={item.icon} size={20} fallback="Info" style={{ color: 'var(--color-terra)' }} />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>{item.label}</div>
                  <div className="font-medium mt-0.5" style={{ color: 'var(--color-text)' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </AnimatedSection>

          <AnimatedSection>
            <div
              className="rounded-2xl p-7 h-full"
              style={{ backgroundColor: 'white', border: '1px solid var(--color-beige-dark)' }}
            >
              <h3 className="font-display font-semibold text-2xl mb-5" style={{ color: 'var(--color-text)' }}>Написать нам</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>Ваше имя</label>
                  <input
                    type="text"
                    placeholder="Иван Иванов"
                    className="w-full px-4 py-2.5 rounded-xl outline-none transition-all text-sm"
                    style={{ border: '1px solid var(--color-beige-dark)', backgroundColor: 'var(--color-beige)', color: 'var(--color-text)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>Телефон или email</label>
                  <input
                    type="text"
                    placeholder="+7 или email"
                    className="w-full px-4 py-2.5 rounded-xl outline-none transition-all text-sm"
                    style={{ border: '1px solid var(--color-beige-dark)', backgroundColor: 'var(--color-beige)', color: 'var(--color-text)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>Сообщение</label>
                  <textarea
                    rows={4}
                    placeholder="Хочу помочь / взять питомца / задать вопрос..."
                    className="w-full px-4 py-2.5 rounded-xl outline-none transition-all text-sm resize-none"
                    style={{ border: '1px solid var(--color-beige-dark)', backgroundColor: 'var(--color-beige)', color: 'var(--color-text)' }}
                  />
                </div>
                <button
                  className="w-full py-3 rounded-xl font-semibold text-base transition-all duration-200 hover:opacity-80 hover:shadow-md"
                  style={{ backgroundColor: 'var(--color-terra)', color: '#fdf6ee' }}
                >
                  Отправить сообщение
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 md:px-8" style={{ backgroundColor: 'var(--color-text)', color: 'rgba(253,246,238,0.8)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🐾</span>
              <div>
                <div className="font-display font-semibold text-lg" style={{ color: '#fdf6ee' }}>Беспризорные животные</div>
                <div className="text-sm">пгт Февральск, Амурская область</div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="hover:opacity-100 transition-opacity opacity-70"
                  style={{ color: 'rgba(253,246,238,0.8)' }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6 text-center text-xs" style={{ borderTop: '1px solid rgba(253,246,238,0.1)', color: 'rgba(253,246,238,0.4)' }}>
            © 2026 Проект «Беспризорные животные в пгт Февральск» · Все права защищены
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;