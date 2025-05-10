"use client";

import { Arrow } from "@radix-ui/react-select";
import { ArrowRight, CheckIcon, XIcon } from "lucide-react";
import * as React from "react";
import Link from "next/link";
import { hover } from "framer-motion";
import './footer-item.css';

interface FooterItemProps {
    name: string;
    href: string;
}

const FooterItem: React.FC<FooterItemProps> = ({ name, href }) => {


    return (
        <Link className="flex gap-2 items-center footer-item pt-1 pb-1 select-none" href={href}>
            <ArrowRight size={16} className="flex items-center absolute" style={{transform: 'translateX(-5px)'}} />
            <p className="select-none">{name}</p>
        </Link>
    );
};

export { FooterItem };