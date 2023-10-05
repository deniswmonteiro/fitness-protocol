import React from "react";
import Offcanvas from "react-bootstrap/Offcanvas";

type IExerciseTechniquesInfo = {
    technique: string,
    description: string,
    showTechniquesDescription: boolean,
    handleCloseTechniquesDescription: () => void
}

const ExerciseTechniquesInfo = ({ technique, description, showTechniquesDescription, handleCloseTechniquesDescription }: IExerciseTechniquesInfo) => {
    return (
        <>
            <Offcanvas show={showTechniquesDescription}
                onHide={handleCloseTechniquesDescription}
                placement="bottom"
                backdrop="static">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{technique}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <p>{description}</p>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default ExerciseTechniquesInfo