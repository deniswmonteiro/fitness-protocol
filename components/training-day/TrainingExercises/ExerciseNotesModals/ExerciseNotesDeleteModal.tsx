import ButtonComponent from "@/components/forms/ButtonComponent";
import React from "react";
import Modal from "react-bootstrap/Modal";

type IExerciseNotesDeleteModal = {
    exerciseId: string,
    showExerciseNotesDeleteModal: boolean,
    handleCloseExerciseNotesDeleteModal:  () => void
}

const ExerciseNotesDeleteModal = ({ exerciseId, showExerciseNotesDeleteModal, handleCloseExerciseNotesDeleteModal }: IExerciseNotesDeleteModal) => {
    const handleExerciseNotesDelete: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        console.log(exerciseId)
    }

    return (
        <Modal show={showExerciseNotesDeleteModal} onHide={handleCloseExerciseNotesDeleteModal}>
            <Modal.Header closeButton>
                <Modal.Title>Excluir anotação</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Tem certeza que deseja excluir a anotação?
                </p>
            </Modal.Body>
            <Modal.Footer>
                <ButtonComponent type="button" style="text"
                    textType="text-danger"
                    onClick={handleCloseExerciseNotesDeleteModal}>
                    Não
                </ButtonComponent>

                <form onSubmit={handleExerciseNotesDelete}>
                    <ButtonComponent type="submit" style="text"
                        textType="text-success">
                        Sim
                    </ButtonComponent>
                </form>
            </Modal.Footer>
        </Modal>
    )
}

export default ExerciseNotesDeleteModal