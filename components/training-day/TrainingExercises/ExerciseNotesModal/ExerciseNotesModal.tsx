import React from "react";
import useForm from "@/hooks/useForm";
import { Modal, Spinner } from "react-bootstrap";
import TextAreaComponent from "@/components/forms/TextAreaComponent";
import ButtonComponent from "@/components/forms/ButtonComponent";

type IExerciseNotesModal = {
    exerciseId: string,
    showExerciseNotesModal: boolean,
    handleCloseExerciseNotesModal: () => void
}

const ExerciseNotesModal = ({ exerciseId, showExerciseNotesModal, handleCloseExerciseNotesModal }: IExerciseNotesModal) => {
    const notes = useForm({ type: "exerciseNotes", min: 2 });
    const [loading, setLoading] = React.useState(false);

     /** Close modal and reset form */
     const hideExerciseNotesModal = (saved: boolean) => {
        handleCloseExerciseNotesModal();

        if (!saved) notes.setValue("")
        
        notes.setMessage(null);
        notes.setValid(null);
    }

    /** Submit form with exercise notes */
    const handleExerciseNotesFormSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
    }

    return (
        <Modal show={showExerciseNotesModal} onHide={() => hideExerciseNotesModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Anotações
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleExerciseNotesFormSubmit}>
                    <div>
                        <p>
                            Adicione suas anotações sobre o exercício.
                        </p>
                    </div>
                    
                    {/* Exercise Notes */}
                    <TextAreaComponent rows={3}
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
                                Salvar
                            </ButtonComponent>
                        )
                    }
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default ExerciseNotesModal