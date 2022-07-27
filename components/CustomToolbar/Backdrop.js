import styles from './toolbar.module.scss';

const Backdrop = props => (
  <div className={styles.backdrop} onClick={props.click} />)

export default Backdrop