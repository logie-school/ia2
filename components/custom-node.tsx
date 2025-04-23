import { Info } from "lucide-react"; // Import Lucide icons
import { OverlayView } from "@react-google-maps/api";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import "./custom-node.css";

interface InfoNodeProps {
  position: google.maps.LatLngLiteral;
  title: string;
  description: string;
  type: string;
  bgColor: string;
  fgColor: string;
  children?: React.ReactNode;
}

export function CustomNode({
  position,
  bgColor,
  fgColor,
  title,
  description,
  type,
  children,
}: InfoNodeProps) {
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} // Ensures the overlay is interactive
    >
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="custom-node-wrapper" draggable="false">
            <div
              className="custom-node"
              onClick={() => console.log("PanoNode clicked!")}
              style={{backgroundColor: `${bgColor}`, color: `${fgColor}` , borderColor: `${fgColor}`}}
            >
              {children}
            </div>
          </div>
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