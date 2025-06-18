
interface ConversationMemory {
  messages: any[];
  contextData: any;
  learningHistory: any[];
  personalityState: any;
  lastUpdated: Date;
}

class MemoryService {
  private storageKey = 'anyuta_conversation_memory';
  private learningKey = 'anyuta_learning_data';
  private contextKey = 'anyuta_context_data';

  saveConversation(messages: any[], context?: any) {
    const memory: ConversationMemory = {
      messages,
      contextData: context || {},
      learningHistory: this.getLearningHistory(),
      personalityState: this.getPersonalityState(),
      lastUpdated: new Date()
    };
    
    localStorage.setItem(this.storageKey, JSON.stringify(memory));
    console.log('💾 Conversation saved to memory', { messageCount: messages.length });
  }

  loadConversation(): ConversationMemory | null {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const memory = JSON.parse(saved);
        console.log('🧠 Memory loaded', { messageCount: memory.messages?.length || 0 });
        return memory;
      }
    } catch (error) {
      console.error('Memory loading error:', error);
    }
    return null;
  }

  saveLearningMaterial(url: string, content: string, analysis: any) {
    const existing = this.getLearningHistory();
    const newLearning = {
      id: Date.now().toString(),
      url,
      content: content.slice(0, 2000), // Ограничиваем размер
      analysis,
      timestamp: new Date(),
      importance: analysis.importance || Math.random() * 100
    };
    
    existing.push(newLearning);
    localStorage.setItem(this.learningKey, JSON.stringify(existing.slice(-50))); // Храним последние 50
    console.log('📚 Learning material saved:', url);
  }

  getLearningHistory(): any[] {
    try {
      const saved = localStorage.getItem(this.learningKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  savePersonalityState(state: any) {
    localStorage.setItem('anyuta_personality', JSON.stringify(state));
  }

  getPersonalityState(): any {
    try {
      const saved = localStorage.getItem('anyuta_personality');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  clearMemory() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.learningKey);
    localStorage.removeItem('anyuta_personality');
    console.log('🗑️ Memory cleared');
  }

  exportMemory(): string {
    const memory = this.loadConversation();
    const learning = this.getLearningHistory();
    const personality = this.getPersonalityState();
    
    return JSON.stringify({
      memory,
      learning,
      personality,
      exportDate: new Date()
    }, null, 2);
  }

  importMemory(data: string): boolean {
    try {
      const imported = JSON.parse(data);
      
      if (imported.memory) {
        localStorage.setItem(this.storageKey, JSON.stringify(imported.memory));
      }
      if (imported.learning) {
        localStorage.setItem(this.learningKey, JSON.stringify(imported.learning));
      }
      if (imported.personality) {
        localStorage.setItem('anyuta_personality', JSON.stringify(imported.personality));
      }
      
      console.log('📥 Memory imported successfully');
      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  }

  // Анализ и связывание воспоминаний
  findRelatedMemories(query: string, limit: number = 5): any[] {
    const memory = this.loadConversation();
    const learning = this.getLearningHistory();
    
    if (!memory?.messages) return [];
    
    const queryLower = query.toLowerCase();
    const relatedMessages = memory.messages.filter(msg => 
      msg.text.toLowerCase().includes(queryLower) ||
      msg.thoughts?.some((thought: string) => thought.toLowerCase().includes(queryLower))
    );
    
    const relatedLearning = learning.filter(item =>
      item.content.toLowerCase().includes(queryLower) ||
      item.analysis?.topic?.toLowerCase().includes(queryLower)
    );
    
    return [...relatedMessages.slice(-limit), ...relatedLearning.slice(-limit)];
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
