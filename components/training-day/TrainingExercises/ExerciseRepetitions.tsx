import React from "react";

type IExercisesRepetitions = {
    reps1: number,
    reps2: number,
    reps3: number,
    reps4: number,
    technique1: string,
    technique2: string,
    technique3: string,
    technique4: string,
}

const ExerciseRepetitions = ({ reps1, reps2, reps3, reps4, technique1, technique2, technique3, technique4 }: IExercisesRepetitions) => {
    const [repetitionsInfo, setRepetitionsInfo] = React.useState(<p></p>);

    React.useEffect(() => {
        if (technique1 === "Cluster" || technique2 === "Cluster" || technique3 === "Cluster" || technique4 === "Cluster") {
            if (reps1 === reps4) setRepetitionsInfo(<p><span>{reps1}</span> repetições</p>);
            else setRepetitionsInfo(<p><span>{reps1}</span> x <span>{reps4}</span> repetições</p>);
        }

        else if (technique1 === "Falha Total" || technique2 === "Falha Total" || technique3 === "Falha Total" || technique4 === "Falha Total") {
            setRepetitionsInfo(<p><span>Falha</span></p>);
        }

        else if (technique1 === "Drop-set" || technique2 === "Drop-set" || technique3 === "Drop-set" || technique4 === "Drop-set") {
            if (reps1 === reps4) setRepetitionsInfo(<p><span>{reps1}</span> + <span>{reps4}</span> repetições</p>);
            else setRepetitionsInfo(<p><span>{reps1}</span> a <span>{reps4}</span> repetições</p>);
        }

        else if (technique1 === "MTUT (1-3)" || technique2 === "MTUT (1-3)" || technique3 === "MTUT (1-3)" || technique4 === "MTUT (1-3)") {
            setRepetitionsInfo(<p><span>{reps1}</span> ciclos</p>);
        }

        else if (technique1 === "Piramidal" || technique2 === "Piramidal" || technique3 === "Piramidal" || technique4 === "Piramidal") {
            setRepetitionsInfo(<p><span>{reps1}</span> repetições</p>);
        }

        else if (technique1 === "Strip-set" || technique2 === "Strip-set" || technique3 === "Strip-set" || technique4 === "Strip-set") {
            if (reps1 === reps4) setRepetitionsInfo(<p><span>{reps1}</span> repetições</p>);
            else setRepetitionsInfo(<p><span>{reps1}</span> x <span>{reps4}</span> repetições</p>);
        }

        else if (technique1 === "FST-7" || technique2 === "FST-7" || technique3 === "FST-7" || technique4 === "FST-7") {
            setRepetitionsInfo(<p><span>{reps1}</span> repetições</p>);
        }

        else if (technique1 === "Rest pause 10s" || technique2 === "Rest pause 10s" || technique3 === "Rest pause 10s" || technique4 === "Rest pause 10s") {
            if (reps1 === reps4) setRepetitionsInfo(<p><span>{reps1}</span> + <span>Falha</span></p>);
            
            else if (reps2 !== 0) {
                setRepetitionsInfo(<p><span>{reps1}</span> + <span>{reps2}</span> + <span>{reps4}</span> repetições</p>);
            }
            
            else setRepetitionsInfo(<p><span>{reps1}</span> a <span>{reps4}</span> repetições</p>);
        }

        else if (technique1 === "Isometria" || technique2 === "Isometria" || technique3 === "Isometria" || technique4 === "Isometria") {
            setRepetitionsInfo(<p><span>{reps1}</span> + <span>{reps4}</span>s</p>);
        }

        else if (technique1 === "Drop-set 2x" || technique2 === "Drop-set 2x" || technique3 === "Drop-set 2x" || technique4 === "Drop-set 2x") {
            setRepetitionsInfo(<p><span>{reps1}</span> + <span>{reps2}</span> + <span>{reps4}</span> repetições</p>);
        }

        else {
            if (reps1 === reps4) setRepetitionsInfo(<p><span>{reps1}</span> repetições</p>);

            else if (reps2 !== 0 && reps3 !== 0) {
                setRepetitionsInfo(<p><span>{reps1}</span> + <span>{reps2}</span> + <span>{reps3}</span> + <span>{reps4}</span> repetições</p>);
            }

            else if (reps1 === 0) {
                setRepetitionsInfo(<p><span>Falha</span></p>);
            }

            else setRepetitionsInfo(<p><span>{reps1}</span> a <span>{reps4}</span> repetições</p>);
        }
    }, [technique1, technique2, technique3, technique4, reps1, reps2, reps3, reps4]);

    return (
        <>{repetitionsInfo}</>
    )
}

export default ExerciseRepetitions