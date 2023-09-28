import React from "react";
import { useRouter } from "next/router";
import Training from "@/components/training-day/Training";

const trainingWeeks = [
    "Semana 1", "Semana 2", "Semana 3", "Semana 4", "Semana 5", "Semana 6", "Semana 7", "Semana 8", "Semana 9", "Semana 10", "Semana 11", "Semana 12", 
];

const TrainingPage = () => {
    const [week, setWeek] = React.useState(false);
    const router = useRouter();
    const plan = router.query.plan as string;
    const weekId = router.query.semanaId as string;

    React.useEffect(() => {
        window.history.replaceState(null, "", `/treino/${weekId}`);

        trainingWeeks.find((weekDay) => {
            if (weekDay.replace(" ", "-").toLowerCase() === weekId) setWeek(true);
        });
    }, [weekId]);

    return (
        <Training plan={plan} week={week} weekId={weekId} />
    )
}

export default TrainingPage