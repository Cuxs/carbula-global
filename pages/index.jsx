import React, { useState, Fragment, useEffect, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import Head from '../components/head'
import Jumbotron from '../components/Jumbotron'
import styles from './index/home.module.scss'
import Image from 'next/image'
import { getZonas } from '../utils/fetches';
import { useSpring, animated } from "react-spring";
import { hotjar } from 'react-hotjar'
import { clearCotization, getCountryCode, clearLocalStorage, getHotjarId, getPhoneNumber, getWhatsappNumber, getTitleByCountry } from '../utils/helpers';
import { upperFirst } from 'lodash'
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { ChakraProvider } from '@chakra-ui/react'


const BlackoutComponent = dynamic(import('../components/BlackoutComponent'))
const Carousel = dynamic(import('@brainhubeu/react-carousel'), { ssr: false })
const NuestrosClientes = dynamic(import('../components/NuestrosClientes'))
const FaqComponent = dynamic(import('../components/FaqComponent'))
const QuoteComponent = dynamic(import('../components/QuoteComponent'))
const FooterInfo = dynamic(import('../components/FooterInfo'))
const Button = dynamic(import('../components/Button'))
const Nav = dynamic(import('../components/nav'))

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
        ...(await serverSideTranslations(context.locale, ['common', 'BlackoutComponent', 'FaqComponent', 'FooterInfo', 'SellForm'])),
      }
    }
  } catch (e) {
    console.log(e)
    return {
      props: {
        referer: referer ? referer : null,
        COUNTRY_CODE: getCountryCode(context.locale),
        ...(await serverSideTranslations(context.locale, ['common', 'BlackoutComponent', 'FaqComponent', 'SellForm'])),
      }
    }
  }
}

const Home = ({ zonas, referer, COUNTRY_CODE }) => {
  const { t } = useTranslation('common')
  const SellForm = useCallback(dynamic(() => {
    const SellForms = {
      'ar': import('../components/SellForm'),
      'cl': import('../components/SellFormChile'),
      'uy': import('../components/SellForm'),
      'mx': import('../components/SellForm'),
    }
    return SellForms[COUNTRY_CODE]
  }),[])
  const router = useRouter();
  const [title, setTitle] = useState([`Vendemos ${t('tu')} auto de manera segura`, 'Gana hasta un 25% más.'])
  const [subtitle, setSubtitle] = useState(['Garantizamos el cobro seguro de la venta. Nos encargamos de todo el proceso de venta.', 'Respondemos todas las consultas de los compradores.']);
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
        setTitle([`${t('titleVendemosL1')}`, `${t('titleVendemosL2')}`])
        setSubtitle([t('subtitleVendemosL1'), t('subtitleVendemosL2'), t('subtitleVendemosL3')])
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
    const texts = {
      ar: <Fragment>SOMOS UNA STARTUP POTENCIADA POR <a target="__blank" rel="noopener noreferrer" href="https://embarca.tech">EMBARCA</a>,<a target="__blank" href="https://www.corfo.cl/sites/cpp/homecorfo">CORFO</a>, <a target="__blank" rel="noopener noreferrer" href="https://www.anii.org.uy/">ANNI</a>, <a target="__blank" rel="noopener noreferrer" href="https://www.startupchile.org">STARTUP CHILE</a>, <a target="__blank" rel="noopener noreferrer" href="https://www.seedstars.com/funds/international/">SEEDSTARS</a> y <a target="__blank" rel="noopener noreferrer" href="https://guil.cl/">GÜIL MOBILITY VENTURES</a>. <br></br> COMPROMETIDA EN REINVENTAR LA ANTIGUA Y ENGORROSA EXPERIENCIA A LA HORA DE VENDER O COMPRAR VEHÍCULOS.<br></br><b>VENDEMOS DE MANERA 100% SEGURA.</b></Fragment>,
      cl: <Fragment>SOMOS UNA STARTUP POTENCIADA POR <a target="__blank" rel="noopener noreferrer" href="https://embarca.tech">EMBARCA</a>,<a target="__blank" href="https://www.corfo.cl/sites/cpp/homecorfo">CORFO</a>, <a target="__blank" rel="noopener noreferrer" href="https://www.anii.org.uy/">ANNI</a>, <a target="__blank" rel="noopener noreferrer" href="https://www.startupchile.org">STARTUP CHILE</a>, <a target="__blank" rel="noopener noreferrer" href="https://www.seedstars.com/funds/international/">SEEDSTARS</a> y <a target="__blank" rel="noopener noreferrer" href="https://guil.cl/">GÜIL MOBILITY VENTURES</a>. <br></br> COMPROMETIDA EN REINVENTAR LA ANTIGUA Y ENGORROSA EXPERIENCIA A LA HORA DE VENDER O COMPRAR VEHÍCULOS.<br></br><b>VENDEMOS DE MANERA 100% SEGURA.</b></Fragment>,
      uy: <Fragment>SOMOS UNA STARTUP POTENCIADA POR <a target="__blank" rel="noopener noreferrer" href="https://embarca.tech">EMBARCA</a>,<a target="__blank" href="https://www.corfo.cl/sites/cpp/homecorfo">CORFO</a>, <a target="__blank" rel="noopener noreferrer" href="https://www.anii.org.uy/">ANNI</a>, <a target="__blank" rel="noopener noreferrer" href="https://www.startupchile.org">STARTUP CHILE</a>, <a target="__blank" rel="noopener noreferrer" href="https://www.seedstars.com/funds/international/">SEEDSTARS</a> y <a target="__blank" rel="noopener noreferrer" href="https://guil.cl/">GÜIL MOBILITY VENTURES</a>. <br></br> COMPROMETIDA EN REINVENTAR LA ANTIGUA Y ENGORROSA EXPERIENCIA A LA HORA DE VENDER O COMPRAR VEHÍCULOS.<br></br><b>VENDEMOS DE MANERA 100% SEGURA.</b></Fragment>,
      mx: <Fragment>SOMOS UN MARKETPLACE POTENCIADO POR <a target="__blank" rel="noopener noreferrer" href="https://embarca.tech">EMBARCA</a>,<a target="__blank" href="https://www.corfo.cl/sites/cpp/homecorfo">CORFO</a>, <a target="__blank" rel="noopener noreferrer" href="https://www.anii.org.uy/">ANNI</a>, <a target="__blank" rel="noopener noreferrer" href="https://www.startupchile.org">STARTUP CHILE</a>, <a target="__blank" rel="noopener noreferrer" href="https://www.seedstars.com/funds/international/">SEEDSTARS</a> y <a target="__blank" rel="noopener noreferrer" href="https://guil.cl/">GÜIL MOBILITY VENTURES</a>. <br></br> COMPROMETIDA EN REINVENTAR LA ANTIGUA Y ENGORROSA EXPERIENCIA A LA HORA DE VENDER O COMPRAR AUTOS.<br></br><b>VENDEMOS DE MANERA 100% SEGURA.</b></Fragment>
    }
    return texts[COUNTRY_CODE]
  }
  return (
    <Fragment>
      <ChakraProvider>
        <Head title={getTitleByCountry(COUNTRY_CODE)} />
        <BlackoutComponent overlayBackground={overlayBackground} />
        <Nav />
        <animated.div style={titleProps}>
          <Jumbotron title={title} subtitle={subtitle} />
        </animated.div>
        <SellForm step={step} setStep={setStep} setOverlayBackground={setOverlayBackground} zonas={zonas} referer={referer} COUNTRY_CODE={COUNTRY_CODE} />
        <section className={styles.section1__container}>
          <div className={styles.text__container}>
            <h2 className={styles.section1__title}>{t('section1Title')}</h2>
            {/*<h3 className={styles.section1__title}>{t('section1TitleMotivos')}</h3>*/}
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
          <div className={styles.couple__image}>
            <Image src="/images/carbula_couple.webp" width="690" height="640" alt="Pareja" />
          </div>
        </section>
        <section>
          <QuoteComponent text={['El mundo está cambiando.', 'La forma de vender y comprar', 'vehículos, también.']} />
        </section>
        <section>
          <div className={styles.section2__container}>
            <div>
              <h3 className={styles.text__secondary}>{t('contactanos')}</h3>
              <div className={styles.image} >
                <Image src="/images/carbula_contacto.png" width="450" height="438" alt="Contacto" />
              </div>
              <div>
                <p>{t('contactanosP1')}</p>
                <p>{t('contactanosP2')}</p>
              </div>
              <div className={styles.buttons__container}>
                <a href={`tel:${getPhoneNumber(COUNTRY_CODE)}`}><Button secondaryOutlined>Llamar</Button></a>
                <a href={`http://api.whatsapp.com/send?phone=${getWhatsappNumber(COUNTRY_CODE)}&text=Hola,%20tengo%20una%20consulta`} target="__blank"><Button secondary><b>Whatsapp</b></Button></a>
              </div>
            </div>
            <div>
              <h3 className={styles.text__primary}>{t('faq')}</h3>
              <FaqComponent />
            </div>
          </div>
        </section>
        <section className={styles.section3}>
          <div className={styles.section3__container}>
            <h3 className={styles.text__primary}>{t('testimonios')}</h3>
            <NuestrosClientes country_code={COUNTRY_CODE} />
          </div>
          <div className={styles.somos__text}>{getSomosText()}</div>
          <hr />
        </section>
        <section>
          <FooterInfo grey country_code={COUNTRY_CODE} />
        </section>
      </ChakraProvider>
    </Fragment>
  )
}


export default React.memo(Home)
