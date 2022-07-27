import { useRouter } from 'next/router';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { useTranslation } from 'react-i18next';
import styles from "./faq.module.scss";
const FaqComponentAutomovilClub = () => {
  const { t } = useTranslation('FaqComponentAutomovilClub')
  const router = useRouter()
  return (
    <Accordion allowZeroExpanded className={styles.accordion}>
      <AccordionItem className={styles.accordion__item}>
        <AccordionItemHeading className={styles.accordion__heading}>
          <AccordionItemButton className={styles.accordion__button}>
          {t('porqueCarbulaTitle')}
                    </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel className={styles.accordion__panel}>
          <p>{t('porqueCarbula')}</p>
        </AccordionItemPanel>
      </AccordionItem>
      <AccordionItem className={styles.accordion__item}>
        <AccordionItemHeading className={styles.accordion__heading}>
          <AccordionItemButton className={styles.accordion__button}>
          {t('valorVehiculoTitle')}
                    </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel  className={styles.accordion__panel}>
          <p>{t('valorVehiculo')}</p>
        </AccordionItemPanel>
      </AccordionItem>
      <AccordionItem className={styles.accordion__item}>
        <AccordionItemHeading className={styles.accordion__heading}>
          <AccordionItemButton className={styles.accordion__button}>
          <span className={styles['desktop-only']}>{t('tasacionTitleDesktop')}</span>
          <span className={styles['mobile-only']}>{t('tasacionTitleMobile')}</span>
                    </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel  className={styles.accordion__panel}>
          <p>{t('tasacion')}</p>
        </AccordionItemPanel>
      </AccordionItem>
      <AccordionItem className={styles.accordion__item}>
        <AccordionItemHeading className={styles.accordion__heading}>
          <AccordionItemButton className={styles.accordion__button}>
          {t('ustedesCompranTitle')}
                    </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel  className={styles.accordion__panel}>
          <p>{t('ustedesCompran')}</p>
        </AccordionItemPanel>
      </AccordionItem>
      <AccordionItem className={styles.accordion__item}>
        <AccordionItemHeading className={styles.accordion__heading}>
          <AccordionItemButton className={styles.accordion__button}>
          {t('queHaceAsesorTitle')}
                    </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel  className={styles.accordion__panel}>
          <p>{t('queHaceAsesor')}</p>
        </AccordionItemPanel>
      </AccordionItem>
      <AccordionItem className={styles.accordion__item}>
        <AccordionItemHeading className={styles.accordion__heading}>
          <AccordionItemButton className={styles.accordion__button}>
          {t('siVendoConsesionariaTitle')}
                    </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel  className={styles.accordion__panel}>
          <p>{t('siVendoConsesionaria')}</p>
        </AccordionItemPanel>
      </AccordionItem>
      <AccordionItem className={styles.accordion__item}>
        <AccordionItemHeading className={styles.accordion__heading}>
          <AccordionItemButton className={styles.accordion__button}>
          {t('cuandoMePaganTitle')}
                    </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel  className={styles.accordion__panel}>
          <p>{t('cuandoMePagan')}</p>
        </AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default FaqComponentAutomovilClub;