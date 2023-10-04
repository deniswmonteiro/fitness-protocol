type IWeek = {
    name: string,
    date: number
}

const days = [
    "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"
];

/** Get dates to fill the calendar */
export const getDates = () => {
    const dateObj = new Date();
    const firstDay = dateObj.getDate() - dateObj.getDay();
    const week: IWeek[] = [];

    for (let i = 0; i < days.length; i++) {
        let nextDate = new Date(dateObj.getTime());
        nextDate.setDate(firstDay + i);

        const nameDayDate = nextDate.getDate();

        week.push({
            name: days[i],
            date: nameDayDate
        });
    }

    return week;
}

/** Get the last day of the week in milliseconds */
export const getLastDayOfTheWeekInMilliseconds = () => {
    const dateObj = new Date();
    const firstDay = dateObj.getDate() - dateObj.getDay();

    const lastDay = new Date(dateObj.getTime());
    lastDay.setDate(firstDay + 6);

    const year = lastDay.getFullYear();
    const month = (lastDay.getMonth() + 1).toString().length === 1 ?
        `0${lastDay.getMonth() + 1}` : 
        lastDay.getMonth() + 1;
    const day = lastDay.getDate();

    return Date.parse(`${year}/${month}/${day} 23:59:59`) - Date.now();
}

export const getDay = (day: number) => days[day];

export const getDayName = (day: string) => {
    let dayName = "";

    switch (day) {
        case "domingo":
            dayName = "Domingo";
            break;

        case "segunda":
            dayName = "Segunda";
            break;

        case "terca":
            dayName = "Terça";
            break;

        case "quarta":
            dayName = "Quarta";
            break;

        case "quinta":
            dayName = "Quinta";
            break;

        case "sexta":
            dayName = "Sexta";
            break;

        case "sabado":
            dayName = "Sábado";
            break;
    }

    return dayName;
}

/** Order days of the week */
export function orderWeekDaysArr(days: string[]) {
    const daysArr: string[] = [];

    days.find((day) => {
        if (day === "Domingo") daysArr.push(day);
    });

    days.find((day) => {
        if (day === "Segunda") daysArr.push(day);
    });

    days.find((day) => {
        if (day === "Terça") daysArr.push("Terca");
    });

    days.find((day) => {
        if (day === "Quarta") daysArr.push(day);
    });

    days.find((day) => {
        if (day === "Quinta") daysArr.push(day);
    });

    days.find((day) => {
        if (day === "Sexta") daysArr.push(day);
    });

    days.find((day) => {
        if (day === "Sábado") daysArr.push("Sabado");
    });

    return daysArr;
}
