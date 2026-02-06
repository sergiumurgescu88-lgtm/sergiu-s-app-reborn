import React, { useState } from 'react';
import { Camera, UtensilsCrossed } from 'lucide-react';
import { Dish, PhotoStyle, ImageResolution } from '../types/dish';
import { generateDishImage, setApiKey, getApiKey } from '../services/geminiService';
import { ApiKeyInput } from '../components/food-photographer/ApiKeyInput';
import { MenuInput } from '../components/food-photographer/MenuInput';
import { Controls } from '../components/food-photographer/Controls';
import { DishCard } from '../components/food-photographer/DishCard';
import { EditModal } from '../components/food-photographer/EditModal';

const Index = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<PhotoStyle>(PhotoStyle.MODERN);
  const [selectedResolution, setSelectedResolution] = useState<ImageResolution>(ImageResolution.RES_1K);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  const handleApiKeySet = (key: string) => {
    if (key) {
      setApiKey(key);
      setHasApiKey(true);
    } else {
      setApiKey('');
      setHasApiKey(false);
    }
  };

  const handleAddDishes = (newDishes: Dish[]) => {
    setDishes(prev => [...prev, ...newDishes]);
  };

  const handleDeleteDish = (id: string) => {
    setDishes(prev => prev.filter(d => d.id !== id));
  };

  const handleUpdateDish = (id: string, updates: Partial<Dish>) => {
    setDishes(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const processQueue = async () => {
    const pendingDishes = dishes.filter(d => d.status === 'idle' || d.status === 'failed');
    if (pendingDishes.length === 0) return;

    try {
      setIsProcessing(true);

      for (const dish of pendingDishes) {
        handleUpdateDish(dish.id, { status: 'generating', error: undefined });

        try {
          const imageUrl = await generateDishImage(
            dish.name,
            dish.description,
            selectedStyle,
            selectedResolution
          );
          handleUpdateDish(dish.id, { status: 'completed', imageUrl });
        } catch (error: any) {
          handleUpdateDish(dish.id, { status: 'failed', error: error.message || "Unknown error" });
        }
      }
    } catch (e) {
      console.error("Queue processing stopped", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetryDish = async (dish: Dish) => {
    try {
      handleUpdateDish(dish.id, { status: 'generating', error: undefined });
      const imageUrl = await generateDishImage(
        dish.name,
        dish.description,
        selectedStyle,
        selectedResolution
      );
      handleUpdateDish(dish.id, { status: 'completed', imageUrl });
    } catch (error: any) {
      handleUpdateDish(dish.id, { status: 'failed', error: error.message });
    }
  };

  const handleSaveEdit = (newImageUrl: string) => {
    if (editingDish) {
      handleUpdateDish(editingDish.id, { imageUrl: newImageUrl });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand p-2 rounded-lg">
              <Camera className="w-5 h-5 text-brand-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Virtual Food Photographer <span className="text-brand">AI</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="hidden sm:inline">Powered by Gemini AI</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar: Controls & Input */}
          <div className="lg:col-span-4 space-y-6">
            <ApiKeyInput onApiKeySet={handleApiKeySet} hasKey={hasApiKey} />
            <MenuInput onAddDishes={handleAddDishes} />
            <Controls
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
              selectedResolution={selectedResolution}
              onResolutionChange={setSelectedResolution}
              isGenerating={isProcessing}
              onGenerateAll={processQueue}
              queueLength={dishes.filter(d => d.status === 'idle' || d.status === 'failed').length}
            />

            {/* Pro Tip Card */}
            <div className="bg-tip rounded-xl p-6 text-tip-foreground overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="font-semibold text-lg mb-1">Pro Tip</h3>
                <p className="text-tip-foreground/80 text-sm">
                  Use the "Edit" button on any generated photo to refine details like steam, lighting, or garnish using natural language.
                </p>
              </div>
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-brand rounded-full blur-2xl opacity-50"></div>
            </div>
          </div>

          {/* Right Area: Gallery */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-muted-foreground" />
                Gallery
                <span className="text-sm font-normal text-muted-foreground ml-2 bg-muted px-2 py-0.5 rounded-full">
                  {dishes.length} items
                </span>
              </h2>
              {dishes.length > 0 && (
                <button
                  onClick={() => setDishes([])}
                  className="text-sm text-destructive hover:text-destructive/80 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {dishes.length === 0 ? (
              <div className="bg-card rounded-2xl border-2 border-dashed border-border p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Camera className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Your portfolio is empty</h3>
                <p className="text-muted-foreground max-w-sm">
                  Add menu items on the left and click "Generate" to create your virtual photoshoot.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {dishes.map(dish => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    onEdit={(d) => setEditingDish(d)}
                    onDelete={handleDeleteDish}
                    onRetry={handleRetryDish}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editingDish && editingDish.imageUrl && (
        <EditModal
          isOpen={true}
          onClose={() => setEditingDish(null)}
          imageUrl={editingDish.imageUrl}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default Index;
