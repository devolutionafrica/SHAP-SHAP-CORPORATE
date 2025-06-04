export const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-gray-500">{label}</div>
    <div className="font-medium text-gray-900">{value}</div>
  </div>
);
