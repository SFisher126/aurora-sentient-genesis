
interface ConversationMemory {
  messages: any[];
  metadata: any;
}

interface UserFact {
  text: string;
  category: string;
  timestamp: Date;
}

interface LearningMaterial {
  url: string;
  content: string;
  analysis: any;
  timestamp: Date;
}

class MemoryService {
  private storageKey = 'anyuta_memory';

  saveConversation(messages: any[], metadata: any = {}) {
    const memory: ConversationMemory = {
      messages,
      metadata: {
        ...metadata,
        lastSaved: new Date()
      }
    };
    
    localStorage.setItem(this.storageKey, JSON.stringify(memory));
    console.log('💾 Conversation saved to memory');
  }

  loadConversation(): ConversationMemory | null {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const memory = JSON.parse(saved);
        
        // Convert timestamp strings back to Date objects
        const messagesWithDates = (memory.messages || []).map((message: any) => ({
          ...message,
          timestamp: message.timestamp ? new Date(message.timestamp) : new Date()
        }));
        
        return {
          ...memory,
          messages: messagesWithDates
        };
      }
    } catch (error) {
      console.error('Memory loading error:', error);
    }
    return null;
  }

  saveUserFact(text: string, category: string = 'general') {
    const facts = this.getUserFacts();
    const newFact: UserFact = {
      text,
      category,
      timestamp: new Date()
    };
    
    facts.push(newFact);
    localStorage.setItem('anyuta_user_facts', JSON.stringify(facts));
  }

  getUserFacts(): UserFact[] {
    try {
      const saved = localStorage.getItem('anyuta_user_facts');
      if (saved) {
        const facts = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
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

  getConversationContext(): string {
    const memory = this.loadConversation();
    if (!memory || !memory.messages) return '';
    
    const recentMessages = memory.messages.slice(-10);
    return recentMessages.map(m => `${m.sender}: ${m.text}`).join('\n');
  }

  findRelatedMemories(query: string): any[] {
    const facts = this.getUserFacts();
    const lowerQuery = query.toLowerCase();
    
    return facts.filter(fact => 
      fact.text.toLowerCase().includes(lowerQuery)
    );
  }

  saveLearningMaterial(url: string, analysis: any) {
    const materials = this.getLearningMaterials();
    const newMaterial: LearningMaterial = {
      url,
      content: analysis.summary || '',
      analysis,
      timestamp: new Date()
    };
    
    materials.push(newMaterial);
    localStorage.setItem('anyuta_learning_materials', JSON.stringify(materials.slice(-50)));
    console.log('📚 Learning material saved:', url);
  }

  getLearningMaterials(): LearningMaterial[] {
    try {
      const saved = localStorage.getItem('anyuta_learning_materials');
      if (saved) {
        const materials = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        return materials.map((material: any) => ({
          ...material,
          timestamp: material.timestamp ? new Date(material.timestamp) : new Date()
        }));
      }
      return [];
    } catch {
      return [];
    }
  }

  updateMessageConnection(messageId: string, connection: any) {
    // Сохраняем связь сообщения для обучения
    const connections = this.getMessageConnections();
    connections[messageId] = connection;
    localStorage.setItem('anyuta_message_connections', JSON.stringify(connections));
  }

  private getMessageConnections(): Record<string, any> {
    try {
      const saved = localStorage.getItem('anyuta_message_connections');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }
}

export const memoryService = new MemoryService();
