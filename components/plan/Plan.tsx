import React from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../layout/Header";
import TrainingWeekCard from "./TrainingWeekCard/TrainingWeekCard";
import styles from "./Plan.module.css";

const trainingWeeks = [
    "Semana 1", "Semana 2", "Semana 3", "Semana 4", "Semana 5", "Semana 6", "Semana 7", "Semana 8", "Semana 9", "Semana 10", "Semana 11", "Semana 12", 
];

const Plan = ({ plan, planId }: { plan: boolean, planId: string }) => {
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

                    <section className={`container animeLeft ${styles.plan}`}>
                        <p>Plano de treino não encontrado.</p>
                    </section>
                </>
            )
        }

        else {
            return (
                <>
                    <Header backNavigation={true} pathname="/" />

                    <section className={`container animeLeft ${styles.plan}`}>
                        <h1 className="title-1">
                            <span>{planId.split("-")[0]}</span> {planId.split("-")[1]}
                        </h1>
                    
                        {trainingWeeks.map((week) => (
                            <TrainingWeekCard key={week} plan={planId} week={week} />
                        ))}
                    </section>
                </>
            )
        }
    }

    else return null;
}

export default Plan