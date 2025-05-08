import styled from "@emotion/styled";

interface InfoBoxProps {
    bodyFollowed: number;
    setBodyFollowed: React.Dispatch<React.SetStateAction<number>>;
    setResetCam: React.Dispatch<React.SetStateAction<number>>;
    camAtOrigin: boolean;
    setCamAtOrigin: React.Dispatch<React.SetStateAction<boolean>>;
}

export function InfoBox(props: InfoBoxProps) {
    const { bodyFollowed, setBodyFollowed, setResetCam, camAtOrigin, setCamAtOrigin } = props;
    return (
        <InfoBoxStyle>
            <div className="lt"/>
            <div className="text">
                Following: {bodyFollowed != -1 ? "B-" + bodyFollowed : "None"}
            </div>
            <div className="rt">
                {bodyFollowed != -1 ? (
                    <button
                        onClick={() => {
                            setBodyFollowed(-1);
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
                            setBodyFollowed(-1);
                            setResetCam((prev) => prev + 1);
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
    )
}

const InfoBoxStyle = styled.div`
    grid-area: info;

    display: grid;

    grid-template-areas: "left center right";
    grid-template-columns: 1fr 150px 1fr;
    grid-template-rows: 1fr;

    font-size: 1.2rem;
    
    @media screen and (max-height: 500px) {
        font-size: 1rem;
    }

    div {
        min-width: 85px;
    }

    div.text {
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
        width: 110px;

        @media screen and (max-width: 400px) {
            font-size: 0.7rem;
            width: 80px
        }

        :hover {
            background-color: white;
            color: black;
        }
    }
`;