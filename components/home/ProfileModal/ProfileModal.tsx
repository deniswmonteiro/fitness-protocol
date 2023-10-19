import React from "react";
import Link from "next/link";
import { Card, Modal, Spinner } from "react-bootstrap";
import ButtonComponent from "@/components/forms/ButtonComponent";
import PencilIcon from "../../icons/pencil-icon";
import PersonIcon from "../../icons/person-icon";
import styles from "./ProfileModal.module.css";

type IUserData = {
    name: string,
    gender: "1" | "2",
    weight: string,
    height: string
}

type IProfileModal = {
    user: IUserData,
    showProfileModal: boolean,
    handleCloseProfileModal: () => void,
    handleShowLogoutModal: () => void,
}

const ProfileModal = ({ user, showProfileModal, handleCloseProfileModal, handleShowLogoutModal }: IProfileModal) => {
    const [loading, setLoading] = React.useState(false);

    /** Hide Profile modal and show Logout modal */
    const handleProfileLogoutModalTransition = () => {
        handleCloseProfileModal();
        handleShowLogoutModal();
    }

    return (
        <Modal show={showProfileModal} onHide={handleCloseProfileModal}>
            <Modal.Header closeButton>
                <Modal.Title>Meu Perfil</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Link href="/perfil" onClick={() => setLoading(true)}>
                    <Card className={styles.cardBg}>
                        <Card.Body className={styles.cardBgContent}>
                            <div className={styles.userInfo}>
                                <PersonIcon />
                                <ul>
                                    <li>
                                        {user.name}
                                    </li>
                                    <li>
                                        {user.weight} kg
                                    </li>
                                    <li>
                                        {user.height} m
                                    </li>
                                </ul>
                            </div>

                            {loading ? 
                                (
                                    <Spinner animation="border" variant="light" size="sm"
                                        className={styles.loading} />
                                ): (
                                    <PencilIcon />
                                )
                            }
                        </Card.Body>
                    </Card>
                </Link>
            </Modal.Body>
            <Modal.Footer className={styles.modalProfileFooter}>
                <ButtonComponent type="button" style="text"
                    textType="text-danger"
                    onClick={handleProfileLogoutModalTransition}>
                    Sair
                </ButtonComponent>
            </Modal.Footer>
        </Modal>
    )
}

export default ProfileModal