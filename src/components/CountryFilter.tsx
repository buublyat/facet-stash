import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CountryFilterProps {
  selectedCountries: string[];
  onCountryToggle: (country: string) => void;
  onClearFilter: () => void;
  availableCountries: string[];
}

export function CountryFilter({ 
  selectedCountries, 
  onCountryToggle, 
  onClearFilter,
  availableCountries 
}: CountryFilterProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddCountry = () => {
    const trimmed = inputValue.trim().toUpperCase();
    if (trimmed && !selectedCountries.includes(trimmed)) {
      onCountryToggle(trimmed);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCountry();
    }
  };

  // Get unique countries that exist in data but aren't selected
  const suggestions = availableCountries
    .filter(c => c && !selectedCountries.includes(c))
    .slice(0, 6);

  return (
    <div className="flex items-center gap-3 flex-wrap font-mono">
      <span className="text-xs text-muted-foreground">
        <span className="text-accent">$</span> filter --country=
      </span>
      
      <div className="flex items-center gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          placeholder="> ENTER_CODE"
          className="h-7 w-32 text-xs font-mono bg-secondary/50 border-border focus:border-primary px-2"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddCountry}
          disabled={!inputValue.trim()}
          className="h-7 px-2 text-xs font-mono text-primary hover:text-primary-foreground hover:bg-primary/20"
        >
          <Plus className="h-3 w-3 mr-1" />
          [ADD]
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {selectedCountries.map(country => (
          <button
            key={country}
            onClick={() => onCountryToggle(country)}
            className={cn(
              "px-2 py-0.5 text-xs font-mono border rounded transition-all",
              "bg-info/20 border-info/50 text-info",
              "hover:bg-info/30 hover:border-info"
            )}
          >
            [ {country} ]
            <X className="h-3 w-3 ml-1 inline-block" />
          </button>
        ))}
      </div>

      {suggestions.length > 0 && selectedCountries.length === 0 && (
        <div className="flex flex-wrap gap-1.5 ml-2">
          <span className="text-[10px] text-muted-foreground">suggestions:</span>
          {suggestions.map(country => (
            <button
              key={country}
              onClick={() => onCountryToggle(country)}
              className={cn(
                "px-2 py-0.5 text-xs font-mono border rounded transition-all",
                "border-border/50 text-muted-foreground",
                "hover:border-info/50 hover:text-info hover:bg-info/10"
              )}
            >
              [ {country} ]
            </button>
          ))}
        </div>
      )}

      {selectedCountries.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilter}
          className="h-6 px-2 text-xs text-muted-foreground font-mono glitch-hover"
        >
          <X className="h-3 w-3 mr-1" />
          --clear
        </Button>
      )}
    </div>
  );
}
