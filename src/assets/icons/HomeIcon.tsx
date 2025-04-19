import { IconProps } from "./common/IconProps";
import { GoogleSVG } from "./common/GoogleSVG";

// House-Shaped Icon
export function HomeIcon(props: IconProps) {
    const { color, dim, filled } = props;

    return (
        <GoogleSVG color={color} dim={dim}>
            {filled ? (
                <path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z" />
            ) : (
                <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
            )}
        </GoogleSVG>
    );
}
