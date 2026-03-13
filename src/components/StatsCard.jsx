import { motion } from 'framer-motion';

export default function StatsCard({ title, value, icon: Icon, color = 'primary', change, trend }) {
  const colors = {
    primary: 'from-primary-500 to-primary-600',
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="stat-card overflow-hidden relative"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              <span className="mr-1">{trend === 'up' ? '↑' : '↓'}</span>
              {change} from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colors[color]} bg-opacity-10`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${colors[color]}`} />
    </motion.div>
  );
}