
import axios from "axios";
import { io } from 'socket.io-client'
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet"
import style from "./HomeQAC.module.css"
import HeaderQAC from "../header/HeaderQAC"
import SidebarQAC from "../sidebar/SidebarQAC"
import { PROFILE_INFORMATION, apiUrl, ACCESS_TOKEN } from "../../../constants/constants"
import { useEffect } from "react";
import { useState } from "react";

const socket = io('https://firstgroup.onrender.com', { transports: ['websocket'] })
function HomeQAC() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN)
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState([])
  const profile_information = JSON.parse(
    localStorage.getItem(PROFILE_INFORMATION)
  )
  const Department = profile_information.Department
  const accountId = profile_information.AccountId
  const [notifications, setNotifications] = useState([])
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/account/listAccount?Department=${Department}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        if (response.data.success) {
          console.log(response.data)
          const afterRemovedUserSelf = response.data.accounts.filter((account) => {
            if (account._id !== accountId) {
              return account
            }
            return account
          })
          setAccounts(afterRemovedUserSelf)
        }
        const notifi = await axios.get(`${apiUrl}/dashboard/notifications?department=${profile_information.Department}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        if (notifi.data.success) {
          setNotifications(notifi.data.ideas)
          console.log(notifi.data)
        }
      } catch (error) {
        console.error(error.response)
        console.error(error.notifi)
        if (error.response.status === 401) {
          navigate('/error')
        }
      }
    })()
    socket.on('notificationdepartment', (notification) => {
      setNotifications(notification)
    })
    return () => {
      socket.off('notificationdepartment')
    }
  }, [setNotifications])
  return (
    <div className={style.qam}>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <label htmlFor="navInput" className={style.overlaySidebar}></label>
      <SidebarQAC />

      <div className={style.qacContainer}>
        <HeaderQAC />

        {/* <body */}
        <div className={style.qacBody}>
          <div className={style.cardBodyContent}>
            <div className={style.bodyBottom}>
              {/* Trái */}
              <div className={style.bottomLeft}>
                <div className={style.card}>
                  <div className={style.titleHeader}>
                    <span className="font-weight-bold"> User account  </span> /
                    {Department}
                  </div>
                  <br></br>
                  <div className={style.cardBody}>
                    <div className={style.tableResponsive}>
                      <table className="table align-items-center">
                        <thead>
                          <tr className={style.header}>
                            <th className={style.rowth}>
                              Name
                            </th>
                            <th className={style.rowth2}>
                              Email
                            </th>
                            <th className={style.rowth}>
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            accounts.map((account, index) => (
                              <tr key={index}>
                                <td>{account.Username}</td>
                                <td>{account.Email[0]}</td>
                                <td>
                                  {
                                    account.Active === true ? <span className={style.statusOnl}>Active</span> : <span className={style.statusOff}>Disabled</span>
                                  }
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* realtime */}
              <div className={style.bottomRight}>
                <div className={style.card}>
                  <div className={style.titleHeader}>
                    <h2 className="font-weight-bold" >Realtime</h2>
                    <p className={style.countContributors}>
                      <i className="fa fa-bell-o" aria-hidden="true"></i>
                      <span className="font-weight-bold ms-1">{notifications.length} </span>
                      information
                    </p>
                  </div>
                  <div className={style.cardBody}>
                    <ul className={style.rtBody}>
                      {
                        notifications.map((notification, index) => {
                          const date = new Date(notification.LastEdition)
                          notification.LastEdition = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
                          return (
                            <li key={index} className={style.inforRt}>
                              <div className={style.imgAcc}>
                                <img src={`${notification.User.avatar}`} alt="avatar"/>
                              </div>
                              <div className={style.timeandname}>
                                <span className="font-weight-bold">{notification.User.name}</span>{" "}
                                created an idea
                                <div className={style.hoursRt}>{notification.LastEdition}</div>
                              </div>
                            </li>
                          )
                        })
                      }
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default HomeQAC