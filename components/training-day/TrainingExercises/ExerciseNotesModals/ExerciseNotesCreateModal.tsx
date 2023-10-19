import React from "react";
import useForm from "@/hooks/useForm";
import { useNotification } from "@/store/NotificationContext";
import { useRouter } from "next/router";
import { Modal, Spinner } from "react-bootstrap";
import TextAreaComponent from "@/components/forms/TextAreaComponent";
import ButtonComponent from "@/components/forms/ButtonComponent";

type IExerciseNotesModal = {
    exerciseId: string,
    setExerciseNotesId: React.Dispatch<React.SetStateAction<number | null>>,
    setExerciseNotes: React.Dispatch<React.SetStateAction<string>>,
    showExerciseNotesModal: boolean,
    handleCloseExerciseNotesModal: () => void,
}

const ExerciseNotesCreateModal = ({ exerciseId, setExerciseNotesId, setExerciseNotes, showExerciseNotesModal, handleCloseExerciseNotesModal }: IExerciseNotesModal) => {
    const notes = useForm({ type: "exerciseNotes", min: 2 });
    const [plan, setPlan] = React.useState<string>("");
    const [loading, setLoading] = React.useState(false);
    const { showNotification } = useNotification();
    const router = useRouter();
    
    /** Close modal and reset form */
    const hideExerciseNotesModal = (saved: boolean) => {
        handleCloseExerciseNotesModal();

        if (!saved) notes.setValue("");
        
        notes.setMessage(null);
        notes.setValid(null);
    }

    /** Submit form with exercise notes */
    const handleCreateExerciseNotesFormSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        if (notes.validate()) {
            setLoading(true);

            const response = await fetch("/api/exercise-notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    exerciseId,
                    plan,
                    notes: notes.value
                })
            });

            const result: {
                message: string,
                notesId: number,
                notes: string
            } = await response.json();

            if (response.ok) { 
                hideExerciseNotesModal(true);
                setLoading(false);
                setExerciseNotesId(result.notesId);
                setExerciseNotes(result.notes);

                showNotification({
                    message: result.message,
                    status: "success"
                });
            }

            else {
                hideExerciseNotesModal(true);
                setLoading(false);

                showNotification({
                    message: result.message,
                    status: "error"
                });
            }
        }
    }

    React.useEffect(() => {
        if (router.query.planoId) setPlan(router.query.planoId as string);
    }, [router]);

    return (
        <Modal show={showExerciseNotesModal} onHide={() => hideExerciseNotesModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Adicionar Anotações
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
                                Salvar
                            </ButtonComponent>
                        )
                    }
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default ExerciseNotesCreateModal