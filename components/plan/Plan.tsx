import React from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../layout/Header";
import TrainingWeekCard from "./TrainingWeekCard/TrainingWeekCard";
import styles from "./Plan.module.css";

type IPlan = {
    plan: boolean,
    planId: string,
    trainingWeeks: string[]
}

const Plan = ({ plan, planId, trainingWeeks }: IPlan) => {
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