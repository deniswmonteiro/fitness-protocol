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
        <div className={styles.trainingPlanCard}>
            <Link href={`/plano/${planSlug}`} onClick={() => setLoading(true)}>
                <Card className={styles.card}>
                    <Card.Body className={styles.cardContent}>
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