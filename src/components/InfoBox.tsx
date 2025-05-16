import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useState } from "react";

export function InfoBox() {
    const dispatch = useDispatch();
    const bodyFollowed = useSelector((state: RootState) => state.controls.bodyFollowed);
    const yearsElapsed = useSelector((state: RootState) => state.information.yearsElapsed);

    const years = Math.floor(yearsElapsed);
    const months = Math.floor((yearsElapsed - years) * 12);

    const [camAtOrigin, setCamAtOrigin] = useState<boolean>(true);
    if (bodyFollowed != -1 && camAtOrigin) {
        setCamAtOrigin(false);
    }

    return (
        <InfoBoxStyle>
            <div className="tp">
                {years} years {months} months
            </div>
            <div className="lt" />
            <div className="ct">Following: {bodyFollowed != -1 ? "B-" + bodyFollowed : "None"}</div>
            <div className="rt">
                {bodyFollowed != -1 ? (
                    <button
                        onClick={() => {
                            dispatch({ type: "controls/setBodyFollowed", payload: -1 });
                        }}
                    >
                        Stop Following
                    </button>
                ) : (
                    <></>
                )}
                {!camAtOrigin && bodyFollowed == -1 ? (
                    <button
                        onClick={() => {
                            dispatch({ type: "controls/setBodyFollowed", payload: -1 });
                            dispatch({ type: "controls/resetCam" });
                            setCamAtOrigin(true);
                        }}
                    >
                        Reset Camera
                    </button>
                ) : (
                    <></>
                )}
            </div>
        </InfoBoxStyle>
    );
}

const InfoBoxStyle = styled.div`
    grid-area: info;

    display: grid;

    grid-template-areas: "top top top" "left center right";
    grid-template-columns: 1fr 150px 1fr;
    grid-template-rows: 1fr 1fr;

    font-size: 1.2rem;

    @media screen and (max-height: 500px) {
        font-size: 1rem;
    }

    div {
        min-width: 85px;
    }

    div.tp {
        grid-area: top;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    div.ct {
        grid-area: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    div.rt {
        grid-area: right;

        display: flex;
        align-items: center;
        justify-content: left;

        padding-left: 5px;

        @media screen and (max-width: 500px) {
            padding-left: 0px;
        }
    }

    div.lt {
        grid-area: left;
    }

    button {
        background: none;
        border: none;

        grid-area: right;

        border: 2px solid white;
        color: white;

        border-radius: 5px;
        font-size: 0.9rem;
        height: 35px;
        width: 115px;

        background-color: black;

        @media screen and (max-width: 400px) {
            font-size: 0.7rem;
            width: 80px;
        }

        :hover {
            background-color: white;
            color: black;
        }
    }
`;
