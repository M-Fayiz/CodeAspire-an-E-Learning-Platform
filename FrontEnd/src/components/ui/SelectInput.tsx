import { Select, SelectTrigger,SelectValue,SelectContent,SelectItem,} from "@/components/ui/select"

interface Option {
  label: string
  value: string
}

interface SelectInputProps <T=string> {
  name: string
  placeholder?: string
  value: T
  onChange: (e: { target: { name: string; value: T } }) => void
  options: Option[]
}

export const SelectInput =<T extends string = string> ({ name,placeholder = "Select an option", value,onChange,options,}:  SelectInputProps<T>) => {
    console.log('options',options)
  return (
    <Select  
      value={value === "" ? undefined : value}
      onValueChange={(val) => onChange({ target: { name, value: val as T} })}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent >
        
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
