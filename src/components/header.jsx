import styles from '../styles/header.module.css';

export default function Header() {
    return (
        <header className={styles['header']}>
            <img className={styles['header-logo']} alt='Bastián Paredes' src={require('../images/logo.png')}/>
            <h1 className={styles['header-tittle']}>Imagen a PDF</h1>
        </header>
    );
}

