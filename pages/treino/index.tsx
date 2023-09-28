import React from "react";
import { useRouter } from "next/router";
import Plan from "@/components/plan/Plan";

const trainingPlans = [
    "Mass Protocol"
]

const TrainingPage = () => {
    const [plan, setPlan] = React.useState(false);
    const router = useRouter();
    const planId = router.query.plan as string;

    React.useEffect(() => {
        window.history.replaceState(null, "", `/treino`);
        
        trainingPlans.find((planName) => {
            if (planName.replace(" ", "-").toLowerCase() === planId) setPlan(true);
        });
    }, [planId]);

    return (
        <Plan plan={plan} planId={planId} />
    );
}

export default TrainingPage