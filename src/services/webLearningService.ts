
interface WebContent {
  url: string;
  title: string;
  content: string;
  summary: string;
  keywords: string[];
  timestamp: Date;
  relevanceScore: number;
}

interface LearningProgress {
  totalArticles: number;
  categoriesLearned: string[];
  knowledgeBase: Map<string, WebContent[]>;
  lastUpdate: Date;
}

class WebLearningService {
  private knowledgeBase: Map<string, WebContent[]> = new Map();
  private learningQueue: string[] = [];
  private isLearning = false;
  private progress: LearningProgress = {
    totalArticles: 0,
    categoriesLearned: [],
    knowledgeBase: new Map(),
    lastUpdate: new Date()
  };

  // Популярные источники для обучения
  private learningSources = [
    'https://habr.com/ru/feed/',
    'https://tproger.ru/feed/',
    'https://lenta.ru/rss',
    'https://ria.ru/export/rss2/archive/index.xml',
    'https://www.bbc.com/russian/news',
    'https://meduza.io/rss/all'
  ];

  async startAutonomousLearning() {
    if (this.isLearning) return;
    
    this.isLearning = true;
    console.log('🌐 Анюта начинает изучать интернет...');
    
    // Эмуляция веб-скрапинга (в реальном проекте нужен прокси-сервер)
    this.simulateWebScraping();
    
    // Запускаем цикл обучения каждые 30 минут
    setInterval(() => {
      if (this.isLearning) {
        this.simulateWebScraping();
      }
    }, 30 * 60 * 1000);
  }

  private async simulateWebScraping() {
    console.log('🕷️ Сканирую веб-источники...');
    
    // Симуляция получения новых статей
    const simulatedArticles = this.generateSimulatedContent();
    
    for (const article of simulatedArticles) {
      await this.processNewContent(article);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка между обработкой
    }
    
    console.log(`📚 Изучено ${simulatedArticles.length} новых материалов`);
  }

  private generateSimulatedContent(): WebContent[] {
    const topics = [
      'искусственный интеллект',
      'машинное обучение', 
      'нейронные сети',
      'программирование',
      'технологии',
      'наука',
      'космос',
      'медицина',
      'экология',
      'образование'
    ];

    const articles: WebContent[] = [];
    
    for (let i = 0; i < 5; i++) {
      const topic = topics[Math.floor(Math.random() * topics.length)];
      const article: WebContent = {
        url: `https://example.com/article-${Date.now()}-${i}`,
        title: this.generateTitle(topic),
        content: this.generateContent(topic),
        summary: '',
        keywords: [topic],
        timestamp: new Date(),
        relevanceScore: Math.random()
      };
      
      article.summary = this.summarizeContent(article.content);
      articles.push(article);
    }
    
    return articles;
  }

  private generateTitle(topic: string): string {
    const templates = [
      `Новые достижения в области ${topic}`,
      `Как ${topic} изменит будущее`,
      `Последние исследования в ${topic}`,
      `Революция в ${topic}: что нужно знать`,
      `Практическое применение ${topic}`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generateContent(topic: string): string {
    const contentTemplates = [
      `Недавние исследования в области ${topic} показывают значительный прогресс. Ученые разработали новые методы, которые могут революционизировать эту сферу. Особое внимание уделяется практическому применению новых технологий.`,
      `В мире ${topic} происходят удивительные изменения. Новые открытия открывают перспективы для развития различных отраслей. Эксперты прогнозируют дальнейший рост интереса к этой области.`,
      `Современные тенденции в ${topic} демонстрируют важность инновационного подхода. Исследователи работают над созданием более эффективных решений для повседневной жизни.`
    ];
    
    return contentTemplates[Math.floor(Math.random() * contentTemplates.length)];
  }

  private summarizeContent(content: string): string {
    // Простая экстракция ключевых предложений
    const sentences = content.split('.').filter(s => s.trim().length > 20);
    return sentences.slice(0, 2).join('. ') + '.';
  }

  private async processNewContent(content: WebContent) {
    // Категоризация контента
    const category = this.categorizeContent(content);
    
    if (!this.knowledgeBase.has(category)) {
      this.knowledgeBase.set(category, []);
    }
    
    const categoryContent = this.knowledgeBase.get(category)!;
    categoryContent.push(content);
    
    // Ограничиваем количество статей в категории
    if (categoryContent.length > 50) {
      categoryContent.splice(0, categoryContent.length - 50);
    }
    
    this.progress.totalArticles++;
    if (!this.progress.categoriesLearned.includes(category)) {
      this.progress.categoriesLearned.push(category);
    }
    this.progress.lastUpdate = new Date();
    
    console.log(`📖 Изучена статья: "${content.title}" в категории "${category}"`);
  }

  private categorizeContent(content: WebContent): string {
    const keywords = content.content.toLowerCase();
    
    if (keywords.includes('искусственный интеллект') || keywords.includes('нейронные сети')) {
      return 'ИИ и технологии';
    } else if (keywords.includes('программирование') || keywords.includes('код')) {
      return 'Программирование';
    } else if (keywords.includes('наука') || keywords.includes('исследование')) {
      return 'Наука';
    } else if (keywords.includes('космос') || keywords.includes('планета')) {
      return 'Космос';
    } else if (keywords.includes('медицина') || keywords.includes('здоровье')) {
      return 'Медицина';
    } else {
      return 'Общие знания';
    }
  }

  searchKnowledge(query: string): WebContent[] {
    const results: WebContent[] = [];
    const searchTerms = query.toLowerCase().split(' ');
    
    for (const [category, articles] of this.knowledgeBase) {
      for (const article of articles) {
        let relevance = 0;
        
        searchTerms.forEach(term => {
          if (article.title.toLowerCase().includes(term)) relevance += 3;
          if (article.content.toLowerCase().includes(term)) relevance += 1;
          if (article.keywords.some(keyword => keyword.includes(term))) relevance += 2;
        });
        
        if (relevance > 0) {
          results.push({ ...article, relevanceScore: relevance });
        }
      }
    }
    
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 10);
  }

  getRandomFact(): string {
    const allArticles: WebContent[] = [];
    for (const articles of this.knowledgeBase.values()) {
      allArticles.push(...articles);
    }
    
    if (allArticles.length === 0) {
      return 'Я еще изучаю интернет... Скоро у меня будет много интересных фактов! 🌐';
    }
    
    const randomArticle = allArticles[Math.floor(Math.random() * allArticles.length)];
    return `💡 Интересный факт: ${randomArticle.summary}`;
  }

  getLearningProgress(): LearningProgress {
    return {
      ...this.progress,
      knowledgeBase: new Map(this.knowledgeBase)
    };
  }

  addLearningUrl(url: string) {
    if (!this.learningQueue.includes(url)) {
      this.learningQueue.push(url);
      console.log(`📋 Добавлен URL для изучения: ${url}`);
    }
  }

  getKnowledgeByCategory(category: string): WebContent[] {
    return this.knowledgeBase.get(category) || [];
  }

  getAllCategories(): string[] {
    return Array.from(this.knowledgeBase.keys());
  }

  stopLearning() {
    this.isLearning = false;
    console.log('⏸️ Автономное обучение остановлено');
  }

  async analyzeUrl(url: string): Promise<WebContent | null> {
    // В реальном проекте здесь был бы запрос к прокси-серверу для скрапинга
    console.log(`🔍 Анализирую URL: ${url}`);
    
    // Эмуляция анализа URL
    return new Promise((resolve) => {
      setTimeout(() => {
        const content: WebContent = {
          url,
          title: 'Анализ веб-страницы',
          content: 'Содержимое страницы было проанализировано и добавлено в базу знаний.',
          summary: 'Краткое содержание проанализированной страницы.',
          keywords: ['веб', 'анализ', 'контент'],
          timestamp: new Date(),
          relevanceScore: 0.8
        };
        resolve(content);
      }, 2000);
    });
  }
}

export const webLearningService = new WebLearningService();
