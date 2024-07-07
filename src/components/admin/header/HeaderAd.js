// import  style from "./HeaderQAC.module.css"
import style from "../../QAM/header/HeaderQA.module.css";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import {
  ACCESS_TOKEN,
  ACCOUNT_ID,
  ROLE,
  PROFILE_INFORMATION,
  apiUrl,
} from "../../../constants/constants";
import { useNavigate } from "react-router-dom";

function HeaderAd() {
  const profile_information = JSON.parse(localStorage.getItem(PROFILE_INFORMATION))
  const navigate = useNavigate();
  const logout = (event) => {
    event.preventDefault();
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(ACCOUNT_ID);
    localStorage.removeItem(ROLE);
    localStorage.removeItem(PROFILE_INFORMATION);
    navigate("/");
  };
  return (
    <header className={style.qacHeader}>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <div className={style.grid}>
        {/* ForPC */}
        <nav className={style.headerNavbar}>
          <div className={style.headerNavbarLeft}>
            <label className={style.headerNavbarPages}>Pages</label>
          </div>
          <div className={style.headerNavbarRight}>
            <div className={style.headerNavbarItem}>
              <label className={style.accountQac}>
              <i className="fa fa-user" aria-hidden="true"></i> 
                {profile_information.Name}
              </label>
            </div>
          </div>
          {/* for Ipad */}
          <ul className={style.headerNavbarList}>
            <li className={style.headerNavItem}>
              <label htmlFor="navInput">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  fill="currentColor"
                  className="bi bi-list"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                  />
                </svg>
              </label>
            </li>
          </ul>
        </nav>

        {/* sidebar */}
        <input
          hidden
          className={style.navbarInput}
          type="checkbox"
          name=""
          id="navInput"
        />

        <label htmlFor="navInput" className={style.overlaySidebar}></label>
       
        <div className={style.sidebar}>
        <div className={style.sidebarListAvt}>
              <img
                src={profile_information.Avatar}
                className={style.sidebarAvt}
              />
              <label>{profile_information.Name}</label>
            </div>
          <hr className={style.line}></hr>

          <div className={style.sidebarList}>
            <li>
              <i className="fa fa-tachometer" aria-hidden="true"></i>
              <label className={style.sidebarItem}>
                <Link to ="/admin">
                  <span className={style.sidebarLink}>Account Management</span>
                </Link>
              </label>
            </li>
          </div>
          <div className={style.sidebarList}>
            <li>
            <i className="fa fa-fire" aria-hidden="true"></i>
              <label className={style.sidebarItem}>
                <Link to ="/topTrending">
                  <span className={style.sidebarLink}>Top Trending</span>
                </Link>
              </label>
            </li>
          </div>
          <div className={style.sidebarList}>
            <li>
            <i className="fa fa-calendar" aria-hidden="true"></i>
              <label className={style.sidebarItem}>
                <Link to ="/setEvent">
                  <span className={style.sidebarLink}>Event</span>
                </Link>
              </label>
            </li>
          </div>
          <div className={style.sidebarList}>
            <i className="fa fa-sign-out" aria-hidden="true"></i>
            <label className={style.sidebarItem}>
              <a onClick={logout}>
                <span className={style.sidebarLink}>Logout</span>
              </a>
            </label>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderAd;
