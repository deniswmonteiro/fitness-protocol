import React from "react";
import { useRouter } from "next/router";
import trainingPlans from "@/helpers/plan-list";
import Training from "@/components/training-day/Training";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

type ISession = {
    user: {
        name: string,
        email: string,
        image: string | null
    },
    expires: string
}

const TrainingPage = ({ trainingWeeks, trainingDays }: { trainingWeeks: string[], trainingDays: string[] }) => {
    const [plan, setPlan] = React.useState(false);
    const [week, setWeek] = React.useState(false);
    const router = useRouter();
    const weekId = router.query.semanaId as string;
    const planId = router.query.planoId as string;

    React.useEffect(() => {
        trainingPlans.find((planName) => {
            if (planName.replace(" ", "-").toLowerCase() === planId) setPlan(true);
        });

        trainingWeeks.find((weekDay) => {
            if (weekDay.replace(" ", "-").toLowerCase() === weekId) setWeek(true);
        });
    }, [planId, weekId, trainingWeeks]);

    return (
        <Training plan={plan} planId={planId}
            week={week}
            weekId={weekId}
            trainingDays={trainingDays} />
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    let session: ISession | null = await getServerSession(context.req, context.res, authOptions);
    const plan = context.params?.planoId as string;
    let trainingWeeks: string[] | null = null;
    let trainingDays: string[] | null = null;

    if (session === null) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        }
    }

    else {
        const planName = plan.split("-").map((planNameItem) => {
            return (planNameItem.substring(0, 1).toUpperCase() + planNameItem.substring(1))
        }).join(" ");
        const planExists = trainingPlans.find((trainingPlan) => planName === trainingPlan);

        if (planExists) {
            // Getting Plan Weeks from database
            const planWeeksreq = await fetch(`${process.env.NEXTAUTH_URL}/api/plan-weeks/?plan=${plan}`);
            const planWeeksRes = await planWeeksreq.json() as {
                weeks: string[]
            };
            trainingWeeks = planWeeksRes.weeks;

            // Getting Plan Days from database
            const planDaysReq = await fetch(`${process.env.NEXTAUTH_URL}/api/plan-days/?plan=${plan}`);
            const planDaysRes = await planDaysReq.json() as {
                days: string[]
            };
            trainingDays = planDaysRes.days;            

            return {
                props: {
                    trainingWeeks,
                    trainingDays
                }
            }
        }

        else {
            return {
                props: {
                    trainingWeeks,
                    trainingDays
                }
            }
        }
    }
}

export default TrainingPage