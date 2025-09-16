"use client";

import React, { useState, useMemo } from "react";
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
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Import from country-state-city
import { Country, ICountry } from "country-state-city";

interface SearchableCountryDropdownProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchableCountryDropdown({
  value,
  onValueChange,
  placeholder = "Select country...",
  className,
}: SearchableCountryDropdownProps) {
  const [open, setOpen] = useState(false);

  // Get all countries once
  const countries: ICountry[] = useMemo(() => Country.getAllCountries(), []);

  const selectedCountry = countries.find((c) => c.isoCode === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedCountry ? (
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedCountry.flag}</span>
              <span>{selectedCountry.name}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput placeholder="Search country..." className="h-11" />
          </div>
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.isoCode}
                  value={country.isoCode}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{country.flag}</span>
                    <span>{country.name}</span>
                  </div>
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value === country.isoCode ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Example usage:
export function ExampleUsage() {
  const [country, setCountry] = useState("");

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <h3 className="text-lg font-medium">Select Country</h3>
      <SearchableCountryDropdown
        value={country}
        onValueChange={setCountry}
        placeholder="Choose a country..."
      />
      {country && (
        <p className="text-sm text-muted-foreground">
          Selected: {Country.getAllCountries().find((c) => c.isoCode === country)?.name}
        </p>
      )}
    </div>
  );
}
