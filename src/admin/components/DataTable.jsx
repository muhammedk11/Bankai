function DataTable({ columns, data }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-5 py-4 font-semibold"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-5 py-8 text-center text-gray-500"
              >
                No products found.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="border-t border-gray-200">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-5 py-4 text-white"
                  >
                    {column.type === "image" ? (
                      <img
                        src={item[column.key]}
                        alt={item.name}
                        className="h-14 w-14 rounded-lg object-cover"
                      />
                    ) : column.render ? (
                      column.render(item)
                    ) : (
                      item[column.key] ?? "-"
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
