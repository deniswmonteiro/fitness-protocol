import React from "react";
import { Badge, Carousel } from "react-bootstrap";
import ExerciseRepetitions from "./ExerciseRepetitions";
import ExerciseSeriesTimer from "./ExerciseSeriesTimer";
import ExerciseWeight from "./ExerciseWeight";
import ExerciseNotes from "./ExerciseNotes";
import styles from "./TrainingExercises.module.css";
import QuestionCircleIcon from "@/components/icons/question-circle-icon";

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
    "c-speed": number,
    "e-speed": number,
    "technique-1": string,
    "description-1": string,
    "technique-2": string,
    "description-2": string,
    "technique-3": string,
    "description-3": string,
    "technique-4": string,
    "description-4": string,
    "is-grouping": boolean,
    weight: number,
    notes: string
}

const TrainingExercises = ({ training }: { training: IData }) => {
    return (
        <div className="animeLeft">
            <Carousel controls={false} interval={null}>
                {Object.entries(training.exercises).map((exercise) => (
                    <Carousel.Item key={exercise[0]}>
                        {exercise[1]["is-grouping"] && (
                            <Badge className={styles.exerciseGroupingBadge}>
                                Bi-set
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
                                    pause={exercise[1].pause}
                                    series={exercise[1].series} />

                                <div className={styles.exerciseDetails}>
                                    <div>
                                        <p>Velocidade C/E:</p>
                                        <span>
                                            {exercise[1]["c-speed"]} por {exercise[1]["e-speed"]}
                                        </span>
                                    </div>
                                    <div>
                                        <p>
                                            Técnica(s):
                                            
                                            <button>
                                                <QuestionCircleIcon />
                                            </button>
                                        </p>
                                        <ul>
                                            <li>
                                                {exercise[1]["technique-1"] !== "null" ? exercise[1]["technique-1"] : ""}
                                            </li>
                                            <li>
                                                {exercise[1]["technique-2"] !== "null" ? exercise[1]["technique-2"] : ""}
                                            </li>
                                            <li>
                                                {exercise[1]["technique-3"] !== "null" ? exercise[1]["technique-3"] : ""}
                                            </li>
                                            <li>
                                                {exercise[1]["technique-4"] !== "null" ? exercise[1]["technique-4"] : ""}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.exerciseFooter}>
                                <ExerciseWeight exerciseId={exercise[1].exerciseId} weight={exercise[1].weight} />
                                <ExerciseNotes exerciseId={exercise[1].exerciseId} notes={exercise[1].notes} />
                            </div>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    )
}

export default TrainingExercises