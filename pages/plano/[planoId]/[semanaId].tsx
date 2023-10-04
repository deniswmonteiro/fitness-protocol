import React from "react";
import { useRouter } from "next/router";
import trainingPlans from "@/helpers/plan-list";
import Training from "@/components/training-day/Training";

const trainingWeeks = [
    "Semana 1", "Semana 2", "Semana 3", "Semana 4", "Semana 5", "Semana 6", "Semana 7", "Semana 8", "Semana 9", "Semana 10", "Semana 11", "Semana 12", 
];

const TrainingPage = () => {
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
    }, [planId, weekId]);

    return (
        <Training plan={plan} planId={planId} week={week} weekId={weekId} />
    )
}

export default TrainingPage