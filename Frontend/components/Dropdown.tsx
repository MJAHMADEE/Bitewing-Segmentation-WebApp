import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownProps {
    options: string[];
    selectedOption: string;
    onOptionChange: (option: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selectedOption, onOptionChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    // useEffect(() => {
    //     if (!selectedOption && options.length > 0) {
    //         onOptionChange(options[0]);
    //     }
    // }, [options, selectedOption, onOptionChange]);

    const dropdownVariants = {
        hidden: {
            opacity: 0,
            scaleY: 0,
        },
        visible: {
            opacity: 1,
            scaleY: 1,
            transition: {
                duration: 0.2,
                ease: 'easeInOut',
            }
        }
    };

    return (
        <div className="relative inline-block w-full md:w-64 text-gray-700">
            <div
                className="w-full bg-gray-200 border border-gray-400 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500 hover:border-blue-400 shadow-lg cursor-pointer flex justify-between items-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption}
                <span className="flex items-center">
                    <svg className="fill-current h-4 w-4 transform transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </span>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="absolute z-10 w-full bg-white mt-2 border border-gray-300 rounded shadow-xl"
                    >
                        {options.map((option) => (
                            <div
                                key={option}
                                className="py-2 px-4 hover:bg-blue-500 hover:text-white cursor-pointer transition-colors duration-150"
                                onClick={() => {
                                    onOptionChange(option);
                                    setIsOpen(false);
                                }}
                            >
                                {option}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dropdown;
