import React from "react";
import Link from "next/link";
import ArrowLeftIcon from "../icons/arrow-left-icon";
import { Spinner } from "react-bootstrap";
import styles from "./Header.module.css";

type IHeader = {
    backNavigation?: boolean,
    pathname?: string,
    query?: {
        [key: string]: string
    }
}

const Header = ({ backNavigation, pathname, query }: IHeader) => {
    const [loading, setLoading] = React.useState(false);

    return (
        <header className={styles.header}>
            {backNavigation && (
                (loading ? 
                    ( 
                        <Spinner animation="border" size="sm"
                            className={styles.loading} />
                    ) : (
                        <Link href={{ pathname, query }}
                            onClick={() => setLoading(true)}>
                            <ArrowLeftIcon />
                        </Link>
                    )
                )
            )}

            <div className={styles.logo}>
                Fitness Protocols
            </div>
        </header>
    )
}

export default Header