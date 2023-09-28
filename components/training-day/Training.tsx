import React from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../layout/Header";
import TrainingDayCard from "./TrainingDayCard/TrainingDayCard";
import styles from "./Training.module.css";

const trainingDays = [
    "Segunda", "Terca", "Quarta", "Quinta", "Sexta"
];

const Training = ({ plan, week, weekId }: { plan: string, week: boolean, weekId: string }) => {
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
        if (!week) {
            return (
                <>
                    <Header backNavigation={true} pathname="/" />

                    <section className={`container animeLeft ${styles.training}`}>
                        <p>Não há treinos para essa semana.</p>
                    </section>
                </>
            )
        }

        else {
            return (
                <>
                    <Header backNavigation={true} pathname={`/treino`} query={{ plan: plan }} />

                    <section className={`container animeLeft ${styles.training}`}>
                        <h1 className="title-1">
                            <span>{plan.split("-")[0]}</span> {plan.split("-")[1]}
                        </h1>

                        <h2 className="title-2">
                            {weekId.replace("-", " ")}
                        </h2>
                    
                        {trainingDays.map((day) => (
                            <TrainingDayCard key={day} week={weekId} day={day} />
                        ))}
                    </section>
                </>
            )
        }
    }

    else return null;
}

export default Training