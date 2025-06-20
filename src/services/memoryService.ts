
import { authService } from './authService';

interface ConversationMemory {
  messages: any[];
  contextData: any;
  learningHistory: any[];
  personalityState: any;
  lastUpdated: Date;
  userId: string;
  conversationContext: string[];
}

class MemoryService {
  private getStorageKey(suffix: string): string {
    const userKey = authService.getUserStorageKey();
    return `${userKey}_${suffix}`;
  }

  saveConversation(messages: any[], context?: any) {
    const userId = authService.getCurrentUser()?.id || 'guest';
    
    // Создаем контекст диалога - последние важные сообщения
    const conversationContext = messages.slice(-20).map(msg => 
      `${msg.sender === 'user' ? 'Пользователь' : 'Анюта'}: ${msg.text}`
    );
    
    const memory: ConversationMemory = {
      messages,
      contextData: context || {},
      learningHistory: this.getLearningHistory(),
      personalityState: this.getPersonalityState(),
      lastUpdated: new Date(),
      userId,
      conversationContext
    };
    
    localStorage.setItem(this.getStorageKey('conversation_memory'), JSON.stringify(memory));
    console.log('💾 Conversation saved to memory', { 
      messageCount: messages.length, 
      userId,
      contextSize: conversationContext.length 
    });
  }

  loadConversation(): ConversationMemory | null {
    try {
      const saved = localStorage.getItem(this.getStorageKey('conversation_memory'));
      if (saved) {
        const memory = JSON.parse(saved);
        
        // Восстанавливаем объекты Date из строк
        if (memory.messages) {
          memory.messages = memory.messages.map((msg: any) => ({
            ...msg,
            timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
          }));
        }
        
        if (memory.lastUpdated) {
          memory.lastUpdated = new Date(memory.lastUpdated);
        }
        
        console.log('🧠 Memory loaded', { 
          messageCount: memory.messages?.length || 0,
          userId: memory.userId,
          contextSize: memory.conversationContext?.length || 0
        });
        return memory;
      }
    } catch (error) {
      console.error('Memory loading error:', error);
    }
    return null;
  }

  getConversationContext(): string {
    const memory = this.loadConversation();
    if (memory?.conversationContext) {
      return memory.conversationContext.join('\n');
    }
    return '';
  }

  saveLearningMaterial(url: string, content: string, analysis: any) {
    const existing = this.getLearningHistory();
    const userId = authService.getCurrentUser()?.id || 'guest';
    
    const newLearning = {
      id: Date.now().toString(),
      url,
      content: content.slice(0, 2000),
      analysis,
      timestamp: new Date(),
      importance: analysis.importance || Math.random() * 100,
      userId
    };
    
    existing.push(newLearning);
    localStorage.setItem(this.getStorageKey('learning_data'), JSON.stringify(existing.slice(-50)));
    console.log('📚 Learning material saved:', url, 'for user:', userId);
  }

  getLearningHistory(): any[] {
    try {
      const saved = localStorage.getItem(this.getStorageKey('learning_data'));
      if (saved) {
        const history = JSON.parse(saved);
        return history.map((item: any) => ({
          ...item,
          timestamp: item.timestamp ? new Date(item.timestamp) : new Date()
        }));
      }
      return [];
    } catch {
      return [];
    }
  }

  savePersonalityState(state: any) {
    const userId = authService.getCurrentUser()?.id || 'guest';
    localStorage.setItem(this.getStorageKey('personality'), JSON.stringify({
      ...state,
      userId,
      lastUpdated: new Date()
    }));
  }

  getPersonalityState(): any {
    try {
      const saved = localStorage.getItem(this.getStorageKey('personality'));
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  // Новый метод для сохранения важных фактов о пользователе
  saveUserFact(fact: string, category: string = 'general') {
    const facts = this.getUserFacts();
    const newFact = {
      id: Date.now().toString(),
      text: fact,
      category,
      timestamp: new Date(),
      importance: 100
    };
    
    facts.push(newFact);
    localStorage.setItem(this.getStorageKey('user_facts'), JSON.stringify(facts.slice(-100)));
    console.log('💡 User fact saved:', fact);
  }

  getUserFacts(): any[] {
    try {
      const saved = localStorage.getItem(this.getStorageKey('user_facts'));
      if (saved) {
        const facts = JSON.parse(saved);
        return facts.map((fact: any) => ({
          ...fact,
          timestamp: fact.timestamp ? new Date(fact.timestamp) : new Date()
        }));
      }
      return [];
    } catch {
      return [];
    }
  }

  // Улучшенный поиск связанных воспоминаний с контекстом
  findRelatedMemories(query: string, limit: number = 10): any[] {
    const memory = this.loadConversation();
    const learning = this.getLearningHistory();
    const facts = this.getUserFacts();
    
    if (!memory?.messages) return [];
    
    const queryLower = query.toLowerCase();
    
    // Поиск в сообщениях
    const relatedMessages = memory.messages.filter(msg => 
      msg.text.toLowerCase().includes(queryLower) ||
      msg.thoughts?.some((thought: string) => thought.toLowerCase().includes(queryLower))
    ).slice(-5);
    
    // Поиск в изученном материале
    const relatedLearning = learning.filter(item =>
      item.content.toLowerCase().includes(queryLower) ||
      item.analysis?.topic?.toLowerCase().includes(queryLower)
    ).slice(-3);
    
    // Поиск в фактах о пользователе
    const relatedFacts = facts.filter(fact =>
      fact.text.toLowerCase().includes(queryLower)
    ).slice(-2);
    
    return [...relatedMessages, ...relatedLearning, ...relatedFacts];
  }

  clearMemory() {
    const keys = [
      this.getStorageKey('conversation_memory'),
      this.getStorageKey('learning_data'),
      this.getStorageKey('personality'),
      this.getStorageKey('user_facts')
    ];
    
    keys.forEach(key => localStorage.removeItem(key));
    console.log('🗑️ Memory cleared for current user');
  }

  exportMemory(): string {
    const memory = this.loadConversation();
    const learning = this.getLearningHistory();
    const personality = this.getPersonalityState();
    const facts = this.getUserFacts();
    const userId = authService.getCurrentUser()?.id || 'guest';
    
    return JSON.stringify({
      memory,
      learning,
      personality,
      facts,
      userId,
      exportDate: new Date()
    }, null, 2);
  }

  importMemory(data: string): boolean {
    try {
      const imported = JSON.parse(data);
      
      if (imported.memory) {
        localStorage.setItem(this.getStorageKey('conversation_memory'), JSON.stringify(imported.memory));
      }
      if (imported.learning) {
        localStorage.setItem(this.getStorageKey('learning_data'), JSON.stringify(imported.learning));
      }
      if (imported.personality) {
        localStorage.setItem(this.getStorageKey('personality'), JSON.stringify(imported.personality));
      }
      if (imported.facts) {
        localStorage.setItem(this.getStorageKey('user_facts'), JSON.stringify(imported.facts));
      }
      
      console.log('📥 Memory imported successfully for current user');
      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  }

  updateMessageConnection(messageId: string, connectionData: any) {
    const memory = this.loadConversation();
    if (memory?.messages) {
      memory.messages = memory.messages.map(msg => 
        msg.id === messageId 
          ? { ...msg, connections: [...(msg.connections || []), connectionData] }
          : msg
      );
      this.saveConversation(memory.messages, memory.contextData);
    }
  }
}

export const memoryService = new MemoryService();
