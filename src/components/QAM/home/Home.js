import React, { useState, useEffect } from "react"
import { Helmet } from "react-helmet"
import { io } from 'socket.io-client'
import { useNavigate } from "react-router-dom";
import style from "./Home.module.css"
import HeaderQA from "../header/HeaderQA"
import SidebarQA from "../sidebar/SidebarQA"
import LineChart from "../chart/LineChart"
import BarChart from "../chart/BarChart"
import PieChart from "../chart/PieChart"
import BarChart2 from "../chart/BarChart2"
import axios from "axios"
import { apiUrl, ACCESS_TOKEN } from "../../../constants/constants"

const socket = io('https://firstgroup.onrender.com', { transports: ['websocket'] })
function Home() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN)
  const navigate = useNavigate()
  const [ratingContributorsPostedIdeasEachDepartment, setRatingContributorsPostedIdeasEachDepartment] = useState([])
  const [ratingIdeaEachDepartment, setRatingIdeaEachDepartment] = useState([])
  const [notifications, setNotifications] = useState([])
  const [contributors_in_categories, setContributors_in_categories] = useState([])
  const [statisticData, setStatisticData] = useState({})
  const [chartData, setChartData] = useState({})
  useEffect(() => {
    (async () => {
      try {
        const dashboardResponse = await axios.get(`${apiUrl}/dashboard/chars`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        if (dashboardResponse.data.success) {
          console.log(dashboardResponse.data)
          setChartData(dashboardResponse.data)
          setRatingContributorsPostedIdeasEachDepartment(dashboardResponse.data.ratingAllUserPostIdeaEachDepartment)
          setRatingIdeaEachDepartment(dashboardResponse.data.ratingIdeaEachDepartment)
        }
      } catch (error) {
        console.error(error)
        if (error.response.status === 401) navigate('/error')
      }
      try {
        const chartResponse = await axios.get(`${apiUrl}/dashboard/statistic`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        if (chartResponse.data.success) {
          console.log(chartResponse.data)
          setStatisticData(chartResponse.data)
        }
      } catch (error) {
        console.error(error.chartResponse.data)
        if (error.response.status === 401) navigate('/error')
      }
      try {
        const contributorsResponse = await axios.get(`${apiUrl}/dashboard/contributors`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        if (contributorsResponse.data.success) {
          setContributors_in_categories(contributorsResponse.data.contributors)
          console.log(contributorsResponse.data)
        }
      } catch (error) {
        console.error(error.contributorsResponse.data)
        if (error.response.status === 401) navigate('/error')
      }
      try {
        const notifi = await axios.get(`${apiUrl}/dashboard/notifications`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        if (notifi.data.success) {
          setNotifications(notifi.data.ideas)
          console.log(notifi.data)
        }
      } catch (error) {
        console.error(error.notifi.data)
        if (error.response.status === 401) navigate('/error')
      }
    })()
    socket.on('notification', (notifications) => {
      setNotifications(notifications)
    })
    return () => {
      socket.off('notification')
    }
  }, [setNotifications])

  return (
    <div className={style.qam}>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <SidebarQA />
      <div className={style.dashboardContainer}>
        <HeaderQA />
        <div className={style.boxContent}>
          <div className={style.box}>
            <div className={style.cartBox}>
              <div className={style.headerBox}>
                <div className={style.smallBox}>
                  <img src="https://cdn-icons-png.flaticon.com/512/9244/9244455.png"></img>
                </div>
                <div className={style.textBox}>
                  <p> Total Idea</p>
                  <h4>{statisticData.totalIdea}</h4>
                </div>
              </div>
              <hr className={style.lineBox}></hr>
              <div className={style.footerBox}>
                <p>
                  <span>Total ideas last month: &nbsp; <b>{statisticData.countIdeasLastMonth}</b></span>
                </p>
              </div>
            </div>
          </div>

          <div className={style.box}>
            <div className={style.cartBox}>
              <div className={style.headerBox}>
                <div className={style.smallBox2}>
                  <img src="https://cdn-icons-png.flaticon.com/128/1078/1078276.png"></img>
                </div>
                <div className={style.textBox}>
                  <p> Total View</p>
                  <h4>{statisticData.totalView}</h4>
                </div>
              </div>
              <hr className={style.lineBox}></hr>
              <div className={style.footerBox}>
                <p>
                  <span>Total views of the system: &nbsp; <b>{statisticData.totalView}</b></span>
                </p>
              </div>
            </div>
          </div>

          <div className={style.box}>
            <div className={style.cartBox}>
              <div className={style.headerBox}>
                <div className={style.smallBox3}>
                  <img src="https://cdn-icons-png.flaticon.com/128/1533/1533913.png"></img>
                </div>
                <div className={style.textBox}>
                  <p> Total Like</p>
                  <h4>{statisticData.totalLike}</h4>
                </div>
              </div>
              <hr className={style.lineBox}></hr>
              <div className={style.footerBox}>
                <p>
                  <span>Total likes of the system: &nbsp; <b>{statisticData.totalLike}</b></span>
                </p>
              </div>
            </div>
          </div>

          <div className={style.box}>
            <div className={style.cartBox}>
              <div className={style.headerBox}>
                <div className={style.smallBox4}>
                  <img src="https://cdn-icons-png.flaticon.com/128/4315/4315531.png"></img>
                </div>
                <div className={style.textBox}>
                  <p> Category</p>
                  {
                    statisticData.max && (
                      <h4>{statisticData.max[0]}</h4>
                    )
                  }
                </div>
              </div>
              <hr className={style.lineBox}></hr>
              <div className={style.footerBox}>
                {
                  statisticData.max && (
                    <p>
                      <span >Category's views: &nbsp; <b>{statisticData.max[1]}</b>&nbsp;views</span>
                    </p>
                  )
                }

              </div>
            </div>
          </div>
        </div>


        {/* dasgboard  */}
        <div className={style.dashboard}>
          <div className={style.dashboardBox}>
            <div className={style.cardDashboard}>
              <div className={style.cardHeaderDb}>
                <div className={style.headerBD}>
                  <div className={style.chart}>
                    <BarChart data={chartData.totalIdeaEachMonth} />
                  </div>
                </div>
              </div>
              <div className={style.cardBodyDb}>
                <h6> Bar chart shows total ideas generated by month</h6>
              </div>
            </div>
          </div>
          <div className={style.dashboardBox}>
            <div className={style.cardDashboard}>
              <div className={style.cardHeaderDb}>
                <div className={style.headerBD}>
                  <div className={style.chart}>
                    <LineChart emotionsData={chartData.totalStateEachMonth} commentsData={chartData.totalCommentEachMonth} />
                  </div>
                </div>
              </div>
              <div className={style.cardBodyDb}>
                <h6>Line chart shows total likes, dislikes and comments by month</h6>
              </div>
            </div>
          </div>
          <div className={style.dashboardBox}>
            <div className={style.cardDashboard}>
              <div className={style.cardHeaderDb}>
                <div className={style.headerBD}>
                  <div className={style.chart}>
                    <PieChart ratingIdeaEachDepartment={ratingIdeaEachDepartment} />
                  </div>
                </div>
              </div>
              <div className={style.cardBodyDb}>
                <h6>Pie chart shows total interactions by department</h6>
              </div>
            </div>
          </div>
          <div className={style.dashboardBox}>
            <div className={style.cardDashboard}>
              <div className={style.cardHeaderDb}>
                <div className={style.headerBD}>
                  <div className={style.chart}>
                    <BarChart2 ratingContributorsPostedIdeasEachDepartment={ratingContributorsPostedIdeasEachDepartment} />
                  </div>
                </div>
              </div>
              <div className={style.cardBodyDb}>
                <h6>Bar chart shows the ratio of the number of people closed to the total number of people of</h6>
              </div>
            </div>
          </div>
        </div>


        {/* Contributor and Realtime */}
        <div className={style.items}>
          <div className={style.contributors}>
            <div className={style.card}>
              <div className={style.titleHeader}>
                <h2>Contributors</h2>
                {/* <p className={style.countContributors}>
                  <i className="fa fa-check" aria-hidden="true"></i>
                  <span className="font-weight-bold ms-1">
                    30 contributors
                  </span>{" "}
                  this month
                </p> */}
              </div>
              <div className={style.cardBody}>
                <div className="table-responsive">
                  <table className="table align-items-center">
                    <thead>
                      <tr className={style.header}>
                        <th className="text-uppercase text-secondary font-weight-bolder opacity-7">
                          Category
                        </th>
                        <th className="text-uppercase text-secondary font-weight-bolder opacity-7 ps-2">
                          Account
                        </th>
                        <th className="text-center text-uppercase text-secondary font-weight-bolder opacity-7">
                          Idea
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        contributors_in_categories.map((contributors_in_category, index) => (
                          <tr key={index}>
                            <td>{contributors_in_category.Title}</td>
                            <td>
                              <div className={style.countAvt}>
                                {contributors_in_category.contributor && Array.isArray(contributors_in_category.contributor) && contributors_in_category.contributor.length > 0 &&
                                  contributors_in_category.contributor.map((contributor, index) => {
                                    if (index < 5) {
                                      return (
                                        <a key={index}>
                                          <img src={contributor.avatar} alt="avatar" />
                                        </a>
                                      )
                                    }
                                  })
                                }
                              </div>
                            </td>
                            <td className="align-middle text-center text-sm">
                              <span className="text-xs ">{contributors_in_category.IdeaCount}</span>
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

          <div className={style.realtime}>
            <div className={style.card}>
              <div className={style.titleHeader}>
                <h2>Notification</h2>
                <p className={style.countContributors}>
                  <i className="fa fa-bell-o" aria-hidden="true"></i>
                  <span className="font-weight-bold ms-1">{notifications.length} </span>notifications
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
                            <img src={`${notification.User.avatar}`} />
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
  )
}

export default Home