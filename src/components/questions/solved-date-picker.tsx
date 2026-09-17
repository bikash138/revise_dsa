"use client";

import { format, isValid, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DATE_FORMAT = "dd-MM-yyyy";

type SolvedDatePickerProps = {
  onChange: (value: string) => void;
  value: string;
};

function parseDate(value: string) {
  const date = parse(value, DATE_FORMAT, new Date());

  return isValid(date) && format(date, DATE_FORMAT) === value
    ? date
    : undefined;
}

export function SolvedDatePicker({ onChange, value }: SolvedDatePickerProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = parseDate(value);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        render={
          <Button
            aria-label="Choose the first solved date"
            className={cn(
              "h-11 w-full justify-between rounded-xl border-white/10 bg-[#111714] px-3 font-normal text-neutral-100 shadow-none hover:bg-white/[0.06] hover:text-neutral-100",
              !selectedDate && "text-neutral-500",
            )}
            type="button"
            variant="outline"
          />
        }
      >
        <span>{selectedDate ? value : "Select a date"}</span>
        <CalendarIcon className="size-4 text-neutral-400" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          captionLayout="dropdown"
          mode="single"
          onSelect={(date) => {
            if (!date) return;

            onChange(format(date, DATE_FORMAT));
            setOpen(false);
          }}
          selected={selectedDate}
        />
      </PopoverContent>
    </Popover>
  );
}
