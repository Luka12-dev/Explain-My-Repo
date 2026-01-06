const fs = require('fs').promises;
const path = require('path');

class HistoryService {
  constructor() {
    this.historyFile = path.join(__dirname, '../../../data/history.json');
    this.ensureDataDirectory();
  }

  async ensureDataDirectory() {
    const dataDir = path.join(__dirname, '../../../data');
    try {
      await fs.mkdir(dataDir, { recursive: true });
    } catch (error) {
      console.error('Error creating data directory:', error);
    }
  }

  /**
   * Load all history entries
   */
  async loadHistory() {
    try {
      const data = await fs.readFile(this.historyFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist yet, return empty array
        return [];
      }
      console.error('Error loading history:', error);
      return [];
    }
  }

  /**
   * Save a new analysis to history
   */
  async saveAnalysis(analysisData) {
    try {
      const history = await this.loadHistory();
      
      const historyEntry = {
        id: Date.now().toString(),
        repositoryName: analysisData.repository.name,
        repositoryFullName: analysisData.repository.fullName,
        repositoryUrl: analysisData.repository.url,
        status: 'completed',
        timestamp: new Date().toISOString(),
        duration: analysisData.duration || 0,
        summary: analysisData.aiInsights?.summary || 'No summary available',
        data: analysisData, // Store full analysis data
      };

      // Add to beginning of array (newest first)
      history.unshift(historyEntry);

      // Keep only last 100 entries
      const trimmedHistory = history.slice(0, 100);

      await fs.writeFile(
        this.historyFile,
        JSON.stringify(trimmedHistory, null, 2),
        'utf-8'
      );

      console.log(`Saved analysis to history: ${analysisData.repository.fullName}`);
      return historyEntry;
    } catch (error) {
      console.error('Error saving analysis to history:', error);
      throw error;
    }
  }

  /**
   * Get a specific analysis by ID
   */
  async getAnalysisById(id) {
    try {
      const history = await this.loadHistory();
      return history.find(entry => entry.id === id);
    } catch (error) {
      console.error('Error getting analysis by ID:', error);
      return null;
    }
  }

  /**
   * Delete a history entry
   */
  async deleteAnalysis(id) {
    try {
      const history = await this.loadHistory();
      const filtered = history.filter(entry => entry.id !== id);
      
      await fs.writeFile(
        this.historyFile,
        JSON.stringify(filtered, null, 2),
        'utf-8'
      );

      console.log(`Deleted analysis from history: ${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting analysis:', error);
      return false;
    }
  }

  /**
   * Clear all history
   */
  async clearHistory() {
    try {
      await fs.writeFile(this.historyFile, JSON.stringify([], null, 2), 'utf-8');
      console.log('Cleared all history');
      return true;
    } catch (error) {
      console.error('Error clearing history:', error);
      return false;
    }
  }

  /**
   * Get history summary (without full data)
   */
  async getHistorySummary() {
    try {
      const history = await this.loadHistory();
      return history.map(entry => ({
        id: entry.id,
        repositoryName: entry.repositoryName,
        repositoryFullName: entry.repositoryFullName,
        repositoryUrl: entry.repositoryUrl,
        status: entry.status,
        timestamp: entry.timestamp,
        duration: entry.duration,
        summary: entry.summary,
      }));
    } catch (error) {
      console.error('Error getting history summary:', error);
      return [];
    }
  }
}

module.exports = new HistoryService();
