import { IconProps } from "./common/IconProps";
import { GoogleSVG } from "./common/GoogleSVG";

// Alternate List
export function ArrowUpwardIcon(props: IconProps) {
    const { color, dim } = props;

    return (
        <GoogleSVG color={color} dim={dim}>
            <path d="M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z" />
        </GoogleSVG>
    );
}
