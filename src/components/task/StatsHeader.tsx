import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, AlertCircle, TrendingUp, ListTodo } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Stats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  completionRate: number;
  highPriority: number;
}

interface StatsHeaderProps {
  stats: Stats;
}

export const StatsHeader = ({ stats }: StatsHeaderProps) => {
  const statCards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: <ListTodo className="w-5 h-5" />,
      color: 'bg-slate-500',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-600',
    },
    {
      label: 'To Do',
      value: stats.todo,
      icon: <Circle className="w-5 h-5" />,
      color: 'bg-slate-400',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-600',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: <Clock className="w-5 h-5" />,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Completed',
      value: stats.done,
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              relative overflow-hidden rounded-xl p-4 
              ${card.bgColor} border border-slate-100
              hover:shadow-md transition-shadow duration-200
            `}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm font-medium ${card.textColor}`}>{card.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} text-white p-2 rounded-lg`}>
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-5 text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Completion Progress</h3>
              <p className="text-sm text-slate-300">
                {stats.completionRate}% of tasks completed
              </p>
            </div>
          </div>
          
          {stats.highPriority > 0 && (
            <div className="flex items-center gap-2 bg-rose-500/20 text-rose-300 px-3 py-1.5 rounded-full text-sm">
              <AlertCircle className="w-4 h-4" />
              {stats.highPriority} high priority pending
            </div>
          )}
        </div>

        <div className="relative">
          <Progress 
            value={stats.completionRate} 
            className="h-3 bg-white/10"
          />
          <div 
            className="absolute top-0 left-0 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>

        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </motion.div>
    </div>
  );
};
