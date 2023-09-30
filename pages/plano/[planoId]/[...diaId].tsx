import React from "react";
import { GetStaticProps } from "next";
import TrainingDay from "@/components/training-day/TrainingDay";

type IResult = {
    data: IData
}

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
    technique: string,
    "is-grouping": boolean,
    weight: number,
    description: string
}

type IDayPage = {
    hasPlanError: boolean,
    hasWeekError: boolean,
    hasDayError: boolean,
    trainingData: IData
}

const trainingPlans = [
    "Mass Protocol"
];

const trainingWeeks = [
    "Semana 1", "Semana 2", "Semana 3", "Semana 4", "Semana 5", "Semana 6", "Semana 7", "Semana 8", "Semana 9", "Semana 10", "Semana 11", "Semana 12", 
];

const trainingDays = [
    "Segunda", "Terca", "Quarta", "Quinta", "Sexta"
];

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
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/training/?plan=${plan}&week=${week}&day=${day}`);
            const result = await response.json() as IResult;
            const trainingData = result.data;

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
        for (let j = 0; j < trainingDays.length; j++) {
            paths.push({
                params: {
                    planoId: trainingPlans[i].replace(" ", "-").toLowerCase(),
                    diaId: [trainingDays[j].toLowerCase()]
                }
            });
        }
    }

    return {
        paths: paths,
        fallback: true
    }
}

export default DayPage