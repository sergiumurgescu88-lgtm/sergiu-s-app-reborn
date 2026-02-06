import React from 'react';
import { Settings, Image as ImageIcon, Sparkles } from 'lucide-react';
import { PhotoStyle, ImageResolution } from '../../types/dish';

interface ControlsProps {
  selectedStyle: PhotoStyle;
  onStyleChange: (style: PhotoStyle) => void;
  selectedResolution: ImageResolution;
  onResolutionChange: (res: ImageResolution) => void;
  isGenerating: boolean;
  onGenerateAll: () => void;
  queueLength: number;
}

export const Controls: React.FC<ControlsProps> = ({
  selectedStyle,
  onStyleChange,
  selectedResolution,
  onResolutionChange,
  isGenerating,
  onGenerateAll,
  queueLength,
}) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Settings className="w-5 h-5 text-brand" />
        <h2 className="text-lg font-semibold text-foreground">Studio Settings</h2>
      </div>

      {/* Style Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Aesthetic Style
        </label>
        <div className="grid grid-cols-1 gap-2">
          {Object.values(PhotoStyle).map((style) => (
            <button
              key={style}
              onClick={() => onStyleChange(style)}
              className={`text-left px-4 py-3 rounded-lg text-sm border transition-all ${
                selectedStyle === style
                  ? 'border-brand bg-brand-subtle text-brand ring-1 ring-brand'
                  : 'border-border hover:border-muted-foreground/30 text-muted-foreground hover:bg-muted'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Resolution Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Output Resolution
        </label>
        <div className="flex gap-2">
          {Object.values(ImageResolution).map((res) => (
            <button
              key={res}
              onClick={() => onResolutionChange(res)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                selectedResolution === res
                  ? 'border-brand bg-brand-subtle text-brand'
                  : 'border-border hover:border-muted-foreground/30 text-muted-foreground'
              }`}
            >
              {res}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <button
          onClick={onGenerateAll}
          disabled={isGenerating || queueLength === 0}
          className="w-full bg-foreground hover:bg-foreground/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-background py-3 px-4 rounded-xl font-semibold shadow-lg shadow-brand/10 transition-all active:scale-[0.98]"
        >
          {isGenerating ? 'Processing Studio Queue...' : `Generate ${queueLength} Photo${queueLength !== 1 ? 's' : ''}`}
        </button>
      </div>
    </div>
  );
};
