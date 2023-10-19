import React from "react";
import ExerciseNotesCreateModal from "./ExerciseNotesModals/ExerciseNotesCreateModal";
import ExerciseNotesEditModal from "./ExerciseNotesModals/ExerciseNotesEditModal";
import ExerciseNotesDeleteModal from "./ExerciseNotesModals/ExerciseNotesDeleteModal";
import styles from "./ExerciseNotes.module.css";

type IExerciseNotes = {
    exerciseId: string,
    notesId?: number,
    notes: string
}

const ExerciseNotes = ({ exerciseId, notesId, notes }: IExerciseNotes) => {
    const [exerciseNotes, setExerciseNotes] = React.useState(() => notes !== "null" ? notes : "");
    const [exerciseNotesId, setExerciseNotesId] = React.useState(() => notesId !== undefined ? notesId : null);

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
                        setExerciseNotesId={setExerciseNotesId}
                        showExerciseNotesModal={showExerciseNotesModal}
                        handleCloseExerciseNotesModal={handleCloseExerciseNotesModal} />
                ) : (
                    <ExerciseNotesEditModal exerciseNotesId={exerciseNotesId}
                        setExerciseNotesId={setExerciseNotesId}
                        setExerciseNotes={setExerciseNotes}
                        exerciseNotes={exerciseNotes}
                        showExerciseNotesModal={showExerciseNotesModal}
                        handleCloseExerciseNotesModal={handleCloseExerciseNotesModal}
                        handleShowExerciseNotesDeleteModal={handleShowExerciseNotesDeleteModal} />
                )
            }

            {/* Exercise Notes delete modal */}
            <ExerciseNotesDeleteModal exerciseNotesId={exerciseNotesId}
                setExerciseNotesId={setExerciseNotesId}
                showExerciseNotesDeleteModal={showExerciseNotesDeleteModal}
                handleCloseExerciseNotesDeleteModal={handleCloseExerciseNotesDeleteModal}
                setExerciseNotes={setExerciseNotes} />
        </>
    )
}

export default ExerciseNotes