import { IconProps } from "./common/IconProps";
import { GoogleSVG } from "./common/GoogleSVG";

// Alternate List
export function ArrowDownwardIcon(props: IconProps) {
    const { color, dim } = props;

    return (
        <GoogleSVG color={color} dim={dim}>
            <path d="M480-240 240-480l56-56 144 144v-368h80v368l144-144 56 56-240 240Z" />
        </GoogleSVG>
    );
}
