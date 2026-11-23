
function DataTable({ columns, data }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#15151f] text-gray-400">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-5 py-4 font-medium">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-white/10">
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id} className="text-gray-300 hover:bg-white/5">
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4">
                    {item[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-8 text-gray-500"
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
