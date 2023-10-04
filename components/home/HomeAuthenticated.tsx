import React from "react";
import { getWithExpiry } from "@/helpers/localstorage-util";
import Header from "../layout/Header";
import Calendar from "../ui/Calendar";
import trainingPlans from "@/helpers/plan-list";
import ProfileModal from "./ProfileModal/ProfileModal";
import LogoutModal from "./LogoutModal/LogoutModal";
import TrainingPlanCard from "./TrainingPlanCard/TrainingPlanCard";
import PersonCircleIcon from "../icons/person-circle-icon";
import styles from "./HomeAuthenticated.module.css";

type IUserData = {
    name: string,
    gender: "1" | "2",
    weight: string,
    height: string
}

const HomeAuthenticated = ({ user }: { user: IUserData }) => {
    const [dayDone, setDayDone] = React.useState("");

    /** Modal state */
    const [showProfileModal, setShowProfileModal] = React.useState(false);
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);
    
    /** Profile modal */
    const handleShowProfileModal = () => setShowProfileModal(true);
    const handleCloseProfileModal = () => setShowProfileModal(false);

    /** Logout modal */
    const handleShowLogoutModal = () => setShowLogoutModal(true);
    const handleCloseLogoutModal = () => setShowLogoutModal(false);

    React.useEffect(() => {
        /** Get day done from local storage */
        const calendarData = getWithExpiry(`Calendar`) as string;

        if (calendarData !== null) setDayDone(calendarData);
    }, []);

    return (
        <>
            <Header />

            <section className="container animeLeft">
                <div className={styles.title}>
                    <h1 className="title-1">
                        Olá, {user.name}
                    </h1>
                    <button onClick={handleShowProfileModal}>
                        <PersonCircleIcon />
                    </button>
                </div>
                <div className={styles.workoutsWeek}>
                    <h3 className="title-3">Treinos feitos na semana</h3>
                    <Calendar dayDone={dayDone} />
                </div>
                <div className={styles.workouts}>
                    <h2 className="title-2">Planos de Treino</h2>

                    {/* Plan list */}
                    {trainingPlans.map((plan) => (
                        <TrainingPlanCard key={plan} plan={plan} />
                    ))}
                </div>
            </section>

            {/* Profile modal */}
            <ProfileModal user={user}
                showProfileModal={showProfileModal}
                handleCloseProfileModal={handleCloseProfileModal}
                handleShowLogoutModal={handleShowLogoutModal} />

            {/* Logout modal */}
            <LogoutModal showLogoutModal={showLogoutModal}
                handleCloseLogoutModal={handleCloseLogoutModal} />
        </>
    )
}

export default HomeAuthenticated