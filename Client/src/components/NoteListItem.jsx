import React from 'react';
import { FaStar } from "react-icons/fa";
import { FiEdit, FiCheck, FiMoreVertical, FiTrash2, FiStar as FiStarOutline } from "react-icons/fi";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";

const Note = ({ ele, onUpdateClick, onSelectChange, isSelected, select, onDeleteClick, onToggleFavourite }) => {
    return (
        <motion.div
            layout
            whileHover={{ y: -4 }}
            className="h-full"
        >
            <Card
                className={`relative flex flex-col justify-between border rounded-2xl p-5 min-h-[160px] h-full transition-all duration-300 group ${isSelected
                    ? 'border-red-500/50 bg-red-500/5 shadow-md shadow-red-500/5'
                    : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
                    } ${select ? 'cursor-pointer' : ''}`}
                onClick={() => select ? onSelectChange() : onUpdateClick()}
            >
                {/* Header Action Row */}
                <div className="flex items-center justify-between w-full mb-3 h-8">
                    {/* Left: Checkbox (visible on hover, or always visible in selectMode) */}
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectChange();
                        }}
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all cursor-pointer ${isSelected
                            ? 'bg-red-600 border-transparent text-white opacity-100'
                            : select
                                ? 'border-white/30 text-transparent opacity-100 bg-white/5'
                                : 'border-white/20 text-transparent opacity-0 group-hover:opacity-100 bg-white/5 hover:border-white/40'
                            }`}
                    >
                        <FiCheck size={12} className="stroke-[3]" />
                    </div>

                    {/* Right: Pin, Edit, and Delete Actions */}
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {select ? (
                            ele.isFavourate && <FaStar className="text-yellow-400 text-sm mr-1" title="Pinned" />
                        ) : (
                            <>
                                {/* Pin Button */}
                                <Button
                                    onClick={onToggleFavourite}
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-white/10 rounded-lg text-gray-400 hover:text-yellow-400 transition-colors bg-transparent hover:bg-transparent"
                                    title={ele.isFavourate ? "Remove Pin" : "Pin Note"}
                                >
                                    {ele.isFavourate ? (
                                        <FaStar className="text-yellow-400" size={15} />
                                    ) : (
                                        <FiStarOutline size={15} />
                                    )}
                                </Button>

                                {/* Edit Button */}
                                <Button
                                    onClick={onUpdateClick}
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors bg-transparent hover:bg-transparent"
                                    title="Edit Note"
                                >
                                    <FiEdit size={15} />
                                </Button>

                                {/* Delete Button */}
                                <Button
                                    onClick={() => onDeleteClick(ele)}
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-red-600/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors bg-transparent hover:bg-transparent"
                                    title="Delete Note"
                                >
                                    <FiTrash2 size={15} />
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Note Content */}
                <div className="flex-grow overflow-hidden">
                    <h4 className="font-semibold text-white truncate text-base md:text-lg group-hover:text-red-500 transition-colors mb-1.5" title={ele.title}>
                        {ele.title}
                    </h4>
                    <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                        {ele.notes}
                    </p>
                </div>
            </Card>
        </motion.div>
    );
};

export default Note;