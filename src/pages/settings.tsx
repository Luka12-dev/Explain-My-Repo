import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { useSettingsStore } from '@/store/settingsStore';
import { useThemeStore } from '@/store/themeStore';
import { apiClient } from '@/lib/api';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Download, 
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import type { AIModel } from '@/types';

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { 
    animations, 
    autoSave, 
    selectedModel,
    models,
    updateSettings,
    setModels,
    updateModel,
    setSelectedModel 
  } = useSettingsStore();
  
  const [loading, setLoading] = useState(true);
  const [downloadingModel, setDownloadingModel] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const response = await apiClient.getAvailableModels();
      if (response.success && response.data) {
        setModels(response.data);
      }
    } catch (error) {
      console.error('Failed to load models:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadModel = async (modelId: string) => {
    try {
      const response = await apiClient.downloadModel(modelId);
      if (!response.success) {
        // Show the download script instruction
        alert(response.error || response.message || 'Please run ./download_ai.ps1 (Windows) or ./download_ai.sh (Linux/Mac) to download AI models.');
      }
    } catch (error: any) {
      console.error('Failed to download model:', error);
      alert(error.message || 'Please run ./download_ai.ps1 (Windows) or ./download_ai.sh (Linux/Mac) to download AI models.');
    }
  };

  const handleDeleteModel = async (modelId: string) => {
    try {
      await apiClient.deleteModel(modelId);
      updateModel(modelId, { status: 'not-downloaded' });
    } catch (error) {
      console.error('Failed to delete model:', error);
    }
  };

  const handleSaveSettings = () => {
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  return (
    <MainLayout title="Settings - Explain My Repo">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center space-x-3">
            <SettingsIcon size={36} className="text-liquid-blue-500 dark:text-white" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Settings</h1>
          </div>

          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            >
              <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
                <CheckCircle2 size={20} />
                <span>{saveMessage}</span>
              </div>
            </motion.div>
          )}

          <div className="card">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Appearance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Theme</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose between Liquid Blue and Liquid Dark themes
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-3 px-6 py-3 rounded-xl bg-liquid-blue-100 dark:bg-liquid-dark-200 hover:scale-105 smooth-transition"
                >
                  {theme === 'liquid-dark' ? (
                    <>
                      <Moon size={20} className="text-white" />
                      <span className="font-semibold text-white">Dark</span>
                    </>
                  ) : (
                    <>
                      <Sun size={20} className="text-liquid-blue-600" />
                      <span className="font-semibold text-liquid-blue-600">Light</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Animations</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enable smooth animations and transitions
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={animations}
                    onChange={(e) => {
                      updateSettings({ animations: e.target.checked });
                      handleSaveSettings();
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-liquid-blue-300 dark:peer-focus:ring-liquid-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-liquid-blue-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Auto Save</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically save analysis results
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => {
                      updateSettings({ autoSave: e.target.checked });
                      handleSaveSettings();
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-liquid-blue-300 dark:peer-focus:ring-liquid-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-liquid-blue-500"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">AI Models</h2>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-liquid-blue-500" size={48} />
              </div>
            ) : (
              <div className="space-y-4">
                {models.length > 0 ? (
                  models.map((model) => (
                    <div
                      key={model.id}
                      className={`p-4 rounded-xl border-2 smooth-transition ${
                        selectedModel === model.id
                          ? 'border-liquid-blue-500 dark:border-white bg-liquid-blue-50 dark:bg-liquid-dark-200'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                              {model.name}
                            </h3>
                            {model.status === 'ready' && (
                              <CheckCircle2 className="text-green-500" size={20} />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {model.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Size: {model.size}</span>
                            <span>RAM: {model.requirements.ram}</span>
                            <span>Type: {model.type}</span>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          {model.status === 'not-downloaded' && (
                            <button
                              onClick={() => handleDownloadModel(model.id)}
                              className="btn-secondary px-4 py-2 text-sm flex items-center space-x-2"
                            >
                              <Download size={16} />
                              <span>Download</span>
                            </button>
                          )}
                          
                          {model.status === 'ready' && (
                            <button
                              onClick={() => {
                                setSelectedModel(model.id);
                                handleSaveSettings();
                              }}
                              className={`px-4 py-2 text-sm flex items-center space-x-2 smooth-transition ${
                                selectedModel === model.id
                                  ? 'btn-primary'
                                  : 'btn-secondary'
                              }`}
                            >
                              <CheckCircle2 size={16} />
                              <span>{selectedModel === model.id ? 'Selected' : 'Select'}</span>
                            </button>
                          )}
                          
                          {model.status === 'downloading' && (
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 text-sm text-liquid-blue-600">
                                <Loader2 className="animate-spin" size={16} />
                                <span>{model.downloadProgress}%</span>
                              </div>
                              <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-liquid-blue-500 smooth-transition"
                                  style={{ width: `${model.downloadProgress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {model.status === 'ready' && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedModel(model.id);
                                  handleSaveSettings();
                                }}
                                className={`px-4 py-2 text-sm rounded-lg smooth-transition ${
                                  selectedModel === model.id
                                    ? 'bg-liquid-blue-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                              >
                                {selectedModel === model.id ? 'Selected' : 'Select'}
                              </button>
                              <button
                                onClick={() => handleDeleteModel(model.id)}
                                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 smooth-transition"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}

                          {model.status === 'error' && (
                            <div className="flex items-center space-x-2 text-red-500 text-sm">
                              <AlertCircle size={16} />
                              <span>Error</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No models available. Please check your server connection.
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
