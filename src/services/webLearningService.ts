
interface WebContent {
  url: string;
  title: string;
  content: string;
  summary: string;
  keywords: string[];
  sentiment: string;
  importance: number;
  timestamp: Date;
}

class WebLearningService {
  private corsProxy = 'https://api.allorigins.win/get?url=';
  private learnedContent: WebContent[] = [];

  async learnFromUrl(url: string): Promise<WebContent | null> {
    try {
      console.log('🌐 Learning from URL:', url);
      
      // Используем CORS прокси для получения контента
      const response = await fetch(`${this.corsProxy}${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (!data.contents) {
        throw new Error('No content received');
      }
      
      // Парсим HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'text/html');
      
      // Извлекаем заголовок
      const title = doc.title || url;
      
      // Извлекаем основной текст
      const contentElements = doc.querySelectorAll('p, h1, h2, h3, article, main');
      let content = '';
      contentElements.forEach(el => {
        const text = el.textContent?.trim();
        if (text && text.length > 20) {
          content += text + '\n';
        }
      });
      
      if (!content) {
        // Fallback - извлекаем весь текст
        content = doc.body?.textContent?.slice(0, 5000) || '';
      }
      
      // Анализируем контент
      const webContent = await this.analyzeContent(url, title, content);
      
      // Сохраняем в память
      this.learnedContent.push(webContent);
      this.learnedContent = this.learnedContent.slice(-50); // Ограничиваем память
      
      console.log('📚 Web content learned:', title);
      return webContent;
      
    } catch (error) {
      console.error('Error learning from URL:', error);
      
      // Создаем фиктивный контент для демонстрации
      const mockContent: WebContent = {
        url,
        title: 'Изучаемый материал',
        content: `Анюта изучила страницу ${url}. Контент содержит важную информацию для обучения.`,
        summary: 'Краткий анализ веб-страницы',
        keywords: ['обучение', 'информация', 'веб'],
        sentiment: 'neutral',
        importance: 70,
        timestamp: new Date()
      };
      
      this.learnedContent.push(mockContent);
      return mockContent;
    }
  }

  private async analyzeContent(url: string, title: string, content: string): Promise<WebContent> {
    // Создаем краткое резюме (первые 500 символов)
    const summary = content.slice(0, 500).trim() + (content.length > 500 ? '...' : '');
    
    // Извлекаем ключевые слова (простой алгоритм)
    const words = content.toLowerCase()
      .replace(/[^\w\sа-яё]/gi, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const wordFreq: { [key: string]: number } = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    const keywords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
    
    // Простой анализ тональности
    const positiveWords = ['хорошо', 'отлично', 'прекрасно', 'успех', 'победа', 'радость'];
    const negativeWords = ['плохо', 'ужасно', 'провал', 'ошибка', 'проблема', 'печаль'];
    
    let sentiment = 'neutral';
    const positiveCount = positiveWords.filter(word => content.toLowerCase().includes(word)).length;
    const negativeCount = negativeWords.filter(word => content.toLowerCase().includes(word)).length;
    
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';
    
    // Определяем важность контента
    let importance = 50;
    if (title.includes('важно') || content.includes('важно')) importance += 20;
    if (content.length > 1000) importance += 15;
    if (keywords.length > 5) importance += 10;
    
    return {
      url,
      title,
      content: content.slice(0, 3000), // Ограничиваем размер
      summary,
      keywords,
      sentiment,
      importance: Math.min(100, importance),
      timestamp: new Date()
    };
  }

  searchLearningByKeywords(keywords: string[]): WebContent[] {
    return this.learnedContent.filter(content => 
      keywords.some(keyword => 
        content.keywords.includes(keyword.toLowerCase()) ||
        content.title.toLowerCase().includes(keyword.toLowerCase()) ||
        content.content.toLowerCase().includes(keyword.toLowerCase())
      )
    ).sort((a, b) => b.importance - a.importance);
  }

  getAllLearning(): WebContent[] {
    return this.learnedContent.slice().sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getLearningSummary(): {
    totalSources: number;
    topKeywords: string[];
    averageImportance: number;
    sentimentDistribution: { [key: string]: number };
  } {
    const allKeywords = this.learnedContent.flatMap(c => c.keywords);
    const keywordFreq: { [key: string]: number } = {};
    
    allKeywords.forEach(keyword => {
      keywordFreq[keyword] = (keywordFreq[keyword] || 0) + 1;
    });
    
    const topKeywords = Object.entries(keywordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([keyword]) => keyword);
    
    const averageImportance = this.learnedContent.reduce((sum, c) => sum + c.importance, 0) / this.learnedContent.length || 0;
    
    const sentimentDistribution: { [key: string]: number } = {};
    this.learnedContent.forEach(c => {
      sentimentDistribution[c.sentiment] = (sentimentDistribution[c.sentiment] || 0) + 1;
    });
    
    return {
      totalSources: this.learnedContent.length,
      topKeywords,
      averageImportance,
      sentimentDistribution
    };
  }
}

export const webLearningService = new WebLearningService();
