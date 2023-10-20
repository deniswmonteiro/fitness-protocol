import React from "react";
import useForm from "@/hooks/useForm";
import { useNotification } from "@/store/NotificationContext";
import { Modal, Spinner } from "react-bootstrap";
import InputComponent from "@/components/forms/InputComponent";
import ButtonComponent from "@/components/forms/ButtonComponent";

type IExerciseWeightEditModal = {
    exerciseId: string,
    exerciseWeight: string,
    setExerciseWeight: React.Dispatch<React.SetStateAction<string>>,
    showExerciseWeightEditModal: boolean,
    handleCloseExerciseWeightEditModal: () => void
}

const ExerciseWeightEditModal = ({ exerciseId, exerciseWeight, setExerciseWeight, showExerciseWeightEditModal, handleCloseExerciseWeightEditModal }: IExerciseWeightEditModal) => {
    const weight = useForm({ type: "exerciseWeight", initial: exerciseWeight });
    const [loading, setLoading] = React.useState(false);
    const { showNotification } = useNotification();

    /** Close modal and reset form */
    const hideExerciseWeightEditModal = (saved: boolean) => {
        handleCloseExerciseWeightEditModal();

        if (!saved && exerciseWeight === "") weight.setValue("")
        
        weight.setMessage(null);
        weight.setValid(null);
    }

    /** Submit form with exercise weight */
    const handleExerciseWeightEditFormSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        if (weight.validate()) {
            setLoading(true);

            const response = await fetch("/api/exercise-weight", {
                method: "PATCH",
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
                hideExerciseWeightEditModal(true);
                setLoading(false);
                setExerciseWeight(result.weight);

                showNotification({
                    message: result.message,
                    status: "success"
                });
            }

            else {
                hideExerciseWeightEditModal(true);
                
                showNotification({
                    message: result.message,
                    status: "error"
                });
            }
        }
    }

    return (
        <Modal show={showExerciseWeightEditModal} onHide={() => hideExerciseWeightEditModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Editar Carga
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleExerciseWeightEditFormSubmit}>
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
                                Atualizar
                            </ButtonComponent>
                        )
                    }
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default ExerciseWeightEditModal