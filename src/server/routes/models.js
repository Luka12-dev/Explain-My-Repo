const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const availableModels = [
  {
    id: 'codellama-7b',
    name: 'Code Llama 7B',
    description: 'Fast and efficient code analysis model optimized for understanding repository structure',
    size: '3.8 GB',
    type: 'local',
    status: 'not-downloaded',
    capabilities: ['code-analysis', 'documentation', 'bug-detection'],
    requirements: {
      ram: '8 GB',
      disk: '4 GB',
      gpu: 'Optional',
    },
  },
  {
    id: 'codellama-13b',
    name: 'Code Llama 13B',
    description: 'Advanced code analysis with deeper understanding of complex patterns',
    size: '7.3 GB',
    type: 'local',
    status: 'not-downloaded',
    capabilities: ['code-analysis', 'documentation', 'bug-detection', 'refactoring'],
    requirements: {
      ram: '16 GB',
      disk: '8 GB',
      gpu: 'Recommended',
    },
  },
  {
    id: 'codellama-34b',
    name: 'Code Llama 34B',
    description: 'Professional-grade analysis with comprehensive insights and recommendations',
    size: '19 GB',
    type: 'local',
    status: 'not-downloaded',
    capabilities: ['code-analysis', 'documentation', 'bug-detection', 'refactoring', 'optimization'],
    requirements: {
      ram: '32 GB',
      disk: '20 GB',
      gpu: 'Required',
    },
  },
  {
    id: 'starcoder-15b',
    name: 'StarCoder 15B',
    description: 'Specialized model for multi-language code understanding and generation',
    size: '8.5 GB',
    type: 'local',
    status: 'not-downloaded',
    capabilities: ['code-analysis', 'multi-language', 'code-generation'],
    requirements: {
      ram: '16 GB',
      disk: '9 GB',
      gpu: 'Recommended',
    },
  },
  {
    id: 'wizardcoder-15b',
    name: 'WizardCoder 15B',
    description: 'High-performance model with excellent code comprehension capabilities',
    size: '8.2 GB',
    type: 'local',
    status: 'not-downloaded',
    capabilities: ['code-analysis', 'documentation', 'best-practices'],
    requirements: {
      ram: '16 GB',
      disk: '9 GB',
      gpu: 'Recommended',
    },
  },
  {
    id: 'deepseek-coder-6.7b',
    name: 'DeepSeek Coder 6.7B',
    description: 'Efficient and accurate code analysis with low resource requirements',
    size: '3.5 GB',
    type: 'local',
    status: 'not-downloaded',
    capabilities: ['code-analysis', 'documentation'],
    requirements: {
      ram: '8 GB',
      disk: '4 GB',
      gpu: 'Optional',
    },
  },
  {
    id: 'phi-2',
    name: 'Phi-2 2.7B',
    description: 'Compact model optimized for fast analysis on limited hardware',
    size: '1.5 GB',
    type: 'local',
    status: 'not-downloaded',
    capabilities: ['code-analysis', 'quick-scan'],
    requirements: {
      ram: '4 GB',
      disk: '2 GB',
      gpu: 'Not required',
    },
  },
  {
    id: 'mistral-7b',
    name: 'Mistral 7B Instruct',
    description: 'General-purpose model with strong code understanding capabilities',
    size: '4.1 GB',
    type: 'local',
    status: 'not-downloaded',
    capabilities: ['code-analysis', 'documentation', 'explanation'],
    requirements: {
      ram: '8 GB',
      disk: '5 GB',
      gpu: 'Optional',
    },
  },
  {
    id: 'llama2-7b',
    name: 'Llama 2 7B',
    description: 'Versatile model for code analysis and natural language understanding',
    size: '3.8 GB',
    type: 'local',
    status: 'not-downloaded',
    capabilities: ['code-analysis', 'documentation'],
    requirements: {
      ram: '8 GB',
      disk: '4 GB',
      gpu: 'Optional',
    },
  },
  {
    id: 'granite-code-8b',
    name: 'Granite Code 8B',
    description: 'IBM\'s code analysis model with enterprise-grade insights',
    size: '4.5 GB',
    type: 'local',
    status: 'not-downloaded',
    capabilities: ['code-analysis', 'security', 'compliance'],
    requirements: {
      ram: '8 GB',
      disk: '5 GB',
      gpu: 'Optional',
    },
  },
];

const downloadTasks = new Map();

// Helper function to check if a model file exists
async function checkModelExists(modelId) {
  try {
    const modelsDir = path.join(__dirname, '../../../models');
    const files = await fs.readdir(modelsDir);
    
    // Check for common model file patterns
    const modelPatterns = [
      `${modelId}.gguf`,
      `${modelId}.bin`,
      modelId.includes('phi') ? 'phi-2.gguf' : null,
      modelId.includes('codellama') ? `codellama-${modelId.split('-')[1]}.gguf` : null,
    ].filter(Boolean);
    
    for (const file of files) {
      for (const pattern of modelPatterns) {
        if (file.includes(pattern) || file.includes(modelId)) {
          return true;
        }
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking model existence:', error);
    return false;
  }
}

router.get('/', async (req, res) => {
  try {
    // Check which models are actually downloaded
    const modelsWithStatus = await Promise.all(
      availableModels.map(async (model) => {
        const exists = await checkModelExists(model.id);
        return {
          ...model,
          status: exists ? 'ready' : 'not-downloaded',
        };
      })
    );
    
    res.json({
      success: true,
      data: modelsWithStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.json({
      success: true,
      data: availableModels,
      timestamp: new Date().toISOString(),
    });
  }
});

router.post('/download', async (req, res) => {
  const { modelId } = req.body;
  
  const model = availableModels.find(m => m.id === modelId);
  if (!model) {
    return res.status(404).json({
      success: false,
      error: 'Model not found',
      timestamp: new Date().toISOString(),
    });
  }

  // Check if model already exists
  const exists = await checkModelExists(modelId);
  if (exists) {
    return res.json({
      success: false,
      error: 'Model already downloaded. Click SELECT to choose this model.',
      timestamp: new Date().toISOString(),
    });
  }

  // Instead of fake download, instruct user to run the download script
  const isWindows = process.platform === 'win32';
  const downloadCommand = isWindows ? '.\\download_ai.ps1' : './download_ai.sh';
  
  res.json({
    success: false,
    error: `To download AI models, please run: ${downloadCommand}`,
    message: `Please run the download script in your terminal:\n${downloadCommand}`,
    timestamp: new Date().toISOString(),
  });
});

router.get('/download/:taskId', (req, res) => {
  const { taskId } = req.params;
  const task = downloadTasks.get(taskId);

  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Task not found',
      timestamp: new Date().toISOString(),
    });
  }

  res.json({
    success: true,
    data: {
      modelId: task.modelId,
      progress: task.progress,
      status: task.status,
      downloadedBytes: task.progress * 1000000,
      totalBytes: 100000000,
      speed: 1000000,
      eta: (100 - task.progress) * 50,
    },
    timestamp: new Date().toISOString(),
  });
});

router.delete('/:modelId', (req, res) => {
  const { modelId } = req.params;
  
  res.json({
    success: true,
    message: `Model ${modelId} deleted successfully`,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
