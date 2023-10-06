import React from "react";
import { useRouter } from "next/router";
import { getWithExpiry, setWithExpiry } from "@/helpers/localstorage-util";
import { getAbbrDayName, getDay, getHoursInMilliseconds, getLastDayOfTheWeekInMilliseconds } from "@/helpers/calendar-util";
import TimerModal from "./TimerModal/TimerModal";
import StopIcon from "@/components/icons/stop-icon";
import CheckIcon from "@/components/icons/check-icon";
import PlayIcon from "@/components/icons/play-icon";
import styles from "./ExerciseTimerIndicator.module.css";

type IExerciseTimerIndicator = {
    id: string,
    qtyExercises: number,
    pause: number,
    serieListDone: ISeriesList[],
    setSerieListDone: React.Dispatch<React.SetStateAction<ISeriesList[]>>
}

type ISeriesList = {
    serie: number;
    done: boolean;
}

const ExerciseTimerIndicator = ({ id, qtyExercises, pause, serieListDone, setSerieListDone }: IExerciseTimerIndicator) => {
    const [serieStarted, setSerieStarted] = React.useState(0);
    const [exerciseFinished, setExerciseFinished] = React.useState(false);
    const [calendarDay, setCalendarDay] = React.useState("");
    const [concludedDay, setConcludedDay] = React.useState("");
    const router = useRouter();

    /** Modal state */
    const [showTimerModal, setShowTimerModal] = React.useState(false);

    /** Timer modal */
    const handleShowTimerModal = () => setShowTimerModal(true);
    const handleCloseTimerModal = () => setShowTimerModal(false);

    /** When the series is started */
    const handleSerieStarted = (serie: number) => {
        if (serie === 1) setSerieStarted(serie);

        else {
            serieListDone.find((serieId) => {
                if (serieId.serie === serie - 1) {
                    if (serieId.done) setSerieStarted(serie);
                }
            });
        }
    }

    /** When the series is finished */
    const handleSerieFinished = (serie: number) => {
        // Show modal with timer if is a non-zero pause
        if (pause > 0) handleShowTimerModal();

        serieListDone.find((serieId) => {
            if (serieId.serie === serie) return serieId.done = true;
        });

        setSerieListDone((serieListDone) => [...serieListDone]);

        // Save done series in local storage expiring in one day
        setWithExpiry(`Exercise-${id}`, serieListDone, 86400000);

        handleExerciseDone();
    }

    /** Set exercise as done if all series are finished */
    const handleExerciseDone = React.useCallback(() => {
        const exercisesSeries = window.localStorage.getItem(`Exercise-${id}`);

        if (exercisesSeries !== null) {
            // Checks whether the exercise has been completed
            const storagedExerciseSeries = JSON.parse(exercisesSeries) as {
                data: [ISeriesList],
                expiry: number
            };
            const ExerciseSeriesDone = storagedExerciseSeries.data.every((item: ISeriesList) => item.done);

            if (ExerciseSeriesDone) setExerciseFinished(true);

            // Save the workout day to localstorage
            const storagedSeries = [];
            const ExercisesConcluded = [];

            for (let i = 1; i <= qtyExercises; i++) {
                storagedSeries.push(window.localStorage.getItem(`Exercise-${id.slice(0, -1)}${i}`));
            }

            storagedSeries.forEach((serie) => {
                if (serie !== null) {
                    const storagedExercise = JSON.parse(serie) as {
                        data: [ISeriesList],
                        expiry: number
                    };
                    const ExerciseDone = storagedExercise.data.every((item: ISeriesList) => item.done);
                    
                    if (ExerciseDone) ExercisesConcluded.push(true);
                }
            });
            
            if (ExercisesConcluded.length === qtyExercises) {
                setWithExpiry("Calendar", calendarDay, getLastDayOfTheWeekInMilliseconds());
                setWithExpiry("ConcludedDay", concludedDay, getHoursInMilliseconds(24));
            }
        }
    }, [id, calendarDay, qtyExercises, concludedDay]);

    React.useEffect(() => {
        /** Save day done in local storage expiring at the end of the week */
        if (router.query.diaId) setConcludedDay(getAbbrDayName(router.query.diaId[1]));

        const day = getDay(new Date().getDay());
        setCalendarDay(day);

        /** Get done series from local storage */
        const exerciseSeriesList = getWithExpiry(`Exercise-${id}`) as ISeriesList[];
        
        if (exerciseSeriesList !== null) {
            setSerieListDone(exerciseSeriesList)
            handleExerciseDone()
        }
    }, [router.query.diaId, id, setSerieListDone, handleExerciseDone]);

    return (
        <>
            {!exerciseFinished ? 
                (serieListDone.map((item) => (
                    <div key={item.serie} className={styles.timerIndicator}>
                        <p>Série {item.serie}</p>

                        {item.done ? 
                            (
                                <button className={styles.serieDoneButton}>
                                    <CheckIcon />
                                </button>
                            ) : (
                                serieStarted === item.serie ?
                                    (
                                        <button onClick={() => handleSerieFinished(item.serie)}>
                                            <StopIcon />
                                        </button>
                                    ) : (
                                        <button onClick={() => handleSerieStarted(item.serie)}>
                                            <PlayIcon />
                                        </button>
                                    )
                            )
                        }
                    </div>
                ))) : (
                    <div className={styles.exerciseFinished}>
                        <p>Exercício concluído</p>
                        <CheckIcon />
                    </div>
                )
            }

            {/* Timer modal */}
            <TimerModal pause={pause}
                showTimerModal={showTimerModal}
                handleCloseTimerModal={handleCloseTimerModal} />
        </>
    )
}

export default ExerciseTimerIndicator