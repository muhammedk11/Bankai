
function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex items-center justify-between mt-5">
      <p className="text-sm text-gray-400">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white disabled:opacity-40"
        >
          Previous
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
