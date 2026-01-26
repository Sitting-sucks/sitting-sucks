import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Exercise, ExerciseInsert, ExerciseUpdate } from "@/hooks/useExercises";

// Predefined options for multi-select fields
const EQUIPMENT_OPTIONS = [
  "None", "Barbell", "Dumbbells", "Kettlebell", "Resistance Bands", "Bodyweight",
  "Machine", "Foam Roller", "Yellow Perform Better Band", "Purple Plastic Handle",
  "Heel Wedges", "Two 2.5 lbs Plates", "Forearm Spinner", "Yoga Blocks",
  "Lacrosse Ball", "5' PVC Pipe", "Chair", "Bench", "Pull-up Bar", "Cable Machine"
];

const JOINT_MOVEMENT_OPTIONS = [
  "Ankle Dorsiflexion", "Ankle Plantarflexion", "Ankle Inversion", "Ankle Eversion",
  "Knee Flexion", "Knee Extension", "Knee Internal Rotation", "Knee External Rotation",
  "Hip Flexion", "Hip Extension", "Hip Abduction", "Hip Adduction",
  "Hip Internal Rotation", "Hip External Rotation",
  "Lumbar Flexion", "Lumbar Extension", "Lumbar Lateral Flexion", "Lumbar Rotation", "Lumbar Neutral",
  "Thoracic Flexion", "Thoracic Extension", "Thoracic Lateral Flexion", "Thoracic Rotation",
  "Cervical Flexion", "Cervical Extension", "Cervical Lateral Flexion", "Cervical Rotation", "Cervical Neutral",
  "Shoulder Flexion", "Shoulder Extension", "Shoulder Abduction", "Shoulder Adduction",
  "Shoulder Internal Rotation", "Shoulder External Rotation",
  "Shoulder Horizontal Abduction", "Shoulder Horizontal Adduction", "Shoulder Retraction", "Shoulder Stabilization",
  "Elbow Flexion", "Elbow Extension", "Forearm Pronation", "Forearm Supination",
  "Wrist Flexion", "Wrist Extension", "Wrist Radial Deviation", "Wrist Ulnar Deviation",
  "Toe Extension", "Hip Neutral"
];

const MUSCLE_GROUP_OPTIONS = [
  "Quadriceps", "Hamstrings", "Gluteus Maximus", "Gluteus Medius", "Gluteus Minimus",
  "Gastrocnemius", "Soleus", "Tibialis Anterior", "Tibialis Posterior",
  "Rectus Abdominis", "Transverse Abdominis", "External Obliques", "Internal Obliques",
  "Erector Spinae", "Quadratus Lumborum", "Multifidus",
  "Pectoralis Major", "Pectoralis Minor", "Latissimus Dorsi",
  "Trapezius", "Rhomboids", "Serratus Anterior",
  "Anterior Deltoids", "Middle Deltoids", "Posterior Deltoids",
  "Biceps Brachii", "Triceps Brachii", "Brachialis",
  "Flexor Carpi Radialis", "Flexor Carpi Ulnaris", "Extensor Carpi Radialis", "Extensor Carpi Ulnaris",
  "Hip Flexors", "Tensor Fasciae Latae", "Adductors",
  "Peroneus Longus", "Peroneus Brevis", "Core", "Glutes",
  "Lower Trapezius", "Teres Major"
];

const MOVEMENT_PATTERN_OPTIONS = [
  "Squat", "Hinge", "Push", "Pull", "Carry", "Rotation", "Anti-rotation", "Lunge"
];

const MACRO_GROUP_OPTIONS = [
  "Calves", "Forearms", "Hip Abductors", "Hip Adductors", "Shoulders",
  "Chest", "Upper Back", "Lower Back", "Core", "Glutes", "Quadriceps",
  "Hamstrings", "Biceps", "Triceps", "Neck"
];

const DIFFICULTY_OPTIONS = ["beginner", "intermediate", "advanced"];
const INTENSITY_OPTIONS = ["low", "moderate", "high"];
const CATEGORY_OPTIONS = ["mobility", "strength"];

interface ExerciseFormProps {
  exercise?: Exercise | null;
  onSubmit: (data: ExerciseInsert | ExerciseUpdate) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ExerciseForm = ({ exercise, onSubmit, onCancel, isLoading }: ExerciseFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instructions: "",
    equipment: [] as string[],
    joint_movements: [] as string[],
    muscle_groups: [] as string[],
    macro_groups: [] as string[],
    movement_patterns: [] as string[],
    difficulty: "beginner",
    intensity: "moderate",
    duration: "",
    video_url: "",
    baseline: "",
    progression: "",
    regression: "",
    categories: [] as string[],
  });

  // Populate form when editing
  useEffect(() => {
    if (exercise) {
      setFormData({
        name: exercise.name || "",
        description: exercise.description || "",
        instructions: exercise.instructions || "",
        equipment: exercise.equipment || [],
        joint_movements: exercise.joint_movements || [],
        muscle_groups: exercise.muscle_groups || [],
        macro_groups: (exercise as any).macro_groups || [],
        movement_patterns: exercise.movement_patterns || [],
        difficulty: exercise.difficulty || "beginner",
        intensity: exercise.intensity || "moderate",
        duration: exercise.duration || "",
        video_url: exercise.video_url || "",
        baseline: exercise.baseline || "",
        progression: exercise.progression || "",
        regression: exercise.regression || "",
        categories: exercise.categories || [],
      });
    }
  }, [exercise]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const toggleArrayItem = (field: keyof typeof formData, item: string) => {
    const currentArray = formData[field] as string[];
    if (currentArray.includes(item)) {
      setFormData({ ...formData, [field]: currentArray.filter((i) => i !== item) });
    } else {
      setFormData({ ...formData, [field]: [...currentArray, item] });
    }
  };

  const MultiSelectField = ({
    label,
    field,
    options,
  }: {
    label: string;
    field: keyof typeof formData;
    options: string[];
  }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const selectedItems = formData[field] as string[];

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex flex-wrap gap-1 mb-2 min-h-[32px] p-2 border rounded-md bg-background">
          {selectedItems.length === 0 && (
            <span className="text-muted-foreground text-sm">None selected</span>
          )}
          {selectedItems.map((item) => (
            <Badge key={item} variant="secondary" className="gap-1">
              {item}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleArrayItem(field, item)}
              />
            </Badge>
          ))}
        </div>
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add {label}
          </Button>
          {showDropdown && (
            <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-popover border rounded-md shadow-lg">
              {options
                .filter((opt) => !selectedItems.includes(opt))
                .map((option) => (
                  <div
                    key={option}
                    className="px-3 py-2 hover:bg-accent cursor-pointer text-sm"
                    onClick={() => {
                      toggleArrayItem(field, option);
                      setShowDropdown(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Exercise Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Push-ups"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration/Reps</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="e.g., 3 sets of 10 reps"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the exercise"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Instructions/Coaching Cues *</Label>
        <Textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          placeholder="Detailed instructions for performing the exercise correctly"
          rows={4}
          required
        />
      </div>

      {/* Multi-select fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MultiSelectField label="Equipment" field="equipment" options={EQUIPMENT_OPTIONS} />
        <MultiSelectField label="Joint Movements" field="joint_movements" options={JOINT_MOVEMENT_OPTIONS} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MultiSelectField label="Muscle Groups" field="muscle_groups" options={MUSCLE_GROUP_OPTIONS} />
        <MultiSelectField label="Macro Groups" field="macro_groups" options={MACRO_GROUP_OPTIONS} />
      </div>

      <MultiSelectField label="Movement Patterns" field="movement_patterns" options={MOVEMENT_PATTERN_OPTIONS} />

      <MultiSelectField label="Categories" field="categories" options={CATEGORY_OPTIONS} />

      {/* Single select fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select
            value={formData.difficulty}
            onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTY_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Intensity</Label>
          <Select
            value={formData.intensity}
            onValueChange={(value) => setFormData({ ...formData, intensity: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INTENSITY_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Video URL */}
      <div className="space-y-2">
        <Label htmlFor="video_url">Video URL (YouTube embed)</Label>
        <Input
          id="video_url"
          value={formData.video_url}
          onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
          placeholder="https://www.youtube.com/embed/..."
        />
      </div>

      {/* Variations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Exercise Variations</h3>
        <div className="space-y-2">
          <Label htmlFor="baseline">Baseline (Standard)</Label>
          <Textarea
            id="baseline"
            value={formData.baseline}
            onChange={(e) => setFormData({ ...formData, baseline: e.target.value })}
            placeholder="Standard form description"
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="regression">Regression (Easier)</Label>
          <Textarea
            id="regression"
            value={formData.regression}
            onChange={(e) => setFormData({ ...formData, regression: e.target.value })}
            placeholder="Easier variation for beginners"
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="progression">Progression (Harder)</Label>
          <Textarea
            id="progression"
            value={formData.progression}
            onChange={(e) => setFormData({ ...formData, progression: e.target.value })}
            placeholder="More challenging variation"
            rows={2}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : exercise ? "Update Exercise" : "Create Exercise"}
        </Button>
      </div>
    </form>
  );
};

export default ExerciseForm;
