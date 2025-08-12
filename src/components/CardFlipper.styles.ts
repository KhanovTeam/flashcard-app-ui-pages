import { SxProps, Theme } from "@mui/material";

export const cardContainer: SxProps<Theme> = {
    perspective: "1000px",
    width: 300,
    height: 200,
    cursor: "pointer"
};

export const cardWrapper = (flipped: boolean): SxProps<Theme> => ({
    position: "relative",
    width: "100%",
    height: "100%",
    transformStyle: "preserve-3d",
    transition: "transform 0.6s ease",
    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)"
});

export const cardFace: SxProps<Theme> = {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

export const cardBack: SxProps<Theme> = {
    ...cardFace,
    transform: "rotateY(180deg)"
};
