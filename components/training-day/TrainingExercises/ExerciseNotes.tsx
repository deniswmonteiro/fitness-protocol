import React from "react";
import ExerciseNotesModal from "./ExerciseNotesModals/ExerciseNotesModal";
import ExerciseNotesDeleteModal from "./ExerciseNotesModals/ExerciseNotesDeleteModal";
import styles from "./ExerciseNotes.module.css";

const ExerciseNotes = ({ exerciseId, notes }: { exerciseId: string, notes: string }) => {
    const [exerciseNotes, setExerciseNotes] = React.useState(() => notes !== "null" ? notes : "");
    const [exerciseNotesDeleted, setExerciseNotesDeleted] = React.useState(false);

    /** Modal state */
    const [showExerciseNotesModal, setShowExerciseNotesModal] = React.useState(false);
    const [showExerciseNotesDeleteModal, setShowExerciseNotesDeleteModal] = React.useState(false);

    const handleShowExerciseNotesModal = () => setShowExerciseNotesModal(true);
    const handleCloseExerciseNotesModal = () => setShowExerciseNotesModal(false);

    /** Exercise Notes delete modal */
    const handleShowExerciseNotesDeleteModal = () => setShowExerciseNotesDeleteModal(true);
    const handleCloseExerciseNotesDeleteModal = () => setShowExerciseNotesDeleteModal(false);

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

            {/* Exercise Notes create/update modal */}
            <ExerciseNotesModal exerciseId={exerciseId}
                exerciseNotes={exerciseNotes}
                setExerciseNotes={setExerciseNotes}
                showExerciseNotesModal={showExerciseNotesModal}
                handleCloseExerciseNotesModal={handleCloseExerciseNotesModal}
                handleShowExerciseNotesDeleteModal={handleShowExerciseNotesDeleteModal}
                exerciseNotesDeleted={exerciseNotesDeleted} />

            {/* Exercise Notes delete modal */}
            <ExerciseNotesDeleteModal exerciseId={exerciseId}
                showExerciseNotesDeleteModal={showExerciseNotesDeleteModal}
                handleCloseExerciseNotesDeleteModal={handleCloseExerciseNotesDeleteModal}
                setExerciseNotes={setExerciseNotes}
                setExerciseNotesDeleted={setExerciseNotesDeleted} />
        </>
    )
}

export default ExerciseNotes