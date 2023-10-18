import React from "react";
import useForm from "@/hooks/useForm";
import { useNotification } from "@/store/NotificationContext";
import { Modal, Spinner } from "react-bootstrap";
import TextAreaComponent from "@/components/forms/TextAreaComponent";
import ButtonComponent from "@/components/forms/ButtonComponent";

type IExerciseNotesModal = {
    exerciseId: string,
    exerciseNotes: string,
    setExerciseNotes: React.Dispatch<React.SetStateAction<string>>,
    showExerciseNotesModal: boolean,
    handleCloseExerciseNotesModal: () => void,
    handleShowExerciseNotesDeleteModal: () => void,
    exerciseNotesDeleted: boolean
}

const ExerciseNotesModal = ({ exerciseId, exerciseNotes, setExerciseNotes, showExerciseNotesModal, handleCloseExerciseNotesModal, handleShowExerciseNotesDeleteModal, exerciseNotesDeleted }: IExerciseNotesModal) => {
    const notes = useForm({ type: "exerciseNotes", min: 2, initial: exerciseNotes });
    const [loading, setLoading] = React.useState(false);
    const { showNotification } = useNotification();

    React.useEffect(() => {
        /** Reset modal if notes were deleted */
        if (exerciseNotes === "" && exerciseNotesDeleted) {
            notes.setValue("");
            notes.setMessage(null);
            notes.setValid(null);
        }
    }, [exerciseNotes, exerciseNotesDeleted, notes]);
    
    /** Close modal and reset form */
    const hideExerciseNotesModal = (saved: boolean) => {
        handleCloseExerciseNotesModal();

        if (!saved && exerciseNotes === "") notes.setValue("");
        
        notes.setMessage(null);
        notes.setValid(null);
    }

    /** Submit form with exercise notes */
    const handleCreateExerciseNotesFormSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        if (notes.validate()) {
            setLoading(true);

            const method = exerciseNotes === "" ? "POST" : "PATCH";
            const response = await fetch("/api/exercise-notes", {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    exerciseId,
                    notes: notes.value
                })
            });

            const result = await response.json() as {
                message: string,
                notes: string
            };

            if (response.ok) { 
                hideExerciseNotesModal(true);
                setLoading(false);
                setExerciseNotes(result.notes);

                showNotification({
                    message: result.message,
                    status: "success"
                });
            }

            else {
                setLoading(false);

                showNotification({
                    message: result.message,
                    status: "error"
                });
            }
        }
    }

    /** Hide Exercise Notes create/update modal and show Exercise Notes delete modal */
    const handleExerciseNotesDeleteModalTransition = () => {
        handleCloseExerciseNotesModal();
        handleShowExerciseNotesDeleteModal();
    }

    return (
        <Modal show={showExerciseNotesModal} onHide={() => hideExerciseNotesModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {exerciseNotes === "" ? "Adicionar" : "Editar"} Anotações
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleCreateExerciseNotesFormSubmit} className="mb-4">
                    <div>
                        <p>
                            Adicione suas anotações sobre o exercício.
                        </p>
                    </div>
                    
                    {/* Exercise Notes */}
                    <TextAreaComponent rows={5}
                        id="exercise-notes"
                        {...notes} />

                    {loading ? 
                        (
                            <ButtonComponent type="submit" style="success"
                                disabled>
                                <Spinner animation="border" variant="light" size="sm" />
                            </ButtonComponent>
                        ) : (
                            <ButtonComponent type="submit" style="success">
                                {exerciseNotes === "" ? "Salvar" : "Atualizar"}
                            </ButtonComponent>
                        )
                    }
                </form>

                {exerciseNotes !== "" && 
                    <ButtonComponent type="button" style="danger"
                        onClick={handleExerciseNotesDeleteModalTransition}>
                        Excluir
                    </ButtonComponent>
                }
            </Modal.Body>
        </Modal>
    )
}

export default ExerciseNotesModal