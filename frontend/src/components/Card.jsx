const Card = ({ title, value, icon: Icon, color, subtitle }) => {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
    },
    green: {
      bg: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
    },
    orange: {
      bg: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-100',
      iconText: 'text-orange-600',
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-2xl shadow-premium p-6 hover-lift fade-in border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br ${colors.bg} rounded-xl shadow-lg`}>
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>
      </div>
      <div>
        <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default Card;