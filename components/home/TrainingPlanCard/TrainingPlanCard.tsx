import React from "react";
import Link from "next/link";
import { Card, Spinner } from "react-bootstrap";
import ArrowRightIcon from "@/components/icons/arrow-right-icon";
import styles from "./TrainingPlanCard.module.css";

const TrainingPlanCard = ({ plan }: { plan: string }) => {
    const [planSlug, setPlanSlug] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setPlanSlug(plan.replace(" ", "-").toLowerCase());
    }, [plan]);

    return (
        <div className={styles.trainingWeekCard}>
            <Link href={{ pathname: 'treino', query: { plan: planSlug } }} onClick={() => setLoading(true)}>
                <Card className={styles.cardBgBlue}>
                    <Card.Body className={styles.cardBgBlueContent}>
                        <p>
                            <span>{plan.split(" ")[0]}</span> {plan.split(" ")[1]}
                        </p>

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

export default TrainingPlanCard