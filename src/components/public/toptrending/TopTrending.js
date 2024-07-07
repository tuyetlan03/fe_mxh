import style from "./TopTrending.module.css"
import HeaderQA from "../../QAM/header/HeaderQA"
import SidebarQA from "../../QAM/sidebar/SidebarQA"
import HeaderAd from "../../admin/header/HeaderAd"
import SidebarAd from "../../admin/sidebar/SidebarAd"
import HeaderQAC from '../../QAC/header/HeaderQAC'
import SidebarQAC from '../../QAC/sidebar/SidebarQAC'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { apiUrl, ROLE, ACCESS_TOKEN } from "../../../constants/constants"
import SpecificIdeaModal from "../modals/SpecificIdeaModal"
import formatTime from "../../../utilities/formatTime"

function TopTrending() {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const role = localStorage.getItem(ROLE)
    const navigate = useNavigate()
    const [showSpecificModal, setShowSpecificModal] = useState(false)
    const [specificIdea, setSpecificIdea] = useState(null)
    let HeaderCoponent = <div></div>
    let SidebarConponent = <div></div>
    if (role === 'Administrator') {
        HeaderCoponent = <HeaderAd />
        SidebarConponent = <SidebarAd />
    } else if (role === 'QAM') {
        HeaderCoponent = <HeaderQA />
        SidebarConponent = <SidebarQA />
    } else if (role === 'QAC') {
        HeaderCoponent = <HeaderQAC />
        SidebarConponent = <SidebarQAC />
    }
    const [topTrendings, setToptrendings] = useState([])
    const [topLikes, setTopLikes] = useState([])
    const [topDislikes, setTopDisLikes] = useState([])
    const getSpecificIdeaAndShowModal = (idea) => {
        setSpecificIdea(idea)
        setShowSpecificModal(true)
    }
    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`${apiUrl}/idea/home`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                if (response.data.success === true) {
                    console.log(response.data)
                    setToptrendings(response.data.trending)
                    setTopLikes(response.data.toplike)
                    setTopDisLikes(response.data.topdislike)
                }
            } catch (error) {
                console.error(error.response.data)
                if (error.response.status === 401) {
                    navigate('/error')
                }
            }
        })()
    }, [])
    return (
        <>
            <div className={style.topTrending}>
                {HeaderCoponent}
                <div className={style.cardTopTrending}>
                    <div className={style.sidebarCoponent}>{SidebarConponent}</div>
                    <div className={style.containTopTrending}>
                        <div className={style.trending}>
                            <div className={style.trendingTop}>
                                <h2>Trending Ideas</h2>
                                <p className={style.countTrending}>
                                    <i className="fa fa-bell-o" aria-hidden="true"></i>
                                    <span className="font-weight-bold ms-1">{topTrendings.length}</span> Ideas
                                </p>
                            </div>
                            <div className={style.cardBody}>
                                <div className="table-responsive">
                                    <table className="table align-items-center">
                                        <tbody>
                                            {
                                                topTrendings.map((topTrending, index) => (
                                                    <tr key={index} className={style.specificIdea} onClick={() => getSpecificIdeaAndShowModal(topTrending)}>
                                                        <td>
                                                            <div className={style.topAccount}>
                                                                <div>
                                                                    <img src={topTrending.userPost.Avatar} alt="avatar" />
                                                                </div>
                                                                <div className={style.title}>
                                                                    <h6 className={style.name}>{topTrending.Title}</h6>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className={style.trending}>
                            <div className={style.trendingTop}>
                                <h2>Top Like Ideas</h2>
                                <p className={style.countTrending}>
                                    <i className="fa fa-bell-o" aria-hidden="true"></i>
                                    <span className="font-weight-bold ms-1">{topLikes.length}</span> Ideas
                                </p>
                            </div>
                            <div className={style.cardBody}>
                                <div className="table-responsive">
                                    <table className="table align-items-center">
                                        <tbody>
                                            {
                                                topLikes.map((topLike, index) => (
                                                    <tr key={index} className={style.specificIdea} onClick={() => getSpecificIdeaAndShowModal(topLike)}>
                                                        <td>
                                                            <div className={style.topAccount}>
                                                                <div>
                                                                    <img src={topLike.userPost.Avatar} alt="avatar" />
                                                                </div>
                                                                <div className={style.title}>
                                                                    <h6 className={style.name}><b>{topLike.Title}</b>   {topLike.totallike}<i className="fa fa-thumbs-up" aria-hidden="true"></i></h6>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className={style.trending}>
                            <div className={style.trendingTop}>
                                <h2>Top Dislike Ideas</h2>
                                <p className={style.countTrending}>
                                    <i className="fa fa-bell-o" aria-hidden="true"></i>
                                    <span className="font-weight-bold ms-1">{topDislikes.length}</span> Ideas
                                </p>
                            </div>
                            <div className={style.cardBody}>
                                <div className="table-responsive">
                                    <table className="table align-items-center">
                                        <tbody>
                                            {
                                                topDislikes.map((topDislike, index) => (
                                                    <tr key={index} className={style.specificIdea} onClick={() => getSpecificIdeaAndShowModal(topDislike)}>
                                                        <td>
                                                            <div className={style.topAccount}>
                                                                <div>
                                                                    <img src={topDislike.userPost.Avatar} alt="avatar" />
                                                                </div>
                                                                <div className={style.title}>
                                                                    <h6 className={style.name}><b>{topDislike.Title}</b>   {topDislike.totaldislike} <i className="fa fa-thumbs-o-down" aria-hidden="true"></i> </h6>
                                                                </div>
                                                            </div>
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
                </div>
            </div>

            {showSpecificModal && <SpecificIdeaModal specificIdea={specificIdea} setShowSpecificModal={setShowSpecificModal} formatTime={formatTime} />}
        </>
    )
}

export default TopTrending