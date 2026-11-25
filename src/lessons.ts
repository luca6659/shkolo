export type Question = {
  kind: 'choice' | 'input' | 'boolean' | 'pairs' | 'picture' | 'audio'
  label: string
  title: string
  hint?: string
  options?: string[]
  answer: string
  explanation: string
}

export type LessonData = { id: number; title: string; subtitle: string; questions: Question[] }

export const lessons: LessonData[] = [
  {
    id: 1, title: 'Warm-up', subtitle: 'Первые фразы и знакомство',
    questions: [
      { kind: 'choice', label: 'First contact', title: 'Ты знакомишься с новым одноклассником. Что скажешь?', options: ['Hi! I’m Alex. Nice to meet you.', 'I Alex nice.', 'Meet you I am.', 'Hello my name nice.'], answer: 'Hi! I’m Alex. Nice to meet you.', explanation: '«Nice to meet you» — стандартная фраза при знакомстве.' },
      { kind: 'input', label: 'Quick grammar', title: 'Впиши слово: “My name ___ Mia.”', hint: 'Одно слово · две буквы', answer: 'is', explanation: 'My name is… — так мы называем своё имя.' },
      { kind: 'boolean', label: 'True or false?', title: 'Фраза “I am fine, thanks” подходит для ответа на “How are you?”', options: ['Верно', 'Неверно'], answer: 'Верно', explanation: 'Это естественный и вежливый ответ о самочувствии.' },
      { kind: 'pairs', label: 'Word match', title: 'Соедини приветствия и перевод', answer: 'hello=привет;goodbye=до свидания;please=пожалуйста', explanation: 'Hello — привет, goodbye — до свидания, please — пожалуйста.' },
      { kind: 'picture', label: 'Picture talk', title: 'Новый друг говорит: “How are you?” Выбери ответ.', options: ['Pretty good! And you?', 'I am Alex.', 'See you yesterday.', 'Yes, I am name.'], answer: 'Pretty good! And you?', explanation: '«Pretty good! And you?» — отвечаем и поддерживаем разговор.' },
      { kind: 'audio', label: 'Listening check', title: 'Послушай фразу и выбери то, что услышал', options: ['What is your name?', 'How is your day?', 'Where is your house?', 'What is your game?'], answer: 'What is your name?', explanation: '«What is your name?» — «Как тебя зовут?».' },
    ],
  },
  {
    id: 2, title: 'New words', subtitle: 'Слова для ежедневного общения',
    questions: [
      { kind: 'choice', label: 'Everyday words', title: 'Как сказать «Давай потусуемся на выходных»?', options: ['Let’s hang out this weekend.', 'Let’s hang this week.', 'We weekend out.', 'Hang us on Sunday.'], answer: 'Let’s hang out this weekend.', explanation: 'Hang out — проводить время вместе, тусоваться.' },
      { kind: 'input', label: 'Spelling', title: 'Впиши слово: “That’s ___!” — «Это круто!»', hint: 'Одно слово · семь букв', answer: 'awesome', explanation: 'Awesome — разговорное «круто», «потрясающе».' },
      { kind: 'boolean', label: 'True or false?', title: 'Слово “grab” может означать «схватить» или «захватить по пути»', options: ['Верно', 'Неверно'], answer: 'Верно', explanation: 'Например: I’ll grab a coffee — я захвачу кофе.' },
      { kind: 'pairs', label: 'Word match', title: 'Соедини разговорные слова и перевод', answer: 'awesome=круто;grab=схватить;hang out=тусоваться', explanation: 'Эти три слова постоянно встречаются в живой речи.' },
      { kind: 'picture', label: 'Picture talk', title: 'Друг предлагает встретиться. Выбери подходящий ответ.', options: ['Sounds good! See you at six.', 'I six o’clock.', 'See you are good.', 'No talk today ever.'], answer: 'Sounds good! See you at six.', explanation: '«Sounds good!» — короткий естественный способ согласиться.' },
      { kind: 'audio', label: 'Listening check', title: 'Послушай фразу и выбери то, что услышал', options: ['What are you up to?', 'What do you do?', 'Where are you going?', 'What is up with you?'], answer: 'What are you up to?', explanation: '«What are you up to?» — «Чем занимаешься?».' },
    ],
  },
  {
    id: 3, title: 'Listen up!', subtitle: 'Понимаем английский на слух',
    questions: [
      { kind: 'audio', label: 'Listening check', title: 'Что ты слышишь?', options: ['Could you say that again?', 'Can you go away?', 'Could you sit here?', 'Do you say my name?'], answer: 'Could you say that again?', explanation: 'Так вежливо просят повторить фразу.' },
      { kind: 'choice', label: 'Listening response', title: 'Ты не расслышал собеседника. Что скажешь?', options: ['Sorry, could you repeat that?', 'You sound not.', 'Repeat your face.', 'I no ears.'], answer: 'Sorry, could you repeat that?', explanation: 'Could you repeat that? — вежливая просьба повторить.' },
      { kind: 'input', label: 'Key word', title: 'Впиши слово: “Can you speak more ___, please?”', hint: 'Медленнее · six letters', answer: 'slowly', explanation: 'Speak more slowly — говорить медленнее.' },
      { kind: 'boolean', label: 'True or false?', title: '“What do you mean?” означает «Что ты имеешь в виду?»', options: ['Верно', 'Неверно'], answer: 'Верно', explanation: 'Фраза помогает уточнить смысл сказанного.' },
      { kind: 'pairs', label: 'Word match', title: 'Соедини фразы для аудирования', answer: 'repeat=повтори;slowly=медленно;meaning=значение', explanation: 'Repeat — повторить, slowly — медленно, meaning — значение.' },
      { kind: 'audio', label: 'Listening check', title: 'Выбери точную фразу из аудио', options: ['I didn’t catch that.', 'I don’t catch you.', 'I did not see it.', 'I cannot catch this.'], answer: 'I didn’t catch that.', explanation: 'I didn’t catch that — «Я не расслышал».' },
    ],
  },
]

lessons.push(
  {
    id: 4, title: 'Small talk', subtitle: 'Лёгкие разговоры без пауз',
    questions: [
      { kind: 'choice', label: 'Small talk', title: 'Как начать непринуждённый разговор о выходных?', options: ['How was your weekend?', 'Your weekend is how?', 'Where weekend you?', 'Did your Saturday?'], answer: 'How was your weekend?', explanation: 'Классический вопрос для small talk после выходных.' },
      { kind: 'input', label: 'Conversation', title: 'Впиши слово: “What did you get ___ to yesterday?”', hint: 'Одно слово · две буквы', answer: 'up', explanation: 'Get up to — заниматься чем-то, обычно в разговорной речи.' },
      { kind: 'boolean', label: 'True or false?', title: '“Not much” можно использовать как короткий ответ на “What are you doing?”', options: ['Верно', 'Неверно'], answer: 'Верно', explanation: 'Not much — «Да ничем особенным».' },
      { kind: 'pairs', label: 'Word match', title: 'Соедини фразы для светской беседы', answer: 'weekend=выходные;weather=погода;hobby=хобби', explanation: 'Выходные, погода и хобби — безопасные темы для small talk.' },
      { kind: 'picture', label: 'Picture talk', title: 'Коллега спрашивает о планах на вечер. Выбери ответ.', options: ['I’m just going to chill at home.', 'I home chill am.', 'Yesterday I evening.', 'No plans are me.'], answer: 'I’m just going to chill at home.', explanation: 'Chill at home — расслабиться дома, ничего особенного не делать.' },
      { kind: 'audio', label: 'Listening check', title: 'Послушай и выбери услышанный вопрос', options: ['Do you have any plans?', 'Do you have any plants?', 'Are you playing today?', 'Did you make a plan?'], answer: 'Do you have any plans?', explanation: 'Do you have any plans? — «У тебя есть планы?».' },
    ],
  },
  {
    id: 5, title: 'Grammar boost', subtitle: 'Грамматика для живой речи',
    questions: [
      { kind: 'choice', label: 'Present simple', title: 'Выбери правильное предложение', options: ['She doesn’t like spicy food.', 'She don’t likes spicy food.', 'She not like spicy food.', 'She doesn’t likes spicy food.'], answer: 'She doesn’t like spicy food.', explanation: 'После doesn’t используем базовую форму глагола без -s.' },
      { kind: 'input', label: 'To be', title: 'Впиши пропущенное слово: “I ___ going to the party tonight.”', hint: 'Одно слово · две буквы', answer: 'am', explanation: 'С местоимением I используем am: I am going.' },
      { kind: 'boolean', label: 'True or false?', title: 'Предложение “They was at home” грамматически верно', options: ['Верно', 'Неверно'], answer: 'Неверно', explanation: 'С they в прошедшем времени используем were: They were at home.' },
      { kind: 'pairs', label: 'Word match', title: 'Соедини местоимения и формы to be', answer: 'I=am;she=is;they=are', explanation: 'I am, she is, they are — базовые формы глагола to be.' },
      { kind: 'picture', label: 'Picture talk', title: 'Выбери грамматически верный вопрос о вчерашнем дне', options: ['Did you watch the match?', 'Do you watched the match?', 'Did you watched the match?', 'You did watch match?'], answer: 'Did you watch the match?', explanation: 'После did основной глагол остаётся в начальной форме.' },
      { kind: 'audio', label: 'Listening check', title: 'Выбери грамматическую фразу из аудио', options: ['We were at the cinema.', 'We was at the cinema.', 'We are at cinema yesterday.', 'We be at the cinema.'], answer: 'We were at the cinema.', explanation: 'С we в прошедшем времени используется were.' },
    ],
  },
  {
    id: 6, title: 'Real-life talk', subtitle: 'Кафе, магазины и помощь',
    questions: [
      { kind: 'choice', label: 'At a café', title: 'Ты в кафе. Что скажешь бариста?', options: ['Can I get a latte, please?', 'I am latte.', 'Give latte now.', 'Latte is me.'], answer: 'Can I get a latte, please?', explanation: 'Can I get…? — естественная и вежливая фраза для заказа.' },
      { kind: 'input', label: 'Shopping', title: 'Впиши слово: “How much does this T-shirt ___?”', hint: 'Стоит · четыре буквы', answer: 'cost', explanation: 'How much does it cost? — сколько это стоит?' },
      { kind: 'boolean', label: 'True or false?', title: '“Where is the nearest station?” — вопрос о ближайшей станции', options: ['Верно', 'Неверно'], answer: 'Верно', explanation: 'Nearest — ближайший, station — станция.' },
      { kind: 'pairs', label: 'Word match', title: 'Соедини слова для поездок', answer: 'receipt=чек;discount=скидка;nearest=ближайший', explanation: 'Эти слова пригодятся в магазине и на улице.' },
      { kind: 'picture', label: 'Picture talk', title: 'Официант спрашивает: “Anything else?” Выбери ответ.', options: ['No, that’s all. Thanks.', 'I else no.', 'All is no thank.', 'Yes, that was all.'], answer: 'No, that’s all. Thanks.', explanation: 'That’s all — «это всё», вежливо завершаем заказ.' },
      { kind: 'audio', label: 'Listening check', title: 'Послушай просьбу о помощи', options: ['Could you help me, please?', 'Can you hold me, please?', 'Could you hear me now?', 'Can I help your place?'], answer: 'Could you help me, please?', explanation: 'Could you help me? — вежливая просьба о помощи.' },
    ],
  },
  {
    id: 7, title: 'Sound natural', subtitle: 'Связки и естественное произношение',
    questions: [
      { kind: 'choice', label: 'Natural English', title: 'Как естественно сказать «Я собираюсь пойти»?', options: ['I’m gonna go.', 'I going go.', 'I am will go.', 'I go gonna.'], answer: 'I’m gonna go.', explanation: 'Gonna — разговорная форма going to, уместная в неформальной речи.' },
      { kind: 'input', label: 'Linking', title: 'Впиши сокращение: “I ___ got it.” — «Я понял»', hint: 'Have в сокращении · три буквы', answer: '’ve', explanation: 'I’ve got it — естественное «я понял».' },
      { kind: 'boolean', label: 'True or false?', title: '“Wanna” — разговорная форма “want to”', options: ['Верно', 'Неверно'], answer: 'Верно', explanation: 'Wanna используют в неформальном общении, но не в официальных текстах.' },
      { kind: 'pairs', label: 'Word match', title: 'Соедини полные и разговорные формы', answer: 'going to=gonna;want to=wanna;got to=gotta', explanation: 'Эти формы часто встречаются в фильмах и повседневной речи.' },
      { kind: 'picture', label: 'Picture talk', title: 'Друг спрашивает: “Wanna come?” Выбери естественный ответ.', options: ['Sure! I’d love to.', 'Yes, I wanna come to.', 'I love coming yes.', 'Surely I am love.'], answer: 'Sure! I’d love to.', explanation: 'I’d love to — «с удовольствием».' },
      { kind: 'audio', label: 'Listening check', title: 'Послушай разговорную фразу', options: ['I’ve got to run.', 'I got run to.', 'I have running.', 'I’ve got a sun.'], answer: 'I’ve got to run.', explanation: 'I’ve got to run — «мне пора бежать».' },
    ],
  },
  {
    id: 8, title: 'Speaking final', subtitle: 'Финальный разговорный челлендж',
    questions: [
      { kind: 'choice', label: 'Final talk', title: 'Тебя спросили о любимом занятии. Выбери развёрнутый ответ.', options: ['I love photography because it helps me notice little things.', 'Photography yes I.', 'My hobby is good hobby.', 'I very like photo because.'], answer: 'I love photography because it helps me notice little things.', explanation: 'Хороший ответ называет занятие и объясняет причину через because.' },
      { kind: 'input', label: 'Opinion', title: 'Впиши слово: “In my ___, learning through practice is best.”', hint: 'Мнение · семь букв', answer: 'opinion', explanation: 'In my opinion — «по моему мнению».' },
      { kind: 'boolean', label: 'True or false?', title: 'Чтобы поддержать разговор, полезно задать встречный вопрос “What about you?”', options: ['Верно', 'Неверно'], answer: 'Верно', explanation: 'What about you? — «А ты?», возвращает вопрос собеседнику.' },
      { kind: 'pairs', label: 'Word match', title: 'Соедини фразы для аргументации', answer: 'because=потому что;for example=например;in my opinion=по моему мнению', explanation: 'Связки помогают сделать ответ логичным и развёрнутым.' },
      { kind: 'picture', label: 'Picture talk', title: 'Собеседник поделился хорошей новостью. Как отреагируешь?', options: ['That’s amazing! I’m so happy for you.', 'It is news okay.', 'Happy you are that.', 'Amazing for I you.'], answer: 'That’s amazing! I’m so happy for you.', explanation: 'I’m happy for you — «я рад за тебя».' },
      { kind: 'audio', label: 'Listening check', title: 'Финальное аудио: выбери услышанную фразу', options: ['It was great talking to you.', 'It is great to walk with you.', 'It was great taking you.', 'It is grey talking today.'], answer: 'It was great talking to you.', explanation: 'Так тепло завершают разговор: «Было здорово пообщаться».' },
    ],
  },
)
