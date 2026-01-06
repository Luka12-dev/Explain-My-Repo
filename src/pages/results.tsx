import React, { useState } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { useAnalysisStore } from '@/store/analysisStore';
import { 
  Code, 
  FileText, 
  Shield, 
  TrendingUp,
  GitBranch,
  Users,
  Calendar,
  Star,
  Download,
  ChevronDown,
  ChevronUp,
  FileJson,
  FileType
} from 'lucide-react';

const ResultsPage: React.FC = () => {
  const router = useRouter();
  const { currentAnalysis: storeAnalysis } = useAnalysisStore();
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    code: true,
    quality: true,
    security: true,
    insights: true,
  });
  const [showExportMenu, setShowExportMenu] = useState(false);

  React.useEffect(() => {
    // Try to load from localStorage first (from history)
    const stored = localStorage.getItem('currentAnalysis');
    if (stored) {
      try {
        setCurrentAnalysis(JSON.parse(stored));
        localStorage.removeItem('currentAnalysis'); // Clean up
      } catch (error) {
        console.error('Failed to parse stored analysis:', error);
        setCurrentAnalysis(storeAnalysis);
      }
    } else {
      setCurrentAnalysis(storeAnalysis);
    }
  }, [storeAnalysis]);

  if (!currentAnalysis) {
    return (
      <MainLayout title="Results - Explain My Repo">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">No analysis found</h1>
          <button onClick={() => router.push('/')} className="btn-primary">
            Start New Analysis
          </button>
        </div>
      </MainLayout>
    );
  }

  const { repository, codeAnalysis, qualityMetrics, securityAnalysis, aiInsights } = currentAnalysis;

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(currentAnalysis, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${repository.name}-analysis.json`;
    link.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportAsText = () => {
    let text = `REPOSITORY ANALYSIS REPORT\n`;
    text += `${'='.repeat(80)}\n\n`;
    text += `Repository: ${repository.fullName}\n`;
    text += `Description: ${repository.description || 'N/A'}\n`;
    text += `Language: ${repository.language}\n`;
    text += `License: ${repository.license || 'None'}\n`;
    text += `Stars: ${repository.stars.toLocaleString()}\n`;
    text += `Forks: ${repository.forks.toLocaleString()}\n`;
    text += `Open Issues: ${repository.openIssues}\n\n`;
    
    text += `CODE ANALYSIS\n`;
    text += `${'-'.repeat(80)}\n`;
    text += `Total Files: ${codeAnalysis.totalFiles}\n`;
    text += `Total Lines: ${codeAnalysis.totalLines.toLocaleString()}\n`;
    text += `Code Lines: ${codeAnalysis.codeLines.toLocaleString()}\n`;
    text += `Comment Lines: ${codeAnalysis.commentLines.toLocaleString()}\n`;
    text += `Blank Lines: ${codeAnalysis.blankLines.toLocaleString()}\n\n`;
    
    text += `Languages:\n`;
    codeAnalysis.languages.forEach(lang => {
      text += `  - ${lang.language}: ${lang.percentage.toFixed(1)}% (${lang.files} files)\n`;
    });
    text += `\n`;
    
    text += `QUALITY METRICS\n`;
    text += `${'-'.repeat(80)}\n`;
    text += `Overall Score: ${qualityMetrics.overallScore}/100\n`;
    text += `Code Quality: ${qualityMetrics.codeQuality}/100\n`;
    text += `Documentation: ${qualityMetrics.documentation}/100\n`;
    text += `Testing: ${qualityMetrics.testing}/100\n`;
    text += `Maintainability: ${qualityMetrics.maintainability}/100\n`;
    text += `Security: ${qualityMetrics.security}/100\n\n`;
    
    text += `SECURITY ANALYSIS\n`;
    text += `${'-'.repeat(80)}\n`;
    text += `Security Rating: ${securityAnalysis.overallRating}\n`;
    text += `Vulnerabilities Found: ${securityAnalysis.vulnerabilities.length}\n\n`;
    
    text += `AI INSIGHTS\n`;
    text += `${'-'.repeat(80)}\n`;
    text += `Summary:\n${aiInsights.summary}\n\n`;
    text += `Key Features:\n`;
    aiInsights.keyFeatures.forEach((feature, i) => {
      text += `  ${i + 1}. ${feature}\n`;
    });
    
    const dataBlob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${repository.name}-analysis.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportAsPDF = () => {
    // For PDF, we'll create a formatted HTML and convert it
    alert('PDF export will be implemented with a library like jsPDF or html2pdf. For now, please use JSON or TXT export.');
    setShowExportMenu(false);
  };

  return (
    <MainLayout title={`Results: ${repository.fullName} - Explain My Repo`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {repository.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{repository.description}</p>
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="btn-primary flex items-center space-x-2"
              >
                <Download size={20} />
                <span>Export</span>
                <ChevronDown size={16} className={`smooth-transition ${showExportMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-liquid-dark-100 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                >
                  <button
                    onClick={exportAsJSON}
                    className="w-full px-4 py-3 text-left hover:bg-liquid-blue-50 dark:hover:bg-liquid-dark-200 smooth-transition flex items-center space-x-3"
                  >
                    <FileJson size={18} className="text-liquid-blue-500" />
                    <span className="font-medium">Export as JSON</span>
                  </button>
                  <button
                    onClick={exportAsText}
                    className="w-full px-4 py-3 text-left hover:bg-liquid-blue-50 dark:hover:bg-liquid-dark-200 smooth-transition flex items-center space-x-3"
                  >
                    <FileType size={18} className="text-green-500" />
                    <span className="font-medium">Export as TXT</span>
                  </button>
                  <button
                    onClick={exportAsPDF}
                    className="w-full px-4 py-3 text-left hover:bg-liquid-blue-50 dark:hover:bg-liquid-dark-200 smooth-transition flex items-center space-x-3"
                  >
                    <FileText size={18} className="text-red-500" />
                    <span className="font-medium">Export as PDF</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card">
              <div className="flex items-center space-x-3">
                <Star className="text-yellow-500" size={24} />
                <div>
                  <div className="text-2xl font-bold">{repository.stars.toLocaleString()}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Stars</div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center space-x-3">
                <GitBranch className="text-liquid-blue-500" size={24} />
                <div>
                  <div className="text-2xl font-bold">{repository.forks.toLocaleString()}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Forks</div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center space-x-3">
                <Code className="text-green-500" size={24} />
                <div>
                  <div className="text-2xl font-bold">{codeAnalysis.totalFiles}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Files</div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center space-x-3">
                <FileText className="text-purple-500" size={24} />
                <div>
                  <div className="text-2xl font-bold">{codeAnalysis.totalLines.toLocaleString()}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Lines</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <button
              onClick={() => toggleSection('overview')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Repository Overview</h2>
              {expandedSections.overview ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expandedSections.overview && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Language</span>
                    <div className="font-semibold">{repository.language}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">License</span>
                    <div className="font-semibold">{repository.license || 'None'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Open Issues</span>
                    <div className="font-semibold">{repository.openIssues}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <button
              onClick={() => toggleSection('code')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Code Analysis</h2>
              {expandedSections.code ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expandedSections.code && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Languages</h3>
                  <div className="space-y-2">
                    {codeAnalysis.languages.slice(0, 5).map((lang) => (
                      <div key={lang.language}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{lang.language}</span>
                          <span>{lang.percentage.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-liquid-dark-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-liquid-blue-400 to-liquid-blue-500"
                            style={{ width: `${lang.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Code Lines</span>
                    <div className="text-xl font-bold">{codeAnalysis.codeLines.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Comments</span>
                    <div className="text-xl font-bold">{codeAnalysis.commentLines.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Blank Lines</span>
                    <div className="text-xl font-bold">{codeAnalysis.blankLines.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <button
              onClick={() => toggleSection('quality')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quality Metrics</h2>
              {expandedSections.quality ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expandedSections.quality && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Overall Score', value: qualityMetrics.overallScore, color: 'blue' },
                    { label: 'Code Quality', value: qualityMetrics.codeQuality, color: 'green' },
                    { label: 'Documentation', value: qualityMetrics.documentation, color: 'purple' },
                    { label: 'Testing', value: qualityMetrics.testing, color: 'yellow' },
                    { label: 'Maintainability', value: qualityMetrics.maintainability, color: 'indigo' },
                    { label: 'Security', value: qualityMetrics.security, color: 'red' },
                  ].map((metric) => (
                    <div key={metric.label} className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-2">
                        <svg className="transform -rotate-90 w-24 h-24">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-300 dark:text-gray-500"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - metric.value / 100)}`}
                            className="text-liquid-blue-500 dark:text-white"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold">{metric.value}</span>
                        </div>
                      </div>
                      <div className="text-sm font-medium">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <button
              onClick={() => toggleSection('security')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Analysis</h2>
              {expandedSections.security ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expandedSections.security && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <Shield className="text-green-500" size={32} />
                  <div>
                    <div className="font-semibold text-lg">Security Rating: {securityAnalysis.overallRating}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {securityAnalysis.vulnerabilities.length} vulnerabilities found
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <button
              onClick={() => toggleSection('insights')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Insights</h2>
              {expandedSections.insights ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expandedSections.insights && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <p className="text-gray-700 dark:text-gray-300">{aiInsights.summary}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Key Features</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {aiInsights.keyFeatures.map((feature, i) => (
                      <li key={i} className="text-gray-700 dark:text-gray-300">{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default ResultsPage;
