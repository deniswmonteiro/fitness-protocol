import React from "react";
import Link from "next/link";
import { Card, Spinner } from "react-bootstrap";
import ArrowRightIcon from "../../icons/arrow-right-icon";
import styles from "./TrainingWeekCard.module.css";

const TrainingWeekCard = ({ plan, week }: { plan: string, week: string }) => {
    const [weekSlug, setWeekSlug] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setWeekSlug(week.replace(" ", "-").toLowerCase());
    }, [week]);

    return (
        <div className={styles.trainingWeekCard}>
            <Link href={`/plano/${plan}/${weekSlug}`} onClick={() => setLoading(true)}>
                <Card className={styles.cardBgBlue}>
                    <Card.Body className={styles.cardBgBlueContent}>
                        <p>{week.split(" ")[0]} <span>{week.split(" ")[1]}</span></p>

                        {loading ? 
                            (
                                <Spinner animation="border" size="sm"
                                    className={styles.loading} />
                            ) : (
                                <ArrowRightIcon />
                            )
                        }
                    </Card.Body>
                </Card>
            </Link>
        </div>
    )
}

export default TrainingWeekCard