import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { TaskFilter } from '@/types/task';

interface FilterBarProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  categories: string[];
}

export const FilterBar = ({ filter, onFilterChange }: FilterBarProps) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={filter.search}
          onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
          placeholder="Search tasks..."
          className="pl-10 h-11 border-slate-200"
        />
        {filter.search && (
          <button
            onClick={() => onFilterChange({ ...filter, search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
