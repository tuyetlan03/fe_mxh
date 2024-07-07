import React, { useState, useEffect } from "react";
import filesaver from 'file-saver'
import style from "./HeaderQA.module.css";
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import { io } from "socket.io-client";
import { Helmet } from "react-helmet";
import {
  ACCESS_TOKEN,
  ACCOUNT_ID,
  ROLE,
  PROFILE_INFORMATION,
  apiUrl,
} from "../../../constants/constants";

Modal.setAppElement("#root")
const socket = io("https://firstgroup.onrender.com", {
  transports: ["websocket"],
})

function HeaderQA() {
  const profile_information = JSON.parse(localStorage.getItem(PROFILE_INFORMATION))
  const accessToken = localStorage.getItem(ACCESS_TOKEN)
  const role = localStorage.getItem(ROLE)
  const [isDownloadFailed, setIsDownloadFailed] = useState(false)
  const navigate = useNavigate()
  const logout = (event) => {
    event.preventDefault()
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(ACCOUNT_ID)
    localStorage.removeItem(ROLE)
    localStorage.removeItem(PROFILE_INFORMATION)
    navigate("/")
  }

  const downloadZip = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.get(`${apiUrl}/file/downloadzip?accessToken=${accessToken}`, { responseType: 'blob' }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      console.log(response)
      filesaver.saveAs(response.data)
    } catch (error) {
      console.error(error.response.data)
      if (error.response.status === 401) {
        navigate('/error')
      }
    }
  }

  const downloadCSV = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.get(`${apiUrl}/file/download?accessToken=${accessToken}`, { responseType: 'blob' }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      console.log(response)
      filesaver.saveAs(response.data)
    }
    catch (error) {
      console.error(error.response.data)
      setIsDownloadFailed(true)
      if (error.response.status === 401) {
        navigate('/error')
      }
    }
  }

  return (
    <>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      <header className={style.qacHeader}>
        <div className={style.grid}>
          {/* ForPC */}
          <nav className={style.headerNavbar}>
            <div className={style.headerNavbarLeft}>
              <label className={style.headerNavbarPages}>Pages</label>
            </div>
            <div className={style.headerNavbarRight}>
              <div className={style.headerNavbarItem}>
                <button className={style.btnDownload} onClick={downloadZip}>Download Zip</button>
                <button className={style.btnDownload} onClick={downloadCSV}>Download CSV</button>
              </div>
            </div>
            {/* forIpad */}
            <div className={style.headerSide}>
              <div className={style.headerNavItem}>
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
              </div>
            </div>
          </nav>

          <input
            hidden
            className={style.navbarInput}
            type="checkbox"
            name=""
            id="navInput"
          />

          {/* SideBar */}
          <label htmlFor="navInput" className={style.overlaySidebar}></label>
          <div className={style.sidebar}>
            <label htmlFor="navInput" className={style.sidebarClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-x"
                viewBox="0 0 16 16"
              >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </label>
            <div className={style.sidebarListAvt}>
              <img
                src={profile_information.Avatar}
                width="50"
                height="50"
                className={style.sidebarAvt}
              />
              <label>{profile_information.Name}</label>
            </div>
            <hr className={style.line}></hr>

            <div className={style.sidebarList}>
              <li>
                <i className="fa fa-tachometer" aria-hidden="true"></i>
                <label className={style.sidebarItem}>
                  <Link to="/qualityAssuranceManager">
                    <span className={style.sidebarLink}>Dashboard</span>
                  </Link>
                </label>
              </li>
            </div>
            <div className={style.sidebarList}>
              <i className="fa fa-table" aria-hidden="true"></i>
              <label className={style.sidebarItem}>
                <Link to="/category">
                  <span className={style.sidebarLink}>Category</span>
                </Link>
              </label>
            </div>
            <div className={style.sidebarList}>
              <i class="fa fa-fire" aria-hidden="true"></i>
              <label className={style.sidebarItem}>
                <Link to="/topTrending">
                  <span className={style.sidebarLink}>Trending</span>
                </Link>
              </label>
            </div>

            <div className={style.sidebarList}>
              <i className="fa fa-download" aria-hidden="true"></i>
              <label className={style.sidebarItem}>
                <button className={style.sidebarLink} onClick={downloadZip}>Download Zip</button>
              </label>
            </div>
            <div className={style.sidebarList}>
              <i className="fa fa-download" aria-hidden="true"></i>
              <label className={style.sidebarItem}>
                <button className={style.sidebarLink} onClick={downloadCSV}>Download CSV</button>
              </label>
            </div>


            <h1 className={style.accountPages}>ACCOUNT PAGES</h1>
            <div className={style.sidebarList}>
              <i className="fa fa-user" aria-hidden="true"></i>
              <label className={style.sidebarItem}>
                <Link to="/profileQAM" className={style.sidebarLink}>
                  <span className={style.sidebarLink}>Profile</span>
                </Link>
              </label>
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
      {isDownloadFailed && (
        <div className={style.overlayMessageModal}>
          <div className={style.messageModal}>
            <div className={style.message}>Download failed, the closing date hasn't come yet</div>
            <button onClick={() => setIsDownloadFailed(false)}>Confirm</button>
          </div>
        </div>
      )}
    </>
  )
}

export default HeaderQA
