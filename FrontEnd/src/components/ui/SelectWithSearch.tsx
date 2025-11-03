import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDownIcon } from "lucide-react";

export interface IBoxOptions {
  _id: string;
  label: string;
}

interface IComboboxProps {
  name: string;
  value: string;
  label: string;
  setCategory?: (selectedLabel: string | undefined) => void;
  onChange?: (name: string, value: string) => void;
  boxOptions: IBoxOptions[];
}

export function Combobox({
  name,
  value,
  onChange,
  boxOptions,
  setCategory,
  label,
}: IComboboxProps) {
  const [open, setOpen] = useState(false);
  console.log('box options :: ',boxOptions)
  useEffect(() => {
    const selectedLabel = boxOptions.find((item) => item._id === value)?.label;
    setCategory?.(selectedLabel);
  }, [value, boxOptions]);

  const selectedLabel = boxOptions.find((item) => item._id === value)?.label;

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between text-gray-500"
          >
            {selectedLabel || "Select Option..."}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {boxOptions.map((data) => (
                  <CommandItem
                    key={data._id}
                    value={data.label}
                    onSelect={() => {
                      const newValue = data._id === value ? "" : data._id;
                      console.log("new valuew", newValue);
                      onChange?.(name, newValue);
                      setOpen(false);
                    }}
                  >
                    {data.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default React.memo(Combobox);
