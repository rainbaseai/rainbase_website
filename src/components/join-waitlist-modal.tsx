"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { supabase, type WaitlistEntry } from "@/lib/supabase";
import toast from "react-hot-toast";

interface JoinWaitlistModalProps {
    children: React.ReactNode;
}

export function JoinWaitlistModal({ children }: JoinWaitlistModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        usageType: "",
        teamMembers: "",
        companyName: "",
    });
    const [errors, setErrors] = useState({
        email: "",
        fullName: "",
        usageType: "",
        teamMembers: "",
        companyName: "",
    });

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const clearError = (field: string) => {
        setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof typeof errors]) {
            clearError(field);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newErrors = {
            email: "",
            fullName: "",
            usageType: "",
            teamMembers: "",
            companyName: "",
        };

        // Validate required fields
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email.trim())) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        if (!formData.usageType) {
            newErrors.usageType = "Usage type is required";
        }

        // Validate team-specific fields
        if (formData.usageType === "team") {
            if (!formData.teamMembers.trim()) {
                newErrors.teamMembers = "Number of team members is required";
            } else if (isNaN(Number(formData.teamMembers)) || Number(formData.teamMembers) < 1) {
                newErrors.teamMembers = "Please enter a valid number of team members";
            }

            if (!formData.companyName.trim()) {
                newErrors.companyName = "Company name is required";
            }
        }

        // Check if there are any errors
        const hasErrors = Object.values(newErrors).some(error => error !== "");
        if (hasErrors) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            // Prepare data for Supabase
            const waitlistData: Omit<WaitlistEntry, 'id' | 'created_at'> = {
                email: formData.email.trim().toLowerCase(),
                full_name: formData.fullName.trim(),
                usage_type: formData.usageType as 'personal' | 'team',
                ...(formData.usageType === 'team' && {
                    team_members: Number(formData.teamMembers),
                    company_name: formData.companyName.trim(),
                }),
            };

            // Submit to Supabase
            const { error } = await supabase
                .from('waitlist')
                .insert([waitlistData]);

            if (error) {
                // Handle duplicate email error specifically
                if (error.code === '23505') {
                    setErrors(prev => ({
                        ...prev,
                        email: "This email is already on our waitlist"
                    }));
                    toast.error("This email is already on our waitlist");
                } else {
                    console.error('Supabase error:', error);
                    toast.error("Something went wrong. Please try again.");
                }
                setIsSubmitting(false);
                return;
            }

            // Success
            toast.success("Thanks for joining our waitlist! We'll be in touch soon.");

            // Reset form
            setFormData({
                email: "",
                fullName: "",
                usageType: "",
                teamMembers: "",
                companyName: "",
            });
            setErrors({
                email: "",
                fullName: "",
                usageType: "",
                teamMembers: "",
                companyName: "",
            });
            setIsOpen(false);
        } catch (error) {
            console.error('Unexpected error:', error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit} className="py-4">
                    <DialogHeader>
                        <DialogTitle className="text-center">Join the Waitlist</DialogTitle>
                        <DialogDescription className="text-center text-sm text-gray-500 pb-4">
                            Be the first to know when we launch. Get early access to our platform.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                placeholder="Enter your email address"
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                                id="fullName"
                                value={formData.fullName}
                                onChange={(e) => handleInputChange("fullName", e.target.value)}
                                placeholder="Enter your full name"
                                className={errors.fullName ? "border-red-500" : ""}
                            />
                            {errors.fullName && (
                                <p className="text-sm text-red-500">{errors.fullName}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="usageType">Usage Type *</Label>
                            <Select
                                value={formData.usageType}
                                onValueChange={(value) => handleInputChange("usageType", value)}
                            >
                                <SelectTrigger className={errors.usageType ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Select usage type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="personal">Personal</SelectItem>
                                    <SelectItem value="team">Team</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.usageType && (
                                <p className="text-sm text-red-500">{errors.usageType}</p>
                            )}
                        </div>

                        {formData.usageType === "team" && (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="teamMembers">Number of Team Members *</Label>
                                    <Input
                                        id="teamMembers"
                                        type="number"
                                        min="1"
                                        value={formData.teamMembers}
                                        onChange={(e) => handleInputChange("teamMembers", e.target.value)}
                                        placeholder="Enter number of team members"
                                        className={errors.teamMembers ? "border-red-500" : ""}
                                    />
                                    {errors.teamMembers && (
                                        <p className="text-sm text-red-500">{errors.teamMembers}</p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="companyName">Company Name *</Label>
                                    <Input
                                        id="companyName"
                                        value={formData.companyName}
                                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                                        placeholder="Enter your company name"
                                        className={errors.companyName ? "border-red-500" : ""}
                                    />
                                    {errors.companyName && (
                                        <p className="text-sm text-red-500">{errors.companyName}</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    
                    <DialogFooter className="mt-4">
                        <Button 
                            className="cursor-pointer w-full" 
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Joining..." : "Join Waitlist"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}