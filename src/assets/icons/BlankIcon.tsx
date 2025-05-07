import { IconProps } from "./common/IconProps";
import { GoogleSVG } from "./common/GoogleSVG";

// Pause Icon
export function BlankIcon(props: IconProps) {
    const { color, dim, filled } = props;

    return (
        <GoogleSVG color={color} dim={dim}>
            {filled ? <></> : <></>}
        </GoogleSVG>
    );
}
