import React from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../layout/Header";
import TrainingDayCard from "./TrainingDayCard/TrainingDayCard";
import styles from "./Training.module.css";

type ITraining = {
    plan: boolean,
    planId: string,
    week: boolean,
    weekId: string,
    trainingDays: string[]
}

const Training = ({ plan, planId, week, weekId, trainingDays }: ITraining) => {
    const { data: session } = useSession();
    const router = useRouter();

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
    }, [router, session]);

    if (session !== null) {
        if (!plan) {
            return (
                <>
                    <Header backNavigation={true} pathname="/" />

                    <section className={`container animeLeft ${styles.training}`}>
                        <p>Plano de treino não encontrado.</p>
                    </section>
                </>
            )
        }

        else if (!week) {
            return (
                <>
                    <Header backNavigation={true} pathname={`/plano/${planId}`} />

                    <section className={`container animeLeft ${styles.training}`}>
                        <p>Não há treinos para essa semana.</p>
                    </section>
                </>
            )
        }

        else {
            return (
                <>
                    <Header backNavigation={true} pathname={`/plano/${planId}`} />

                    <section className={`container animeLeft ${styles.training}`}>
                        <h1 className="title-1">
                            <span>{planId.split("-")[0]}</span> {planId.split("-")[1]}
                        </h1>

                        <h2 className="title-2">
                            {weekId.replace("-", " ")}
                        </h2>
                    
                        {trainingDays.map((day) => (
                            <TrainingDayCard key={day} plan={planId} week={weekId} day={day} />
                        ))}
                    </section>
                </>
            )
        }
    }

    else return null;
}

export default Training