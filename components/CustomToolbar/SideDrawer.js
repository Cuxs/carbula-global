import React from "react";
import Link from 'next/link'
import styles from './toolbar.module.scss'
import classNames from 'classnames/bind';
import { getCatalogoURL, getCountryCode, getWhatsappNumber } from "../../utils/helpers";
import {useRouter} from 'next/router';


const SideDrawer = ({ show, click, }) => {
  const classNameContext = classNames.bind(styles)
  const router = useRouter()
  const COUNTRY_CODE= getCountryCode(router.locale)

  const sideDrawerClassname = classNameContext({
    'side-drawer': true,
    open: show
  })
  return (
    <nav className={sideDrawerClassname}>
      <img className={styles['side-drawer__logo']} src="/icons/carbula.svg" alt="Cárbula Autos"/>
      <div style={{ textAlign: 'center' }}>
        <ul>
          <li>
            <a href={getCatalogoURL(COUNTRY_CODE)} target="__blank">Catálogo</a>
          </li>
          {/*<li><a href="/">Vender</a></li>*/}
          <li><a href={`http://api.whatsapp.com/send?phone=${getWhatsappNumber(COUNTRY_CODE)}&text=Hola,%20tengo%20una%20consulta`} target="__blank">Financiamiento</a></li>
          <li>
            <a href={`http://api.whatsapp.com/send?phone=${getWhatsappNumber(COUNTRY_CODE)}&text=Hola,%20tengo%20una%20consulta`} target="__blank">Contacto</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SideDrawer