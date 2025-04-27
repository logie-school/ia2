import { Camera, ImageIcon } from "lucide-react"; // Import Lucide icons
import { OverlayView } from "@react-google-maps/api";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import "./pano-node.css";

interface PanoNodeProps {
  position: google.maps.LatLngLiteral;
  href: string; // Added href prop for the link
}

export function PanoNode({ position, href }: { position: google.maps.LatLngLiteral; href: string }) {
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} // Ensures the overlay is interactive
    >
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild>
            <a className="map-node-wrapper" draggable="false" href={`${href}`}>
                <div
                    className="map-node"
                    onClick={() => console.log("PanoNode clicked!")}
                >
                    <Camera color="white" />
                </div>
            </a>
        </HoverCardTrigger>
        <HoverCardContent className="w-64" >
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Junior Quads</h4>
            <p className="text-sm text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
            <div className="flex items-center pt-2">
              <ImageIcon className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">
                360° Image
              </span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </OverlayView>
  );
}