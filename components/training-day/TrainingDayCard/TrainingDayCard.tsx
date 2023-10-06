import React from "react";
import Link from "next/link";
import { getWithExpiry } from "@/helpers/localstorage-util";
import { Card, Spinner } from "react-bootstrap";
import PlayIcon from "@/components/icons/play-icon";
import styles from "./TrainingDayCard.module.css";
import { getFullDayName } from "@/helpers/calendar-util";

type ITrainingDay = {
    plan: string,
    week: string,
    day: string
}

const TrainingDayCard = ({ plan, week, day }: ITrainingDay) => {
    const [dayDone, setDayDone] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        /** Get day done from local storage */
        const calendarData = getWithExpiry("ConcludedDay") as string;

        if (calendarData !== null) setDayDone(calendarData);
    }, []);

    return (
        <div className={styles.trainingDayCard}>
            <Link href={`/plano/${plan}/${week}/${day.toLowerCase()}`}
                onClick={() => setLoading(true)}>
                <Card className={styles.card}>
                    {getFullDayName(dayDone) === day &&
                        <p className={styles.dayConcluded}>Concluído</p>
                    }

                    <Card.Body className={styles.cardContent}>
                        <p>
                            Treino de <span>{day === "Terca" ? "Terça" : day}</span>
                        </p>

                        {loading ? 
                            (
                                <Spinner animation="border" size="sm"
                                    className={styles.loading} />
                            ) : (
                                <PlayIcon />
                            )
                        }
                    </Card.Body>
                </Card>
            </Link>
        </div>
    )
}

export default TrainingDayCard