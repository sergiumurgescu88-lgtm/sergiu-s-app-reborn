import React, { useState } from 'react';
import { Plus, ListPlus } from 'lucide-react';
import { Dish } from '../../types/dish';
import { v4 as uuidv4 } from 'uuid';

interface MenuInputProps {
  onAddDishes: (dishes: Dish[]) => void;
}

export const MenuInput: React.FC<MenuInputProps> = ({ onAddDishes }) => {
  const [inputText, setInputText] = useState('');

  const handleQuickAdd = () => {
    if (!inputText.trim()) return;

    const lines = inputText.split('\n').filter(line => line.trim() !== '');

    const newDishes: Dish[] = lines.map(line => {
      const separator = line.includes(':') ? ':' : (line.includes('-') ? '-' : null);
      let name = line;
      let description = '';

      if (separator) {
        const parts = line.split(separator);
        name = parts[0].trim();
        description = parts.slice(1).join(separator).trim();
      }

      return {
        id: uuidv4(),
        name,
        description,
        status: 'idle',
      };
    });

    onAddDishes(newDishes);
    setInputText('');
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-4">
        <ListPlus className="w-5 h-5 text-brand" />
        <h2 className="text-lg font-semibold text-foreground">Menu Input</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="menu-text" className="block text-sm font-medium text-muted-foreground mb-2">
            Enter dishes (one per line)
          </label>
          <div className="text-xs text-muted-foreground/70 mb-2">
            Format: "Dish Name: Description" or just "Dish Name"
          </div>
          <textarea
            id="menu-text"
            className="w-full h-32 p-3 border border-border rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none resize-none text-foreground placeholder:text-muted-foreground bg-background"
            placeholder={"e.g. Truffle Burger: Wagyu beef patty with truffle aioli\nCaesar Salad: Fresh romaine hearts with parmesan"}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        <button
          onClick={handleQuickAdd}
          disabled={!inputText.trim()}
          className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-brand-foreground py-2.5 px-4 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add to Queue
        </button>
      </div>
    </div>
  );
};
