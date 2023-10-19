import React from "react";
import { useNotification } from "@/store/NotificationContext";
import { Modal, Spinner } from "react-bootstrap";
import ButtonComponent from "@/components/forms/ButtonComponent";

type IExerciseNotesDeleteModal = {
    exerciseNotesId: number | null,
    setExerciseNotesId: React.Dispatch<React.SetStateAction<number | null>>,
    showExerciseNotesDeleteModal: boolean,
    handleCloseExerciseNotesDeleteModal: () => void,
    setExerciseNotes: React.Dispatch<React.SetStateAction<string>>,
}

const ExerciseNotesDeleteModal = ({ exerciseNotesId, setExerciseNotesId, showExerciseNotesDeleteModal, handleCloseExerciseNotesDeleteModal, setExerciseNotes }: IExerciseNotesDeleteModal) => {
    const [loading, setLoading] = React.useState(false);
    const { showNotification } = useNotification();

    const handleExerciseNotesDelete: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        setLoading(true);

        const response = await fetch("/api/exercise-notes", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                notesId: exerciseNotesId,
            })
        });

        const result: { 
            message: string,
            notesId: number | null,
            notes: string
         } = await response.json();

        if (response.ok) { 
            handleCloseExerciseNotesDeleteModal();
            setLoading(false);
            setExerciseNotesId(result.notesId);
            setExerciseNotes(result.notes);

            showNotification({
                message: result.message,
                status: "success"
            });
        }

        else {
            handleCloseExerciseNotesDeleteModal();
            setLoading(false);

            showNotification({
                message: result.message,
                status: "error"
            });
        }
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
                    {loading ?
                        (
                            <ButtonComponent type="submit" style="text"
                                textType="text-success"
                                disabled>
                                <Spinner animation="border" variant="light" size="sm" />
                            </ButtonComponent>
                        ) : (
                            <ButtonComponent type="submit" style="text"
                                textType="text-success">
                                Sim
                            </ButtonComponent>
                        )
                    }
                </form>
            </Modal.Footer>
        </Modal>
    )
}

export default ExerciseNotesDeleteModal