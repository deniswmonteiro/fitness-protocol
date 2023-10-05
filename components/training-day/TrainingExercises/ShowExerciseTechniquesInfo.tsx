import React from "react";
import ExerciseTechniquesInfo from "./ExerciseTechniquesInfo/ExerciseTechniquesInfo";
import QuestionCircleIcon from "@/components/icons/question-circle-icon";
import styles from "./ShowExerciseTechniquesInfo.module.css";

type IShowExerciseTechniquesInfo = {
    technique: string,
    description: string
}

const ShowExerciseTechniquesInfo = ({ technique, description }: IShowExerciseTechniquesInfo) => {
    /** Off canvas state */
    const [showTechniquesDescription, setShowTechniquesDescription] = React.useState(false);

    /**  Exercise Techniques Info off canvas */
    const handleCloseTechniquesDescription = () => setShowTechniquesDescription(false);
    const handleShowTechniquesDescription = () => setShowTechniquesDescription(true);

    return (
        <>
            <button className={styles.button} onClick={handleShowTechniquesDescription}>
                <QuestionCircleIcon />
            </button>

            {/* Exercise Techniques Info off canvas */}
            <ExerciseTechniquesInfo technique={technique}
                description={description}
                showTechniquesDescription={showTechniquesDescription}
                handleCloseTechniquesDescription={handleCloseTechniquesDescription} />
        </>
    )
}

export default ShowExerciseTechniquesInfo