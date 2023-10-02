import React from "react";
import styles from "./Notes.module.css";
import ExerciseNotesModal from "./ExerciseNotesModal/ExerciseNotesModal";

const Notes = ({ exerciseId }: { exerciseId: string }) => {
    /** Modal state */
    const [showExerciseNotesModal, setShowExerciseNotesModal] = React.useState(false);

    /**  Exercise Notes modal */
    const handleShowExerciseNotesModal = () => setShowExerciseNotesModal(true);
    const handleCloseExerciseNotesModal = () => setShowExerciseNotesModal(false);

    return (
        <>
            <button className={styles.exerciseNotesButton}
                onClick={handleShowExerciseNotesModal}>
                Anotações
            </button>

            {/* Exercise Notes modal */}
            <ExerciseNotesModal exerciseId={exerciseId}
                showExerciseNotesModal={showExerciseNotesModal}
                handleCloseExerciseNotesModal={handleCloseExerciseNotesModal} />
        </>
    )
}

export default Notes