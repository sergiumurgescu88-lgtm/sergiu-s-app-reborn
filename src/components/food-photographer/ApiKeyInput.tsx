import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySet: (key: string) => void;
  hasKey: boolean;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet, hasKey }) => {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = () => {
    if (key.trim()) {
      onApiKeySet(key.trim());
      setKey('');
    }
  };

  if (hasKey) {
    return (
      <div className="bg-brand-subtle border border-brand/20 rounded-xl p-4 flex items-center gap-3">
        <div className="bg-brand p-1.5 rounded-lg">
          <KeyRound className="w-4 h-4 text-brand-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">API Key Connected</p>
          <p className="text-xs text-muted-foreground">Gemini API key is set and ready</p>
        </div>
        <button
          onClick={() => onApiKeySet('')}
          className="text-xs text-destructive hover:text-destructive/80 font-medium"
        >
          Reset
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-4">
        <KeyRound className="w-5 h-5 text-brand" />
        <h2 className="text-lg font-semibold text-foreground">API Key Required</h2>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Enter your{' '}
        <a
          href="https://aistudio.google.com/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand hover:text-brand-hover underline"
        >
          Google Gemini API key
        </a>{' '}
        to start generating food photos.
      </p>

      <div className="space-y-3">
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="AIza..."
            className="w-full pl-4 pr-10 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-foreground placeholder:text-muted-foreground bg-background"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!key.trim()}
          className="w-full bg-brand hover:bg-brand-hover disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-brand-foreground py-2.5 px-4 rounded-lg font-medium transition-colors"
        >
          Connect API Key
        </button>
      </div>
    </div>
  );
};
