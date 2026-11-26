# школо! — english, но по кайфу

Игровая образовательная платформа для изучения английского языка.

## Технологии

- React 19 + TypeScript + Vite
- Tailwind CSS
- Supabase Auth
- Vite PWA

## Запуск

```bash
npm install
npm run dev
```

Production-сборка:

```bash
npm run build
```

## Авторизация

- Регистрация временно полностью отключена: формы создания аккаунта и клиентского вызова `signUp` нет.
- Доступен вход существующих пользователей по email и паролю.
- Восстановление пароля по коду из email.
- Подтверждение recovery-кода через `verifyOtp({ type: 'recovery' })`.
- Сохранение и автоматическое восстановление сессии.

Для восстановления Supabase Auth поддерживает email OTP длиной от 6 до 10 цифр. Интерфейс принимает код любой поддерживаемой длины и передаёт его в `verifyOtp` полностью. В шаблоне **Reset Password** нужно выводить `{{ .Token }}`. Шаблон **Confirm signup** сейчас не используется.

Для подключения другого Supabase-проекта задайте переменные окружения:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

В клиентский код и репозиторий нельзя добавлять `service_role`, secret key, пароль базы данных или connection string.

## Контент

- 8 уроков и 48 заданий.
- 6 типов заданий: выбор ответа, ввод, верно/неверно, пары, картинки и аудио.
- Последовательное открытие уровней.
- XP, монеты, кристаллы, магазин, рейтинг, класс и профиль.

## Деплой на Vercel

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: `./`
