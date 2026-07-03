interface EmptyStateProps {
  message?: string;
  colSpan?: number;
}

export function EmptyState({ message = "Tidak ada data", colSpan = 5 }: EmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-16 text-center text-gray-400 text-sm">
        {message}
      </td>
    </tr>
  );
}