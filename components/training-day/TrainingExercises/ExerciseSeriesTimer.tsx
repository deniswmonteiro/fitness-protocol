import React from "react";
import ExerciseTimerIndicator from "./ExerciseTimerIndicator";
import styles from "./ExerciseSeriesTimer.module.css";

type IExerciseSeriesTimer = {
    id: string,
    qtyExercises: number,
    pause: number,
    series: number
}

const ExerciseSeriesTimer = ({ id, qtyExercises, pause, series }: IExerciseSeriesTimer) => {
    const [serieListDone, setSerieListDone] = React.useState(() => {
        const seriesInfo: {
            serie: number,
            done: boolean
        }[] = [];

        for (let i = 1; i <= series; i++) {
            seriesInfo.push({
                serie: i,
                done: false
            });
        }

        return seriesInfo;
    });

    return (
        <div className={styles.seriesTimer}>
            <ExerciseTimerIndicator id={id}
                qtyExercises={qtyExercises}
                pause={pause}
                serieListDone={serieListDone}
                setSerieListDone={setSerieListDone} />
        </div>
    )
}

export default ExerciseSeriesTimer