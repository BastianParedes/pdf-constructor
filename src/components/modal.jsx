import styles from '../styles/modal.module.css';

export default function Modal() {
    return (
        <div className={styles['modal-container']}>
            <div className={styles['modal-content']}>
                <img alt='Loading' src={require('../images/loading.gif')} className={styles['loading-gif']}/>
            </div>
        </div>
    );
}

