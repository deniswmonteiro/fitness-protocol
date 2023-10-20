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
    const [showExerciseNotesCreateModal, setShowExerciseNotesCreateModal] = React.useState(false);
    const [showExerciseNotesEditModal, setShowExerciseNotesEditModal] = React.useState(false);
    const [showExerciseNotesDeleteModal, setShowExerciseNotesDeleteModal] = React.useState(false);

    /** Exercise Notes create modal */
    const handleShowExerciseNotesCreateModal = () => setShowExerciseNotesCreateModal(true);
    const handleCloseExerciseNotesCreateModal = () => setShowExerciseNotesCreateModal(false);

    /** Exercise Notes edit modal */
    const handleShowExerciseNotesEditModal = () => setShowExerciseNotesEditModal(true);
    const handleCloseExerciseNotesEditModal = () => setShowExerciseNotesEditModal(false);

    /** Exercise Notes delete modal */
    const handleShowExerciseNotesDeleteModal = () => setShowExerciseNotesDeleteModal(true);
    const handleCloseExerciseNotesDeleteModal = () => setShowExerciseNotesDeleteModal(false);

    return (
        <>
            {exerciseNotes === "" ? 
                (
                    <button className={styles.exerciseNotesButton}
                        onClick={handleShowExerciseNotesCreateModal}>
                        Anotações
                    </button>
                ) : (
                    <button className={styles.exerciseNotesButton}
                        onClick={handleShowExerciseNotesEditModal}>
                        Ver Anotações
                    </button>
                )
            }

            {exerciseNotes === "" ?
                (
                    // Exercise Notes create modal
                    <ExerciseNotesCreateModal exerciseId={exerciseId}
                        setExerciseNotes={setExerciseNotes}
                        setExerciseNotesId={setExerciseNotesId}
                        showExerciseNotesCreateModal={showExerciseNotesCreateModal}
                        handleCloseExerciseNotesCreateModal={handleCloseExerciseNotesCreateModal} />
                ) : (
                    // Exercise Notes edit modal
                    <ExerciseNotesEditModal exerciseNotesId={exerciseNotesId}
                        setExerciseNotesId={setExerciseNotesId}
                        setExerciseNotes={setExerciseNotes}
                        exerciseNotes={exerciseNotes}
                        showExerciseNotesEditModal={showExerciseNotesEditModal}
                        handleCloseExerciseNotesEditModal={handleCloseExerciseNotesEditModal}
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