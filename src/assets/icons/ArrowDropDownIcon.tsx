import { IconProps } from "./common/IconProps";
import { GoogleSVG } from "./common/GoogleSVG";

// Alternate List
export function AltListIcon(props: IconProps) {
    const { color, dim, filled } = props;

    return (
        <GoogleSVG color={color} dim={dim}>
            {filled ? (
                <path d="M480-360 280-560h400L480-360Z"/>
            ) : (
                <path d="M480-360 280-560h400L480-360Z"/>
            )}
        </GoogleSVG>
    );
}
