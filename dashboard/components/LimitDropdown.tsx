"use client";

export default function LimitDropdown({
  selectedLimit,
  onLimitChange,
}: {
  selectedLimit: string;
  onLimitChange: (limit: string) => void;
}) {
  return (
    <input
      type="number"
      min={0}
      max={50}
      step={5}
      value={selectedLimit}
      onChange={(e) => onLimitChange(e.target.value)}
      className="w-full p-2 px-4 text-xl text-center rounded-md"
      placeholder="How many Songs"
    />
  );
}
