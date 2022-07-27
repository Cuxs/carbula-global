import styles from './toolbar.module.scss'

const DrawerToggleButton = props => (
  <button className={styles['toggle-button']} onClick={props.click}>
      <div className={styles['toggle-button__line']} />
      <div className={styles['toggle-button__line']} />
      <div className={styles['toggle-button__line']} />
  </button>
);

export default DrawerToggleButton;