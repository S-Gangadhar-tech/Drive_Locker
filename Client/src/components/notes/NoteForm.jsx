import React from "react";
import { useForm, Controller } from "react-hook-form";
import { FaStar } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const NoteForm = ({ note, onSubmit, onClose }) => {
    const isUpdateMode = !!note;

    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            title: isUpdateMode ? note.title : "",
            notes: isUpdateMode ? note.notes : "",
            isFavourate: isUpdateMode ? note.isFavourate : false,
        }
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Title Input */}
            <div className="space-y-1.5 text-left">
                <Label htmlFor="title" className="text-xs font-semibold text-gray-300">
                    Title
                </Label>
                <Input
                    type="text"
                    id="title"
                    {...register("title", {
                        required: "Title is required",
                        validate: (val) => !val.includes(" ") || "Title cannot contain spaces"
                    })}
                    className="w-full px-4 py-6 rounded-lg text-sm text-white glass-input outline-none transition-all"
                    placeholder="MySecretNote"
                />
                {errors.title && (
                    <p className="text-red-500 text-xs font-semibold">{errors.title.message}</p>
                )}
            </div>

            {/* Notes Input */}
            <div className="space-y-1.5 text-left">
                <Label htmlFor="notes" className="text-xs font-semibold text-gray-300">
                    Note Content
                </Label>
                <Textarea
                    id="notes"
                    {...register("notes", { required: "Content is required" })}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg text-sm text-white glass-input outline-none transition-all resize-none min-h-[120px]"
                    placeholder="Write down your thoughts..."
                />
                {errors.notes && (
                    <p className="text-red-500 text-xs font-semibold">{errors.notes.message}</p>
                )}
            </div>

            {/* Favourite Checkbox */}
            <div className="flex items-center gap-2 py-2 select-none cursor-pointer">
                <Controller
                    name="isFavourate"
                    control={control}
                    render={({ field }) => (
                        <Checkbox
                            id="isFavourate"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-white/20 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                        />
                    )}
                />
                <Label
                    htmlFor="isFavourate"
                    className="flex items-center text-sm text-gray-300 gap-1.5 cursor-pointer font-medium"
                >
                    <FaStar className="text-yellow-400" />
                    <span>Add to Favourites</span>
                </Label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
                <Button
                    type="submit"
                    className="flex-1 py-6 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                    <FiCheck size={16} />
                    <span>{isUpdateMode ? "Save Changes" : "Create Note"}</span>
                </Button>
                <Button
                    type="button"
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 py-6 rounded-xl text-sm font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};

export default NoteForm;

