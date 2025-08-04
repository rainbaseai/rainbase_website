"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React, { useState, useEffect } from "react";

export const Meteors = ({
    number,
    className,
}: {
    number?: number;
    className?: string;
}) => {
    const [windowWidth, setWindowWidth] = useState(1200); // Default fallback width
    const meteors = new Array(number || 20).fill(true);

    useEffect(() => {
        const updateWidth = () => {
            setWindowWidth(window.innerWidth);
        };

        // Set initial width
        updateWidth();

        // Add event listener for window resize
        window.addEventListener('resize', updateWidth);

        // Cleanup
        return () => window.removeEventListener('resize', updateWidth);
    }, []);
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {meteors.map((el, idx) => {
                const meteorCount = number || 20;
                // Calculate position to evenly distribute meteors across container width
                const position = idx * (windowWidth / meteorCount) - 400; // Spread across 800px range, centered

                return (
                    <div
                        key={"meteor" + idx}
                        className={cn(
                            "animate-meteor-effect absolute h-0.5 w-0.5 rotate-[45deg] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
                            "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
                            className,
                        )}
                        style={{
                            top: "-40px", // Start above the container
                            left: position + "px",
                            animationDelay: Math.random() * 5 + "s", // Random delay between 0-5s
                            animationDuration: Math.floor(Math.random() * (10 - 5) + 5) + "s", // Keep some randomness in duration
                        }}
                    ></div>
                );
            })}
        </motion.div>
    );
};
