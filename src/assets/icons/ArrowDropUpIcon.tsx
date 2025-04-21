import { IconProps } from "./common/IconProps";
import { GoogleSVG } from "./common/GoogleSVG";

// Alternate List
export function AltListIcon(props: IconProps) {
    const { color, dim, filled } = props;

    return (
        <GoogleSVG color={color} dim={dim}>
            {filled ? (
                <path d="m280-400 200-200 200 200H280Z"/>
            ) : (
                <path d="m280-400 200-200 200 200H280Z"/>
            )}
        </GoogleSVG>
    );
}
