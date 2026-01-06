const express = require('express');
const router = express.Router();
const historyService = require('../services/historyService');

// Get all history entries (summary only)
router.get('/', async (req, res) => {
  try {
    const history = await historyService.getHistorySummary();
    res.json({
      success: true,
      data: history,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Get specific analysis by ID (with full data)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = await historyService.getAnalysisById(id);
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found',
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Delete a history entry
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await historyService.deleteAnalysis(id);
    
    res.json({
      success,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error deleting analysis:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Clear all history
router.delete('/', async (req, res) => {
  try {
    const success = await historyService.clearHistory();
    
    res.json({
      success,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
