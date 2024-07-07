import React, { useState, useEffect } from "react"
import { format } from 'date-fns'
import axios from "axios"
import Modal from "react-modal"
// import style from "./Event.module.css"
import style from "../home/HomeAd.module.css"
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet"

import { apiUrl, ACCESS_TOKEN } from "../../../constants/constants"
import HeaderAd from "../header/HeaderAd"
import SidebarAd from "../sidebar/SidebarAd"

function Event() {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const navigate = useNavigate()
    const [events, setEvents] = useState([])

    const [showAddEventModal, setShowAddEventModal] = useState(false)
    const [showEditEventModal, setShowEditEventModal] = useState(false)

    const [createEventForm, setCreateEventForm] = useState({
        Year: 0,
        FirstClosureDate: new Date(),
        LastClosureDate: new Date()
    })
    const [editEventForm, setEditEventForm] = useState({
        Editing_Id: '',
        Editing_Year: 0,
        Editing_FirstClosureDate: new Date(),
        Editing_LastClosureDate: new Date()
    })

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`${apiUrl}/event/allEvent`, { headers: { Authorization: `Bearer ${accessToken}` } })
                if (response.data.success === true) {
                    console.log(response.data)
                    response.data.events.forEach(event => {
                        const convertFirstClosureDate = new Date(event.FirstClosureDate)
                        event.FirstClosureDate = convertFirstClosureDate.toISOString().substr(0, 10)
                        const convertLastClosureDate = new Date(event.LastClosureDate)
                        event.LastClosureDate = convertLastClosureDate.toISOString().substr(0, 10)
                    })
                    setEvents(response.data.events)
                }
            } catch (error) {
                console.error(error.response.data)
                if (error.response.status === 401) navigate('/error')
            }
        })()
    }, [])

    const { Year, FirstClosureDate, LastClosureDate } = createEventForm
    const { Editing_Id, Editing_Year, Editing_FirstClosureDate, Editing_LastClosureDate } = editEventForm
    const onChangeCreateEventForm = event => setCreateEventForm({ ...createEventForm, [event.target.name]: event.target.value })
    const onChangeEditEventForm = event => setEditEventForm({ ...editEventForm, [event.target.name]: event.target.value })
    const createEvent = (event) => {
        event.preventDefault()
        setShowAddEventModal(false);
        (async () => {
            try {
                const response = await axios.post(`${apiUrl}/event/createAcademicYear`, createEventForm, { headers: { Authorization: `Bearer ${accessToken}` } })
                if (response.data.success === true) {
                    console.log(response.data)
                    setEvents([response.data.newAcademic, ...events])
                }
            } catch (error) {
                console.log(error.response.data)
                if (error.response.status === 401) {
                    navigate('/error')
                }
            }
        })()
    }

    const showEditEventModalAndGetEventInformation = Event => {
        setEditEventForm({
            Editing_Id: Event._id,
            Editing_Year: Event.Year,
            Editing_FirstClosureDate: format(new Date(Event.FirstClosureDate), 'yyyy-MM-dd'),
            Editing_LastClosureDate: format(new Date(Event.LastClosureDate), 'yyyy-MM-dd')
        })
        setShowEditEventModal(true)
    }
    const editEvent = () => {
        setShowEditEventModal(false);
        (async () => {
            try {
                const response = await axios.put(`${apiUrl}/event/updateAcademic/${Editing_Id}`, { Year: Editing_Year, FirstClosureDate: Editing_FirstClosureDate, LastClosureDate: Editing_LastClosureDate }, { headers: { Authorization: `Bearer ${accessToken}` } })
                if (response.data.success === true) {
                    console.log(response.data)
                    const convertFirstClosureDate = new Date(response.data.update.FirstClosureDate)
                    response.data.update.FirstClosureDate = convertFirstClosureDate.toISOString().substr(0, 10)
                    const convertLastClosureDate = new Date(response.data.update.LastClosureDate)
                    response.data.update.LastClosureDate = convertLastClosureDate.toISOString().substr(0, 10)
                    const editedEvents = events.filter(event => {
                        if (event._id === response.data.update._id) {
                            event.Year = response.data.update.Year
                            event.FirstClosureDate = response.data.update.FirstClosureDate
                            event.LastClosureDate = response.data.update.LastClosureDate
                            return event
                        } else {
                            return event
                        }
                    })
                    setEvents(editedEvents)
                    setEditEventForm({
                        Editing_Id: '',
                        Editing_Year: 0,
                        Editing_FirstClosureDate: new Date(),
                        Editing_LastClosureDate: new Date()
                    })
                }
            } catch (error) {
                console.error(error.response.data)
                if (error.response.status === 401) {
                    navigate('/error')
                }
            }
        })()
    }
    console.log(events)
    return (
        <>
            <div className={style.accountManage}>
                <Helmet>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Helmet>
                <label htmlFor="navInput" className={style.overlaySidebar}></label>
                <SidebarAd />

                <div className={style.adContainer}>
                    <HeaderAd />
                    <div className={style.containerBody}>
                        {/* modal add event  */}
                        <div className={style.rowAdEvent}>
                            <div className={style.cardAd}>
                                <div className={style.cardTb}>
                                    <div className={style.cardHeader}>
                                        <div className={style.cardSmall}>
                                            <h6 className={style.accountTableTilte}>Event Management</h6>
                                            <p className={style.addUser}>
                                                <i className="fa fa-calendar" aria-hidden="true" onClick={() => setShowAddEventModal(true)}> Add </i>
                                            </p>
                                        </div>
                                    </div>


                                    <div className={style.cardBodyAd}>
                                        <div className={style.tableResponsive}>
                                            <table className="table align-items-center">
                                                <thead>
                                                    <tr>
                                                        <th className={style.thAccount}></th>
                                                        <th className={style.thAccount}></th>
                                                        <th className={style.thAccount}>No.</th>
                                                        <th className={style.thAccount}>Year</th>
                                                        <th className={style.thAccount}>First Closure Date</th>
                                                        <th className={style.thAccount}>Final Closure Date</th>
                                                        <th className={style.thAccount}></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        events.map((Event, index) => (
                                                            <tr key={index}>
                                                                <td className={style.row}>   </td>
                                                                <td className={style.row}>   </td>
                                                                <td className={style.row}>{index + 1}</td>
                                                                <td className={style.row}>{Event.Year}</td>
                                                                <td className={style.row}>{Event.FirstClosureDate}</td>
                                                                <td className={style.row}>{Event.LastClosureDate}</td>
                                                                <td className={style.row}>
                                                                    <div className={style.addModal}>
                                                                        <i className="fa fa-wrench" aria-hidden="true" onClick={() => showEditEventModalAndGetEventInformation(Event)}> Edit Event</i>
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

                        <Modal className={style.addModal} isOpen={showAddEventModal} onRequestClose={() => setShowAddEventModal(false)}>
                            <div className={style.modalAddEvent}>
                                <form className={style.modalBodyAddEvent} onSubmit={createEvent}>
                                    <div className={style.modalBodyAddEvent}>
                                        <div>
                                            <div className={style.createAddEventHeader}>
                                                <i className="fa fa-reply" onClick={() => setShowAddEventModal(false)}></i>
                                                <h1 className={style.createAddEvent}>Add Event</h1>
                                            </div>
                                            <div className={style.createAddEventContent}>
                                                <div className={style.setDate}>
                                                    <h1>.</h1>
                                                    <label className={style.labelAddEvent} htmlFor="year">Year:</label>
                                                    <input type="number" id="year" name="Year" value={Year} min={new Date().getFullYear()} max={new Date().getFullYear() + 3} onChange={onChangeCreateEventForm} required={true} />
                                                    <br />
                                                    <label className={style.labelAddEvent} htmlFor="first-closure-date"> First Closure Date: &nbsp;</label>
                                                    <input
                                                        id="first-closure-date"
                                                        type="date"
                                                        name="FirstClosureDate"
                                                        value={FirstClosureDate}
                                                        onChange={onChangeCreateEventForm}
                                                        required={true}
                                                    />
                                                    <br />
                                                    <label className={style.labelAddEvent} htmlFor="final-closure-date"> Final Closure Date:&nbsp; </label>
                                                    <input
                                                        id="final-closure-date"
                                                        type="date"
                                                        name="LastClosureDate"
                                                        value={LastClosureDate}
                                                        onChange={onChangeCreateEventForm}
                                                        required={true}
                                                    />
                                                    <div className={style.createEventButtonWrapper}><button type="submit" className={style.createEventButton}>Create</button></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </Modal>

                        <Modal className={style.addModal} isOpen={showEditEventModal} onRequestClose={() => setShowEditEventModal(false)}>
                            <div className={style.modalAddEvent}>
                                <form className={style.modalBodyAddEvent} onSubmit={editEvent}>
                                    <div className={style.modalBodyAddEvent}>
                                        <div>
                                            <div className={style.createAddEventHeader}>
                                                <i className="fa fa-reply" aria-hidden="true" onClick={() => setShowEditEventModal(false)}></i>
                                                <h1 className={style.createAddEvent}>Edit </h1>
                                            </div>
                                            <div className={style.createAddEventContent}>
                                                <div className={style.setDate}>
                                                    <h1>.</h1>
                                                    <label className={style.labelAddEvent} htmlFor="year">Year:</label>
                                                    <input type="number" id="year" name="Editing_Year" value={Editing_Year} min={new Date().getFullYear()} max={new Date().getFullYear() + 3} onChange={onChangeEditEventForm} required={true} />
                                                    <br />
                                                    <label className={style.labelAddEvent} htmlFor="first-closure-date"> First Closure Date: &nbsp;</label>
                                                    <input
                                                        id="first-closure-date"
                                                        type="date"
                                                        name="Editing_FirstClosureDate"
                                                        value={Editing_FirstClosureDate}
                                                        onChange={onChangeEditEventForm}
                                                        required={true}
                                                    />
                                                    <br />
                                                    <label className={style.labelAddEvent} htmlFor="final-closure-date"> Final Closure Date:&nbsp; </label>
                                                    <input
                                                        id="final-closure-date"
                                                        type="date"
                                                        name="Editing_LastClosureDate"
                                                        value={Editing_LastClosureDate}
                                                        onChange={onChangeEditEventForm}
                                                        required={true}
                                                    />
                                                    <div className={style.createEventButtonWrapper}><button type="submit" className={style.createEventButton}>Update</button></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Event