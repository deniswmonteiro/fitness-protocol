import React from "react";
import ExerciseNotesCreateModal from "./ExerciseNotesModals/ExerciseNotesCreateModal";
import ExerciseNotesEditModal from "./ExerciseNotesModals/ExerciseNotesEditModal";
import ExerciseNotesDeleteModal from "./ExerciseNotesModals/ExerciseNotesDeleteModal";
import styles from "./ExerciseNotes.module.css";

const ExerciseNotes = ({ exerciseId, notes }: { exerciseId: string, notes: string }) => {
    const [exerciseNotes, setExerciseNotes] = React.useState(() => notes !== "null" ? notes : "");

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

            {/* Exercise Notes create/edit modal */}
            {exerciseNotes === "" ?
                (
                    <ExerciseNotesCreateModal exerciseId={exerciseId}
                        setExerciseNotes={setExerciseNotes}
                        showExerciseNotesModal={showExerciseNotesModal}
                        handleCloseExerciseNotesModal={handleCloseExerciseNotesModal} />
                ) : (
                    <ExerciseNotesEditModal exerciseId={exerciseId}
                        exerciseNotes={exerciseNotes}
                        setExerciseNotes={setExerciseNotes}
                        showExerciseNotesModal={showExerciseNotesModal}
                        handleCloseExerciseNotesModal={handleCloseExerciseNotesModal}
                        handleShowExerciseNotesDeleteModal={handleShowExerciseNotesDeleteModal} />
                )
            }

            {/* Exercise Notes delete modal */}
            <ExerciseNotesDeleteModal exerciseId={exerciseId}
                showExerciseNotesDeleteModal={showExerciseNotesDeleteModal}
                handleCloseExerciseNotesDeleteModal={handleCloseExerciseNotesDeleteModal}
                setExerciseNotes={setExerciseNotes} />
        </>
    )
}

export default ExerciseNotes