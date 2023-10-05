import React from "react";
import { GetStaticProps } from "next";
import trainingPlans from "@/helpers/plan-list";
import TrainingDay from "@/components/training-day/TrainingDay";

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
    "technique-1": string,
    "description-1": string,
    "technique-2": string,
    "description-2": string,
    "technique-3": string,
    "description-3": string,
    "technique-4": string,
    "description-4": string,
    "grouping": string,
    weight: number,
    notes: string
}

type IDayPage = {
    hasPlanError: boolean,
    hasWeekError: boolean,
    hasDayError: boolean,
    trainingData: IData
}

const DayPage = ({ hasPlanError, hasWeekError, hasDayError, trainingData}: IDayPage) => {
    return (
        <TrainingDay hasPlanError={hasPlanError}
            hasWeekError={hasWeekError}
            hasDayError={hasDayError}
            training={trainingData} />
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    const plan = context.params?.planoId as string;
    const week = context.params?.diaId?.[0] as string;
    const day = context.params?.diaId?.[1];

    if (plan && week && day) {
        // Getting Plan Weeks from database
        const planWeeksReq = await fetch(`${process.env.NEXTAUTH_URL}/api/plan-weeks/?plan=${plan}`);
        const planWeeksRes = await planWeeksReq.json() as {
            weeks: string[]
        };
        const trainingWeeks = planWeeksRes.weeks;

        // Getting Plan Days from database
        const planDaysReq = await fetch(`${process.env.NEXTAUTH_URL}/api/plan-days/?plan=${plan}`);
        const planDaysRes = await planDaysReq.json() as {
            days: string[]
        };
        const trainingDays = planDaysRes.days;

        const planName = plan.split("-").map((planNameItem) => {
            return (planNameItem.substring(0, 1).toUpperCase() + planNameItem.substring(1))
        }).join(" ");

        const weekName = week.split("-").map((weekNameItem) => {
            return (weekNameItem.substring(0, 1).toUpperCase() + weekNameItem.substring(1))
        }).join(" ");

        const dayName = day.substring(0, 1).toUpperCase() + day.substring(1)

        const planExists = trainingPlans.find((trainingPlan) => planName === trainingPlan);
        const weekExists = trainingWeeks.find((trainingWeek) => weekName === trainingWeek);
        const dayExists = trainingDays.find((trainingDay) => dayName === trainingDay);

        if (!planExists) {
            return {
                props: {
                    hasPlanError: true,
                    hasWeekError: false,
                    hasDayError: false,
                }
            }
        }

        else if (!weekExists) {
            return {
                props: {
                    hasPlanError: false,
                    hasWeekError: true,
                    hasDayError: false,
                }
            }
        }

        else if (!dayExists) {
            return {
                props: {
                    hasPlanError: false,
                    hasWeekError: false,
                    hasDayError: true,
                }
            }
        }

        else {
            const trainingReq = await fetch(`${process.env.NEXTAUTH_URL}/api/training/?plan=${plan}&week=${week}&day=${day}`);
            const trainingRes = await trainingReq.json() as { data: IData };
            const trainingData = trainingRes.data;

            return {
                props: {
                    hasPlanError: false,
                    hasWeekError: false,
                    hasDayError: false,
                    trainingData
                },
                revalidate: 10
            }
        }
    }

    else {
        return {
            props: {
                hasPlanError: false,
                hasWeekError: false,
                hasDayError: true,
            }
        }
    }
}

export async function getStaticPaths() {
    let paths = [];
    
    for (let i = 0; i < trainingPlans.length; i++) {
        const plan = trainingPlans[i].replace(" ", "-").toLowerCase();

        // Getting Plan Days from database
        const planDaysReq = await fetch(`${process.env.NEXTAUTH_URL}/api/plan-days/?plan=${plan}`);
        const planDaysRes = await planDaysReq.json() as {
            days: string[]
        };
        const trainingDays = planDaysRes.days;

        for (let j = 0; j < trainingDays.length; j++) {
            const day = [trainingDays[j].toLowerCase()];

            paths.push({
                params: {
                    planoId: plan,
                    diaId: day
                }
            });
        }
    }

    return {
        paths,
        fallback: true
    }
}

export default DayPage