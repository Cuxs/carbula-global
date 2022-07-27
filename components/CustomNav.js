import React, { useState } from 'react'
import Toolbar from './CustomToolbar';
import SideDrawer from './CustomToolbar/SideDrawer';
import Backdrop from './CustomToolbar/Backdrop';

const Nav = () => {
  const [sideMenu, setSideMenu] = useState(false)

  const toggleMenu = () => setSideMenu(!sideMenu)
  let backdrop;

  if (sideMenu) {
    backdrop = <Backdrop click={toggleMenu} />
  }
  return (
    <nav>
      <Toolbar drawerClickHandler={toggleMenu} />
      <SideDrawer show={sideMenu} click={toggleMenu} />
      {backdrop}
    </nav>
  )
}

export default Nav
