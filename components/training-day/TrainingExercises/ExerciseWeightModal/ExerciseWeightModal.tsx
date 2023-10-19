import React from "react";
import useForm from "@/hooks/useForm";
import { useNotification } from "@/store/NotificationContext";
import { Modal, Spinner } from "react-bootstrap";
import InputComponent from "@/components/forms/InputComponent";
import ButtonComponent from "@/components/forms/ButtonComponent";

type IExerciseWeightModal = {
    exerciseId: string,
    exerciseWeight: string,
    setExerciseWeight: React.Dispatch<React.SetStateAction<string>>,
    showExerciseWeightModal: boolean,
    handleCloseExerciseWeightModal: () => void
}

const ExerciseWeightModal = ({ exerciseId, exerciseWeight, setExerciseWeight, showExerciseWeightModal, handleCloseExerciseWeightModal }: IExerciseWeightModal) => {
    const weight = useForm({ type: "exerciseWeight", initial: exerciseWeight });
    const [loading, setLoading] = React.useState(false);
    const { showNotification } = useNotification();

    /** Close modal and reset form */
    const hideExerciseWeightModal = (saved: boolean) => {
        handleCloseExerciseWeightModal();

        if (!saved && exerciseWeight === "") weight.setValue("")
        
        weight.setMessage(null);
        weight.setValid(null);
    }

    /** Submit form with exercise weight */
    const handleExerciseWeightFormSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        if (weight.validate()) {
            setLoading(true);

            const method = exerciseWeight === "" ? "POST" : "PATCH";
            const response = await fetch("/api/exercise-weight", {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    exerciseId,
                    weight: weight.value
                })
            });

            const result: {
                message: string,
                weight: string
            } = await response.json();

            if (response.ok) { 
                hideExerciseWeightModal(true);
                setLoading(false);
                setExerciseWeight(result.weight);

                showNotification({
                    message: result.message,
                    status: "success"
                });
            }

            else {
                hideExerciseWeightModal(true);
                
                showNotification({
                    message: result.message,
                    status: "error"
                });
            }
        }
    }

    return (
        <Modal show={showExerciseWeightModal} onHide={() => hideExerciseWeightModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {exerciseWeight === "" ? "Adicionar" : "Editar"} Carga
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleExerciseWeightFormSubmit}>
                    {/* Exercise Weight */}
                    <InputComponent inputGroup={true}
                        inputGroupText="kg"
                        label="Carga"
                        type="text"
                        id="exercise-weight"
                        autofocus={true}
                        {...weight} />

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

export default ExerciseWeightModal