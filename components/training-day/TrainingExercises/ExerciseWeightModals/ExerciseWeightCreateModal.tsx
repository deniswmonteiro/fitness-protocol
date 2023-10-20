import React from "react";
import useForm from "@/hooks/useForm";
import { useNotification } from "@/store/NotificationContext";
import { useRouter } from "next/router";
import { Modal, Spinner } from "react-bootstrap";
import InputComponent from "@/components/forms/InputComponent";
import ButtonComponent from "@/components/forms/ButtonComponent";

type IExerciseWeightCreateModal = {
    exerciseId: string,
    setExerciseWeight: React.Dispatch<React.SetStateAction<string>>,
    showExerciseWeightCreateModal: boolean,
    handleCloseExerciseWeightCreateModal: () => void
}

const ExerciseWeightCreateModal = ({ exerciseId, setExerciseWeight, showExerciseWeightCreateModal, handleCloseExerciseWeightCreateModal }: IExerciseWeightCreateModal) => {
    const weight = useForm({ type: "exerciseWeight" });
    const [plan, setPlan] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const { showNotification } = useNotification();
    const router = useRouter();

    /** Close modal and reset form */
    const hideExerciseWeightCreateModal = (saved: boolean) => {
        handleCloseExerciseWeightCreateModal();

        if (!saved) weight.setValue("")
        
        weight.setMessage(null);
        weight.setValid(null);
    }

    /** Submit form with exercise weight */
    const handleExerciseWeightFormSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        if (weight.validate()) {
            setLoading(true);

            const response = await fetch("/api/exercise-weight", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    exerciseId,
                    plan,
                    weight: weight.value
                })
            });

            const result: {
                message: string,
                weight: string
            } = await response.json();

            if (response.ok) { 
                hideExerciseWeightCreateModal(true);
                setLoading(false);
                setExerciseWeight(result.weight);

                showNotification({
                    message: result.message,
                    status: "success"
                });
            }

            else {
                hideExerciseWeightCreateModal(true);
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
        <Modal show={showExerciseWeightCreateModal} onHide={() => hideExerciseWeightCreateModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Adicionar Carga
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

export default ExerciseWeightCreateModal