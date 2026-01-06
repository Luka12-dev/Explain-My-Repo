import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';
import type { DirectoryNode } from '@/types';

interface FileStructureTreeProps {
  structure: DirectoryNode;
  maxDepth?: number;
}

interface TreeNodeProps {
  node: DirectoryNode;
  depth: number;
  maxDepth: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, depth, maxDepth }) => {
  const [isExpanded, setIsExpanded] = useState(depth < 2);

  if (depth > maxDepth) {
    return null;
  }

  const isDirectory = node.type === 'directory';
  const hasChildren = node.children && node.children.length > 0;

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex items-center space-x-2 py-1 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 smooth-transition cursor-pointer ${
          depth === 0 ? 'font-semibold' : ''
        }`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={() => isDirectory && setIsExpanded(!isExpanded)}
      >
        {isDirectory && hasChildren && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={16} className="text-gray-500" />
          </motion.div>
        )}
        {!isDirectory && <div className="w-4" />}

        {isDirectory ? (
          isExpanded ? (
            <FolderOpen size={16} className="text-blue-500" />
          ) : (
            <Folder size={16} className="text-blue-500" />
          )
        ) : (
          <File size={16} className="text-gray-400" />
        )}

        <span className="flex-1 text-sm text-gray-900 dark:text-white truncate">
          {node.name}
        </span>

        {!isDirectory && node.size && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatSize(node.size)}
          </span>
        )}

        {isDirectory && node.children && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {node.children.length} items
          </span>
        )}
      </motion.div>

      <AnimatePresence>
        {isDirectory && hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {node.children!.map((child, index) => (
              <TreeNode key={index} node={child} depth={depth + 1} maxDepth={maxDepth} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FileStructureTree: React.FC<FileStructureTreeProps> = ({
  structure,
  maxDepth = 5,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        File Structure
      </h3>
      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        <TreeNode node={structure} depth={0} maxDepth={maxDepth} />
      </div>
    </motion.div>
  );
};

export default FileStructureTree;
