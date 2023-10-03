import React from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../layout/Header";
import TrainingExercises from "./TrainingExercises/TrainingExercises";
import { Spinner } from "react-bootstrap";
import styles from "./TrainingDay.module.css";

type ITrainingDay = {
    hasPlanError: boolean,
    hasWeekError: boolean,
    hasDayError: boolean,
    training: IData
}

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

const TrainingDay = ({ hasPlanError, hasWeekError, hasDayError, training}: ITrainingDay) => {
    const [trainingData, setTrainingData] = React.useState<IData | null>(null);
    const [plan, setPlan] = React.useState("");
    const [week, setWeek] = React.useState("");
    const { data: session } = useSession();
    const router = useRouter();

    /** Get user exercise weight */
    const handleExerciseWeight = React.useCallback(async () => {
        if (session && session.user) {
            const response = await fetch(`/api/exercise-weight/?email=${session.user.email}`);
            const result = await response.json() as {
                exercisesData: {
                    exerciseId: string,
                    weight: number,
                }[]
            };

            if (training) {
                Object.entries(training.exercises).map((exercise) => {
                    result.exercisesData.map((data) => {
                        if (exercise[1].exerciseId === data.exerciseId) {
                            exercise[1].weight = data.weight;
                        }
                    });
                });

                setTrainingData(training);
            }
        }
    }, [session, training]);

    React.useEffect(() => {
        /** User logout if session is null */
        async function handleLogout() {
            const logout = await signOut({
                redirect: false,
                callbackUrl: "/login"
            });

            router.replace(logout.url);
        }

        if (session === null) handleLogout();

        else {
            if (router.query.diaId) setWeek(router.query.diaId[0]);
            
            setPlan(router.query.planoId as string);
            handleExerciseWeight();
        }
    }, [router, session, handleExerciseWeight]);

    if (session !== null) {
        if (hasPlanError) {
            return (
                <>
                    <Header backNavigation={true} pathname="/" />
                    
                    <section className={`container animeLeft ${styles.trainingDay}`}>
                        <p>Plano de treino não encontrado.</p>
                    </section>
                </>
            )
        }

        else if (hasWeekError) {
            return (
                <>
                    <Header backNavigation={true} pathname={`/plano/${plan}`} />
                    
                    <section className={`container animeLeft ${styles.trainingDay}`}>
                        <p>Semana de treino não encontrada.</p>
                    </section>
                </>
            )
        }

        else if (hasDayError) {
            return (
                <>
                    <Header backNavigation={true} pathname={`/plano/${plan}/${week}`} />
                    
                    <section className={`container animeLeft ${styles.trainingDay}`}>
                        <p>Dia de treino não encontrado.</p>
                    </section>
                </>
            )
        }

        else {
            if (!trainingData) {
                return (
                    <>
                        <Header />
                    
                        <section className={`container animeLeft ${styles.trainingDayLoading}`}>
                            <h1 className="title-1">
                                Seu treino está sendo carregado
                            </h1>
                            <Spinner animation="border" className={styles.loading} />
                        </section>
                    </>
                )
            }

            else {
                return (
                    <>
                        <Header backNavigation={true} pathname={`/plano/${plan}/${week}`} />

                        <section className={`container animeLeft ${styles.trainingDay}`}>
                            <TrainingExercises training={trainingData} />
                        </section>
                    </>
                )
            }
        }
    }

    else return null;
}

export default TrainingDay