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

interface IComboboxProps<T extends string = string> {
  value: T;
  label: string;
  onChange?: (value: T) => void;
  boxOptions: { _id: T; label: string }[];
  setCategory?: (label?: string) => void;
}

export function Combobox<T extends string = string>({
  value,
  onChange,
  boxOptions,
  setCategory,
  label,
}: IComboboxProps<T>) {

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const selectedLabel = boxOptions.find(o => o._id === value)?.label;
    setCategory?.(selectedLabel);
  }, [value, boxOptions]);

  const selectedLabel = boxOptions.find(o => o._id === value)?.label;

  return (
    <div>
      <label className="block text-sm font-semibold">{label}</label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            {selectedLabel || "Select Option"}
            <ChevronsUpDownIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandGroup>
                {boxOptions.map((item) => (
                  <CommandItem
                    key={item._id}
                    value={item.label}
                    onSelect={() => {
                      onChange?.(item._id as T);
                      setOpen(false);
                    }}
                  >
                    {item.label}
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
