import { motion } from 'framer-motion';
import { ClipboardList, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  type: 'no-tasks' | 'no-results';
  onCreateClick?: () => void;
  onClearFilters?: () => void;
}

export const EmptyState = ({ type, onCreateClick, onClearFilters }: EmptyStateProps) => {
  if (type === 'no-results') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="bg-slate-100 p-4 rounded-full mb-4">
          <Search className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          No tasks found
        </h3>
        <p className="text-slate-500 max-w-sm mb-6">
          No tasks match your current filters. Try adjusting your search or filters.
        </p>
        {onClearFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="h-11"
          >
            Clear Filters
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-6 rounded-2xl mb-6">
        <ClipboardList className="w-12 h-12 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3">
        No tasks yet
      </h3>
      <p className="text-slate-500 max-w-sm mb-8">
        Get started by creating your first task. Stay organized and track your progress!
      </p>
      {onCreateClick && (
        <Button
          onClick={onCreateClick}
          className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Your First Task
        </Button>
      )}
    </motion.div>
  );
};
