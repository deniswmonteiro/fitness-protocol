import React from "react";
import ExerciseWeightEditModal from "./ExerciseWeightModals/ExerciseWeightEditModal";
import ExerciseWeightCreateModal from "./ExerciseWeightModals/ExerciseWeightCreateModal";
import styles from "./ExerciseWeight.module.css";

const ExerciseWeight = ({ exerciseId, weight }: { exerciseId: string, weight: number }) => {
    const [exerciseWeight, setExerciseWeight] = React.useState(() => {
        return weight !== 0 ? weight.toString().replace(".", ",") : "";
    });

    /** Modal state */
    const [showExerciseWeightCreateModal, setShowExerciseWeightCreateModal] = React.useState(false);
    const [showExerciseWeightEditModal, setShowExerciseWeightEditModal] = React.useState(false);

    /**  Exercise Weight modal */
    const handleShowExerciseWeightCreateModal = () => setShowExerciseWeightCreateModal(true);
    const handleCloseExerciseWeightCreateModal = () => setShowExerciseWeightCreateModal(false);

    /**  Exercise Weight modal */
    const handleShowExerciseWeightEditModal = () => setShowExerciseWeightEditModal(true);
    const handleCloseExerciseWeightEditModal = () => setShowExerciseWeightEditModal(false);

    return (
        <>  
            {exerciseWeight === "" ? 
                (
                    <button className={styles.exerciseWeightButton}
                        onClick={handleShowExerciseWeightCreateModal}>
                        Carga
                    </button>
                ) : (
                    <button className={styles.exerciseWeightButton}
                        onClick={handleShowExerciseWeightEditModal}>
                        {exerciseWeight} kg
                    </button>
                )
            }

            {exerciseWeight === "" ? 
                (
                    // Exercise Weight create modal
                    <ExerciseWeightCreateModal exerciseId={exerciseId}
                        setExerciseWeight={setExerciseWeight}
                        showExerciseWeightCreateModal={showExerciseWeightCreateModal}
                        handleCloseExerciseWeightCreateModal={handleCloseExerciseWeightCreateModal} />
                ) : (
                    // Exercise Weight edit modal
                    <ExerciseWeightEditModal exerciseId={exerciseId}
                        exerciseWeight={exerciseWeight}
                        setExerciseWeight={setExerciseWeight}
                        showExerciseWeightEditModal={showExerciseWeightEditModal}
                        handleCloseExerciseWeightEditModal={handleCloseExerciseWeightEditModal} />
                )
            }
        </>
    )
}

export default ExerciseWeight