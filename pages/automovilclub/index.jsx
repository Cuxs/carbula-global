import React, { useState, Fragment, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import Head from '../../components/CustomHeads/headAutomovilClub';
import Jumbotron from '../../components/JumbotronAutomovilClub'
import styles from './../index/home.module.scss'
import Image from 'next/image'
import { getZonas } from '../../utils/fetches';
import { useSpring, animated } from "react-spring";
import { hotjar } from 'react-hotjar'
import { getCountryCode, clearLocalStorage, getHotjarId, getPhoneNumber, getWhatsappNumber, getTitleByCountry } from '../../utils/helpers';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';


const BlackoutComponent = dynamic(import('../../components/BlackoutComponent'))
const Carousel = dynamic(import('@brainhubeu/react-carousel'), { ssr: false })
const NuestrosClientes = dynamic(import('../../components/NuestrosClientes'))
const FaqComponentAutomovilClub = dynamic(import('../../components/FaqComponentAutomovilClub'))
const QuoteComponent = dynamic(import('../../components/QuoteComponent'))
const FooterInfo = dynamic(import('../../components/FooterInfo'))
const Button = dynamic(import('../../components/Button'))
const Nav = dynamic(import('../../components/CustomNav'))

export async function getServerSideProps(context) {
  const { referer } = context.req.headers
  try {
    const { data } = await getZonas(getCountryCode(context.locale));
    const parsedZonas = data.map((row) => ({
      value: row.id,
      label: row.nombre,
      referer: referer ? referer : null
    }))
    return {
      props: {
        zonas: parsedZonas,
        referer: referer ? referer : null,
        COUNTRY_CODE: getCountryCode(context.locale),
        ...(await serverSideTranslations(context.locale, ['commonAutomovilClub', 'BlackoutComponent', 'FaqComponentAutomovilClub', 'FooterInfo', 'SellForm'])),
      }
    }
  } catch (e) {
    console.log(e)
    return {
      props: {
        referer: referer ? referer : null,
        COUNTRY_CODE: getCountryCode(context.locale),
        ...(await serverSideTranslations(context.locale, ['commonAutomovilClub', 'BlackoutComponent', 'FaqComponentAutomovilClub', 'SellForm'])),
      }
    }
  }
}

const Home = ({ zonas, referer, COUNTRY_CODE }) => {
  const { t } = useTranslation('commonAutomovilClub')
  const SellForm = useCallback(dynamic(() => {
    const SellForms = {
      'ar': import('../../components/SellForm'),
      'cl': import('../../components/SellFormChile'),
      'uy': import('../../components/SellForm'),
      'mx': import('../../components/SellForm'),
    }
    return SellForms[COUNTRY_CODE]
  }),[])
  const router = useRouter();
  const [title, setTitle] = useState(['Con el Automóvil Club Chile,', 'ahora puedes vender tu auto.'])
  const [subtitle, setSubtitle] = useState(['Sin salir de tu casa, gana hasta un 25% más', 'De forma rápida, segura y sin complicaciones', 'Nos encargamos de todo el proceso de venta']);
  const [step, setStep] = useState(0)
  const [overlayBackground, setOverlayBackground] = useState(false);

  const titleProps = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 500 })

  useEffect(() => {
    hotjar.initialize(getHotjarId(COUNTRY_CODE), 6)
    clearLocalStorage()
    router.prefetch('/cotizacion')
  }, [])

  useEffect(() => {
    switch (step) {
      case 0:
        setTitle(['Con el Automóvil Club Chile,', 'ahora puedes vender tu auto.'])
        setSubtitle(['Sin salir de tu casa, gana hasta un 25% más', 'De forma rápida, segura y sin complicaciones', 'Nos encargamos de todo el proceso de venta'])
        break;
      case 1:
        setTitle([`Estás más cerca de vender ${t('tu')} auto`])
        setSubtitle([`${t('contanos')}`, `${t('dedicate')}`])
        window.scrollTo(0, 0)
        break;
      default:
        break;
    }
  }, [step])

  useEffect(() => {
    if (overlayBackground) {
      window.scrollTo(0, 0)
      const targetElement = document.querySelector('#blackout')
      disableBodyScroll(targetElement)
    } else {
      clearAllBodyScrollLocks()
    }
  }, [overlayBackground])

  const getSomosText = () => {
    return texts[COUNTRY_CODE]
  }
  return (
    <Fragment>
      <Head title={getTitleByCountry(COUNTRY_CODE)} />
      <BlackoutComponent overlayBackground={overlayBackground} />
      <Nav />
      <animated.div style={titleProps}>
        <Jumbotron title={title} subtitle={subtitle} />
      </animated.div>
      <SellForm step={step} setStep={setStep} setOverlayBackground={setOverlayBackground} zonas={zonas} referer={referer} COUNTRY_CODE={COUNTRY_CODE} />
      <section className={styles.section5__container}>
        <div className={styles.text__container}>
        <h3>{t('section1Subtitle4')}</h3>
          <h1 className={styles.section1__title}>{t('section1Title')}</h1>
          <div className={styles['benefits--desktop']}>
            <h3>{t('section1Subtitle1')}</h3>
            <p>{t('section1Subtitle1Text')}</p>
            <h3>{t('section1Subtitle2')}</h3>
            <p>{t('section1Subtitle2Text')}</p>
            <h3>{t('section1Subtitle3')}</h3>
            <p>{t('section1Subtitle3Text')}</p>
          </div>
          <div className={styles['benefits--mobile']}>
            <Carousel dots infinite autoplay>
              <div className={styles.carousel__step}>
                <div className={styles.step__title}>
                  <h3>{t('section1Subtitle1')}</h3>
                </div>
                <p>{t('section1Subtitle1Text')}</p>
              </div>
              <div className={styles.carousel__step}>
                <div className={styles.step__title}>
                  <h3>{t('section1Subtitle2')}</h3>
                </div>
                <p>{t('section1Subtitle2Text')}</p>
              </div>
              <div className={styles.carousel__step}>
                <div className={styles.step__title}>
                  <h3>{t('section1Subtitle3')}</h3>
                </div>
                <p>{t('section1Subtitle3Text')}</p>
              </div>
            </Carousel>
          </div>
        </div>
        <div className={styles.banner__carbula}>
          <Image src="/images/banner-carbula.png" width="690" height="640" alt="Banner de Cárbula Chile" />
        </div>
      </section>
      <section>
        <div className={styles.section2__container}>
          <div>
            <h3 className={styles.text__secondary}>{t('contactanos')}</h3>
            <div className={styles.image} >
              <Image src="/images/carbula_contacto.png" width="450" height="438" alt="Contacto" />
            </div>
            <div className={styles.buttons__container}>
              <a href={`tel:${getPhoneNumber(COUNTRY_CODE)}`}><Button secondaryOutlined>Llamar</Button></a>
              <a href={`http://api.whatsapp.com/send?phone=${getWhatsappNumber(COUNTRY_CODE)}&text=Hola,%20tengo%20una%20consulta`} target="__blank"><Button secondaryOutlined>Whatsapp</Button></a>
            </div>
          </div>
          <div>
            <h3 className={styles.text__primary}>{t('faq')}</h3>
            <FaqComponentAutomovilClub />
          </div>
        </div>
      </section>
      <br></br><br></br> <hr></hr>
      <section>
        <FooterInfo grey country_code={COUNTRY_CODE} />
      </section>
    </Fragment>
  )
}


export default React.memo(Home)
