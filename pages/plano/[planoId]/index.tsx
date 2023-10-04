import React from "react";
import { useRouter } from "next/router";
import trainingPlans from "@/helpers/plan-list";
import Plan from "@/components/plan/Plan";
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

const PlanItemPage = ({ trainingWeeks }: { trainingWeeks: string[] }) => {
    const [plan, setPlan] = React.useState(false);
    const router = useRouter();
    const planId = router.query.planoId as string;

    React.useEffect(() => {
        trainingPlans.find((planName) => {
            if (planName.replace(" ", "-").toLowerCase() === planId) setPlan(true);
        });
    }, [planId]);

    return (
        <Plan plan={plan} planId={planId} trainingWeeks={trainingWeeks} />
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    let session: ISession | null = await getServerSession(context.req, context.res, authOptions);
    const plan = context.params?.planoId as string;
    let trainingWeeks: string[] | null = null;

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
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/plan-weeks/?plan=${plan}`);
            const result = await response.json() as {
                weeks: string[]
            };
            
            trainingWeeks = result.weeks;

            return {
                props: {
                    trainingWeeks
                }
            }
        }

        else {
            return {
                props: {
                    trainingWeeks
                }
            }
        }
    }
}

export default PlanItemPage