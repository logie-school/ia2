// TODO: rework the infonode to instead have its
//       own nested sidebar (use the shadcn sheet)

"use client"

import { useState } from "react";
import { Info } from "lucide-react";
import { OverlayView } from "@react-google-maps/api";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import "./info-node.css";

interface InfoNodeProps {
  position: google.maps.LatLngLiteral;
  nodeLetter: string;
  title: string;
  description: string;
  type: string;
  href?: string;
  onclick?: () => void;
}

export function InfoNode({
  position,
  nodeLetter,
  title,
  description,
  type,
  onclick,
  href,
}: InfoNodeProps) {

  return (
      <OverlayView
          position={position}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} // Ensures the overlay is interactive
        >
        <HoverCard openDelay={0} closeDelay={0}>
          <HoverCardTrigger asChild>
              <a href={href} className="info-node-wrapper" draggable="false">
                <div
                  className="info-node"
                >
                  <span className="text-lg text-white font-medium">{nodeLetter}</span>
                </div>
              </a>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">{title}</h4>
              <p className="text-sm text-muted-foreground">{description}</p>
              <div className="flex items-center pt-2">
                <Info className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-xs text-muted-foreground">{type}</span>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </OverlayView>
  );
}