import React from "react";
import styles from "./ExerciseNotes.module.css";
import ExerciseNotesModal from "./ExerciseNotesModal/ExerciseNotesModal";

const ExerciseNotes = ({ exerciseId, notes }: { exerciseId: string, notes: string }) => {
    const [exerciseNotes, setExerciseNotes] = React.useState(() => {
        return notes !== "null" ? notes : "";
    });

    /** Modal state */
    const [showExerciseNotesModal, setShowExerciseNotesModal] = React.useState(false);

    /**  Exercise Notes modal */
    const handleShowExerciseNotesModal = () => setShowExerciseNotesModal(true);
    const handleCloseExerciseNotesModal = () => setShowExerciseNotesModal(false);

    return (
        <>
            {exerciseNotes === "" ? 
                (
                    <button className={styles.exerciseNotesButton}
                        onClick={handleShowExerciseNotesModal}>
                        Anotações
                    </button>
                ) : (
                    <button className={styles.exerciseNotesButton}
                        onClick={handleShowExerciseNotesModal}>
                        Ver Anotações
                    </button>
                )
            }

            {/* Exercise Notes modal */}
            <ExerciseNotesModal exerciseId={exerciseId}
                exerciseNotes={exerciseNotes}
                setExerciseNotes={setExerciseNotes}
                showExerciseNotesModal={showExerciseNotesModal}
                handleCloseExerciseNotesModal={handleCloseExerciseNotesModal} />
        </>
    )
}

export default ExerciseNotes