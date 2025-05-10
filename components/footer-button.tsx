"use client";

import { Arrow } from "@radix-ui/react-select";
import { Command, Component, Plus } from "lucide-react";
import * as React from "react";
import Link from "next/link";
import { hover } from "framer-motion";
import './footer-button.css';

interface FooterButtonProps {
    name: string;
}

const FooterButton: React.FC<FooterButtonProps> = ({ name }) => {


    return (
        <div className="flex gap-2 items-center footer-button pt-1 pb-1 cursor-pointer select-none">
            <Command size={16} className="flex items-center absolute" style={{transform: 'translateX(-5px)'}} />
            <p className="select-none">{name}</p>
        </div>
    );
};

export { FooterButton };