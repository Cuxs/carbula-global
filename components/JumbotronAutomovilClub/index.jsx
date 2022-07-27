import { Fragment } from 'react';
import styles from './jumbotron.module.scss';

const JumbotronAutomovilClub = ({title, subtitle}) => {
  return (
    <div className={styles.jumbotron__container}>
      <div className={styles.text__container}>
        <h2 className={styles.title}>{title[0]}<br/>{title[1]}</h2>
        <p className={styles.subtitle}><ul>{subtitle.map(element=><Fragment><li>{element}</li></Fragment>)}</ul></p>
      </div>

    </div>
  )

}

export default JumbotronAutomovilClub;