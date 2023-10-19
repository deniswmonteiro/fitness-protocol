import React from "react";
import { Badge, Carousel } from "react-bootstrap";
import ExerciseRepetitions from "./ExerciseRepetitions";
import ExerciseSeriesTimer from "./ExerciseSeriesTimer";
import ShowExerciseTechniquesInfo from "./ShowExerciseTechniquesInfo";
import ExerciseWeight from "./ExerciseWeight";
import ExerciseNotes from "./ExerciseNotes";
import styles from "./TrainingExercises.module.css";

type IData = {
    id: number,
    title: string,
    exercises: IExercisesData[]
}

type IExercisesData = {
    exerciseId: string,
    name: string,
    series: number,
    "reps-1": number,
    "reps-2": number,
    "reps-3": number,
    "reps-4": number,
    pause: number,
    "technique-1": string,
    "description-1": string,
    "technique-2": string,
    "description-2": string,
    "technique-3": string,
    "description-3": string,
    "technique-4": string,
    "description-4": string,
    "grouping": string,
    weight: number,
    notesId?: number,
    notes: string
}

const TrainingExercises = ({ training }: { training: IData }) => {
    return (
        <>
            <div className="animeLeft">
                <Carousel controls={false} interval={null}>
                    {Object.entries(training.exercises).map((exercise) => (
                        <Carousel.Item key={exercise[0]}>
                            {exercise[1]["grouping"] !== "null" && (
                                <Badge className={styles.exerciseGroupingBadge}>
                                    {exercise[1]["grouping"]}
                                </Badge>
                            )}

                            <div className={styles.carouselBg}></div>

                            <Carousel.Caption className={styles.carouselContent}>
                                <div className={styles.exerciseContent}>
                                    <h2 className="title-2">{exercise[1].name}</h2>

                                    <div className={styles.exerciseInfo}>
                                        <p>
                                            <span>{exercise[1].series}</span> séries
                                        </p>

                                        <ExerciseRepetitions reps1={exercise[1]["reps-1"]}
                                            reps2={exercise[1]["reps-2"]}
                                            reps3={exercise[1]["reps-3"]}
                                            reps4={exercise[1]["reps-4"]}
                                            technique1={exercise[1]["technique-1"]}
                                            technique2={exercise[1]["technique-2"]}
                                            technique3={exercise[1]["technique-3"]}
                                            technique4={exercise[1]["technique-4"]} />
                                    </div>

                                    <ExerciseSeriesTimer id={exercise[1].exerciseId}
                                        qtyExercises={training.exercises.length}
                                        pause={exercise[1].pause}
                                        series={exercise[1].series} />

                                    <div className={styles.exerciseDetails}>
                                        <p>
                                            Técnica(s):
                                        </p>
                                        <ul>
                                            {exercise[1]["technique-1"] !== "null" &&
                                                <li>
                                                    <span>
                                                        {exercise[1]["technique-1"]}
                                                    </span>

                                                    <ShowExerciseTechniquesInfo technique={exercise[1]["technique-1"]}
                                                        description={exercise[1]["description-1"]} />
                                                </li>
                                            }
                                            {exercise[1]["technique-2"] !== "null" &&
                                                <li>
                                                    <span>
                                                        {exercise[1]["technique-2"]}
                                                    </span>

                                                    <ShowExerciseTechniquesInfo technique={exercise[1]["technique-2"]}
                                                        description={exercise[1]["description-2"]} />
                                                </li>
                                            }
                                            {exercise[1]["technique-3"] !== "null" &&
                                                <li>
                                                    <span>
                                                        {exercise[1]["technique-3"]}
                                                    </span>

                                                    <ShowExerciseTechniquesInfo technique={exercise[1]["technique-3"]}
                                                        description={exercise[1]["description-3"]} />
                                                </li>
                                            }
                                            {exercise[1]["technique-4"] !== "null" &&
                                                <li>
                                                    <span>
                                                        {exercise[1]["technique-4"]}
                                                    </span>

                                                    <ShowExerciseTechniquesInfo technique={exercise[1]["technique-4"]}
                                                        description={exercise[1]["description-4"]} />
                                                </li>
                                            }
                                        </ul>
                                    </div>
                                </div>
                                <div className={styles.exerciseFooter}>
                                    <ExerciseWeight exerciseId={exercise[1].exerciseId} weight={exercise[1].weight} />
                                    <ExerciseNotes exerciseId={exercise[1].exerciseId}
                                        notesId={exercise[1].notesId}
                                        notes={exercise[1].notes} />
                                </div>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
        </>
    )
}

export default TrainingExercises