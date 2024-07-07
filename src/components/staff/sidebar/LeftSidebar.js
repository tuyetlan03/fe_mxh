import { Link } from 'react-router-dom'

//import từ bên trong src
import './LeftSidebar.css'

function LeftSideBar({ categories, setIdeas, copiedIdeas, setIsFilterCategory, events, setIsFilterEvent }) {
    const filterByCategory = (id) => {
        setIsFilterEvent(false)
        setIsFilterCategory(true)
        const filteredIdeas = copiedIdeas.filter((idea) => {
            if (idea.category._id === id) return idea
        }
        )
        setIdeas(filteredIdeas)
    }

    const displayAllIdeas = () => {
        setIsFilterCategory(false)
        setIsFilterEvent(false)
        setIdeas(copiedIdeas)
    }

    const filterByEvent = (year) => {
        setIsFilterCategory(false)
        setIsFilterEvent(true)
        const filteredIdeas = copiedIdeas.filter(idea => {
            if (idea.AcademicYear === year) return idea
        })
        setIdeas(filteredIdeas)
    }

    return (
        <div className={`sidebar `}>
            <ul className="nav">
                <i className='bx bx-menu' id='btn'></i>
                <li>
                    <Link to="/homepage">
                        <i className="fa fa-home" aria-hidden="true"></i>
                        <span className="link_name" onClick={() => displayAllIdeas()}>Home</span>
                    </Link>
                </li>
                <li>
                    <Link to="/profile">
                        <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                        <span className="link_name" onClick={() => displayAllIdeas()}>Profile</span>
                    </Link>
                </li>
                <li>
                    <i className="fa fa-bars" aria-hidden="true"></i>
                    <span className='link_name'>Categories</span>
                    <ul>
                        {
                            categories.map((category, index) => (
                                <li key={index}>
                                    <div className='category' onClick={() => filterByCategory(category._id)}>{category.Title}</div>
                                </li>
                            ))
                        }
                    </ul>
                </li>
                <li>
                    <i className="fa fa-calendar" aria-hidden="true"></i>
                    <span className='link_name'>Event</span>
                    <ul>
                        {
                            events.map((event, index) => (
                                <li key={index}>
                                    <div className='event' onClick={() => filterByEvent(event.Year)}>{event.Year}</div>
                                </li>
                            ))
                        }
                    </ul>
                </li>

            </ul>
        </div>
    )
}

export default LeftSideBar