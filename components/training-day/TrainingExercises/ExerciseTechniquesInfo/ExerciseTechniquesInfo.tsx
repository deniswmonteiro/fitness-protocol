import React from "react";
import Offcanvas from "react-bootstrap/Offcanvas";

type IExerciseTechniquesInfo = {
    showExerciseTechniquesInfo: boolean,
    handleCloseExerciseTechniquesInfo: () => void
}

const ExerciseTechniquesInfo = ({ showExerciseTechniquesInfo, handleCloseExerciseTechniquesInfo }: IExerciseTechniquesInfo) => {
    return (
        <>
            <Offcanvas show={showExerciseTechniquesInfo}
                onHide={handleCloseExerciseTechniquesInfo}
                placement="bottom"
                backdrop="static">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    Some text as placeholder. In real life you can have the elements you
                    have chosen. Like, text, images, lists, etc.
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default ExerciseTechniquesInfo