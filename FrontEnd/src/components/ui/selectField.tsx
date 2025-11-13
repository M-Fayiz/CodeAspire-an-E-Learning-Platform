import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface SelectFieldProps<T extends string | number> {
  label?: string;
  value: T | undefined;
  onChange: (value: T) => void;
  options: { label: string; value: T }[];
  placeholder?: string;
  disabled?: boolean;
}

export function SelectField<T extends string | number>({
  label,
  value,
  onChange,
  options,
  placeholder = "Select option",
  disabled = false,
}: SelectFieldProps<T>) {
  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <Select
        value={value?.toString()}
        onValueChange={(val) => {
          const selected = typeof value === "number" ? Number(val) : (val as T);
          onChange(selected as T);
        }}
        disabled={disabled}
      >
        <SelectTrigger className="w-full p-3 rounded-lg border">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={String(opt.value)}
              className="h-11"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
