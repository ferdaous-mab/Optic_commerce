import { Edit, Trash2 } from 'lucide-react';

const Table = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-premium overflow-hidden fade-in border border-gray-100">
      {/* Table Container with Scroll */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr
                key={row.id || index}
                className="hover:bg-gray-50 transition-colors"
                style={{
                  animation: `fadeIn 0.3s ease-in-out ${index * 0.05}s both`
                }}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
                
                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(row)}
                      className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all font-medium hover:shadow-md"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Modifier
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(row)}
                      className="inline-flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all font-medium hover:shadow-md"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Supprimer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Aucune donnée disponible
        </div>
      )}
    </div>
  );
};

export default Table;