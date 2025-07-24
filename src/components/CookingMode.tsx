import { useState } from 'react';
import { Recipe } from '@/lib/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ArrowRight, Check, X } from '@phosphor-icons/react';

interface CookingModeProps {
  recipe: Recipe | null;
  open: boolean;
  onClose: () => void;
}

export function CookingMode({ recipe, open, onClose }: CookingModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  if (!recipe) return null;

  const totalSteps = recipe.instructions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleStepComplete = (stepIndex: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepIndex)) {
      newCompleted.delete(stepIndex);
    } else {
      newCompleted.add(stepIndex);
    }
    setCompletedSteps(newCompleted);
  };

  const handleClose = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X size={20} />
              </Button>
              <div>
                <h1 className="text-xl font-bold">{recipe.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {totalSteps}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Progress</div>
              <div className="text-lg font-semibold">{Math.round(progress)}%</div>
            </div>
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="h-2" />

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Ingredients Reference */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-base">Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient.id} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span>
                        <span className="font-medium">{ingredient.amount} {ingredient.unit}</span>{' '}
                        {ingredient.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Current Step */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Step {currentStep + 1}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStepComplete(currentStep)}
                    className={completedSteps.has(currentStep) ? 'bg-primary text-primary-foreground' : ''}
                  >
                    <Check size={16} />
                    {completedSteps.has(currentStep) ? 'Completed' : 'Mark Complete'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">
                  {recipe.instructions[currentStep]}
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* All Steps Overview */}
          <div>
            <h3 className="font-semibold mb-3">All Steps</h3>
            <div className="space-y-2">
              {recipe.instructions.map((instruction, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    index === currentStep
                      ? 'border-primary bg-primary/5'
                      : completedSteps.has(index)
                      ? 'border-green-200 bg-green-50'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium shrink-0 ${
                        completedSteps.has(index)
                          ? 'bg-green-500 text-white'
                          : index === currentStep
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {completedSteps.has(index) ? <Check size={12} /> : index + 1}
                    </div>
                    <p className="text-sm leading-relaxed">{instruction}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft size={16} />
              Previous
            </Button>
            
            {currentStep === totalSteps - 1 ? (
              <Button onClick={handleClose} className="bg-green-600 hover:bg-green-700">
                <Check size={16} />
                Finish Cooking
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ArrowRight size={16} />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}