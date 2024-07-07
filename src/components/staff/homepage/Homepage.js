////import từ thư viện bên ngoài
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { io } from 'socket.io-client'

//import từ bên trong src
import style from './Homepage.module.css'
import Header from "../header/Header"
import LeftSideBar from "../sidebar/LeftSidebar"
import RightSidebar from "../sidebar/RightSidebar"
import CreateModal from "../modals/CreateModal"
import UpdateModal from "../modals/UpdateModal"
import DeleteModal from "../modals/DeleteModal"
import CommentModal from "../modals/CommentModal"
import SpecificIdeaModal from "../../public/modals/SpecificIdeaModal"
import { apiUrl, PROFILE_INFORMATION, ACCESS_TOKEN } from '../../../constants/constants'
import formatTime from "../../../utilities/formatTime"

const socket = io('https://firstgroup.onrender.com', { transports: ['websocket'] })

function Homepage() {
    const navigate = useNavigate()
    const profile_information = JSON.parse(localStorage.getItem(PROFILE_INFORMATION)) // chuyển json sang object để lấy thông tin profile người dùng
    const userId = profile_information._id // lấy ra user ID (không phải account ID)
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const IDEAS_PER_PAGE = 5
    const [currentPage, setCurrentPage] = useState(1)
    const [maxPage, setmaxPage] = useState(0)
    const [currentIdeas, setCurrentIdeas] = useState([])
    const [showAddModal, setShowAddModal] = useState(false) // trạng thái của modal hiển thị form add
    const [showUpdateModal, setShowUpdateModal] = useState(false) // trạng thái của modal hiển thị form update
    const [showCommentModal, setShowCommentModal] = useState(false) // trạng thái của modal hiển thị form comment
    const [showDeleteModal, setShowDeleteModal] = useState(false) // trạng thái của modal hiển thị xác nhận xóa
    const [showSpecificModal, setShowSpecificModal] = useState(false) // trạng thái của modal hiển thị idea khi ấn vào sidebar bên phải
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [isFilteringCategory, setIsFilterCategory] = useState(false)
    const [isFilteringEvent, setIsFilterEvent] = useState(false)
    const [ideas, setIdeas] = useState([]) 
    const [copiedIdeas, setCopiedIdeas] = useState([])
    const [copiedIdeasToSearch, setCopiedIdeasToSearch] = useState([])
    global.ide = ideas
    const [categories, setCategories] = useState([]) // trạng thái danh sách các categories
    const [events, setEvents] = useState([])
    const [comments, setComments] = useState([]) // trạng thái danh sách các comment của 1 idea cụ thể
    const [trendings, setTrendings] = useState([])
    const [topLikes, setTopLikes] = useState([])
    const [topDislikes, setTopDisLikes] = useState([])

    const [lastClosureDate, setLastClosureDate] = useState(null)
    const [downloadZipId, setDownloadZipId] = useState('') // trạng thái lưu trữ giá trị id của idea sẽ được tải file ZIP
    const [deleteIdeaId, setDeleteIdeaId] = useState('') // trạng thái lưu trữ giá trị id của idea sẽ bị xóa
    const [specificIdea, setSpecificIdea] = useState('') // trạng thái lưu trữ idea khi ấn vào các bài viết ở sidebar bên phải
    const [files, setFiles] = useState([])
    const [searchKeyWord, setSearchKeyWord] = useState('')
    const [createIdeaForm, setCreateIdeaForm] = useState({ // trạng thái form tạo idea
        Title: '',
        Description: '',
        UserId: userId,
        CategoryId: null,
        AcademicYear: null
    })

    const [updateIdeaForm, setUpdateIdeaForm] = useState({ // trạng thái form cập nhật idea
        updating_id: '',
        updatingTitle: '',
        updatingDescription: '',
    })

    const [likeState, setLikeState] = useState([]) // trạng thái danh sách các 
    const [dislikeState, setDislikeState] = useState([])
    const [viewState, setViewState] = useState([])
    const [thumbsIdeaId, setThumbsIdeaId] = useState(null)
    const [Content, setContent] = useState('')
    const [Anonymous, setAnonymous] = useState(false)
    const [idCmt, setIdCmt] = useState(null)
    const [z, setZ] = useState(null)
    const [isUpdatingComment, setIsUpdatingComment] = useState(false)
    let displayedIdeas = []
    if (isFilteringCategory === true) {
        displayedIdeas = ideas
    }
    else if (isFilteringEvent === true) {
        displayedIdeas = ideas
    }
    else if (isSearching === true) {
        displayedIdeas = ideas
    }
    else {
        displayedIdeas = currentIdeas
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`${apiUrl}/idea/home`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                if (response.data.success) {
                    console.log(response.data)
                    response.data.ideas.map((idea) => {
                        idea.LastEdition = formatTime(new Date(idea.LastEdition))
                        idea.comments.map((comment) => {
                            comment.LastEdition = formatTime(new Date(comment.LastEdition))
                        })
                    })
                    setmaxPage(Math.ceil(response.data.ideas.length / IDEAS_PER_PAGE))
                    setCurrentIdeas(response.data.ideas.slice((currentPage - 1) * IDEAS_PER_PAGE, currentPage * IDEAS_PER_PAGE))

                    setIdeas(response.data.ideas)
                    setCopiedIdeas(response.data.ideas)
                    
                    setCopiedIdeasToSearch(response.data.ideas)
                    if (z > -1 && thumbsIdeaId) {
                        if (idCmt === thumbsIdeaId) {
                            setComments(response.data.ideas[z].comments)
                        }
                    }
                    setZ(-1)
                    setCategories(response.data.categories)
                    setEvents(response.data.events)
                    setTrendings(response.data.trending)
                    setTopLikes(response.data.toplike)
                    setTopDisLikes(response.data.topdislike)
                    setIsAnonymous(false)
                    setCreateIdeaForm({
                        Title: '',
                        Description: '',
                        UserId: userId,
                        CategoryId: response.data.categories[0]._id,
                        AcademicYear: response.data.events[0].Year
                    })
                }
            } catch (error) {
                console.error(error)
                if (error.response.status === 401) {
                    navigate('/error')
                }
            }
        })()
        socket.on('like', (likedata, thumbsIdeaId) => {
            setLikeState(likedata)
            setThumbsIdeaId(thumbsIdeaId)
            setIdeas(global.ide)
        })
        socket.on('dislike', (dislikedata, thumbsIdeaId) => {
            setDislikeState(dislikedata)
            setThumbsIdeaId(thumbsIdeaId)
            setIdeas(global.ide)
        })
        socket.on('view', (viewdata, thumbsIdeaId) => {
            setViewState(viewdata)
            setThumbsIdeaId(thumbsIdeaId)
            setIdeas(global.ide)
        })
        socket.on('addCmt', (thumbsIdeaId, z) => {
            setThumbsIdeaId(thumbsIdeaId)
            setZ(z)
        })
        socket.on('updateComment', (thumbsIdeaId, z) => {
            setThumbsIdeaId(thumbsIdeaId)
            setZ(z)

        })
        socket.on('deleteComment', (thumbsIdeaId, z) => {
            setThumbsIdeaId(thumbsIdeaId)
            setZ(z)

        })
        socket.on('error', (message) => {
            return
        })
        return () => {
            socket.off('like')
            socket.off('dislike')
            socket.off('view')
            socket.off('addCmt')
            socket.off('updateComment')
            socket.off('deleteComment')
            socket.off('error')

        }
    }, [thumbsIdeaId, z, currentPage])

    const onChangeCreateIdeaForm = event => setCreateIdeaForm({ ...createIdeaForm, [event.target.name]: event.target.value })
    const onChangeUpdateIdeaForm = event => setUpdateIdeaForm({ ...updateIdeaForm, [event.target.name]: event.target.value })
    const handleFilesChange = (event) => setFiles([...files, ...event.target.files])
    const handleAnonymousChange = event => setIsAnonymous(event.target.value === 'anonymous')

    const createIdea = () => {
        (async () => {
            try {
                const formData = new FormData()
                for (let i = 0; i < files.length; i++) {
                    formData.append('documents', files[i])
                }
                formData.append('Title', createIdeaForm.Title)
                formData.append('Description', createIdeaForm.Description)
                formData.append('UserId', createIdeaForm.UserId)
                formData.append('CategoryId', createIdeaForm.CategoryId)
                formData.append('Anonymous', isAnonymous)
                formData.append('AcademicYear', createIdeaForm.AcademicYear)
                console.log(createIdeaForm.AcademicYear)
                console.log(formData.getAll('documents'))
                const response = await axios.post(`${apiUrl}/idea/createIdea`, formData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                if (response.data.success) {
                    console.log(response.data.idea)
                    setFiles([])
                    setIsAnonymous(false)
                    setCreateIdeaForm({
                        Title: '',
                        Description: '',
                        UserId: userId,
                        CategoryId: categories[0]._id,
                        AcademicYear: events[0].Year
                    })
                    sendNotification()
                    response.data.idea.LastEdition = formatTime(new Date(response.data.idea.LastEdition))
                    setIdeas([response.data.idea, ...ideas])
                    setCurrentIdeas([response.data.idea, ...currentIdeas])
                }
            } catch (error) {
                console.log(error.response.data)
                if (error.response.status === 401) {
                    navigate('/error')
                }
            }
        }
        )()
    }

    const showActionsWhenHoverAndGetCurrentIdea = idea => {
        console.log(idea)
        setUpdateIdeaForm({
            updating_id: idea._id,
            updatingTitle: idea.Title,
            updatingDescription: idea.Description
        })
        setIsAnonymous(idea.Anonymous)
        setDeleteIdeaId(idea._id)
        setDownloadZipId(idea._id)
    }

    const updateIdea = () => {
        setShowUpdateModal(false);
        (async () => {
            try {
                const response = await axios.put(`${apiUrl}/idea/update/${updateIdeaForm.updating_id}`, { Title: updateIdeaForm.updatingTitle, Description: updateIdeaForm.updatingDescription, Anonymous: isAnonymous }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                if (response.data.success) {
                    console.log(response.data)
                    const newIdeas = ideas.map(idea => {
                        if (idea._id === response.data.idea._id) {
                            idea.Title = response.data.idea.Title
                            idea.Description = response.data.idea.Description
                            idea.Anonymous = response.data.idea.Anonymous
                        }
                        return idea
                    })
                    setIsAnonymous(false)
                    setIdeas(newIdeas)
                }
            } catch (error) {
                console.error(error.response.data)
                if (error.response.status === 401) {
                    navigate('/error')
                }
            }
        })()
    }

    const deleteIdea = () => {
        setShowDeleteModal(false);
        (async () => {
            try {
                const response = await axios.delete(`${apiUrl}/idea/deleteIdea/${deleteIdeaId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                if (response.data.success) {
                    console.log(response.data)
                    const afterDeletedIdeas = ideas.filter(idea => idea._id !== deleteIdeaId)
                    setIdeas(afterDeletedIdeas)
                    const afterDeletedCurrentIdeas = currentIdeas.filter(idea => idea._id !== deleteIdeaId)
                    setCurrentIdeas(afterDeletedCurrentIdeas)
                }
            } catch (error) {
                console.error(error.response.data)
                if (error.response.status === 401) {
                    navigate('/error')
                }
            }
        })()
    }

    const handleLikeClick = async (userId, ideaId) => {
        const data = { userId, ideaId, state: 'like' }
        socket.emit('like', data)
    }

    const handleDisLikeClick = async (userId, ideaId) => {
        const data = { userId, ideaId, state: 'dislike' }
        socket.emit('dislike', data)
    }

    const handleView = async (userId, ideaId) => {
        const data = { userId, ideaId, state: 'view' }
        setIdCmt(ideaId)
        socket.emit('view', data)
    }
    const deleteComment = async (commentId) => {
        const data = { commentId, IdeaId: idCmt }
        socket.emit('deleteComment', data)
    }
    const sendNotification = async () => {
        socket.emit('notification', profile_information.Department)
    }
    const handleKeyDownUpdateComment = (isAnonymous, commentId) => (event) => {
        if (event.keyCode === 13) { // 13 is the Enter key code
            const Content = event.target.value;
            const id = idCmt
            const data = { commentId, Content, isAnonymous, IdeaId: id, }
            socket.emit('updateComment', data)
            setIsUpdatingComment(false) // clear the input field
        }
    }
    const handleKeyDown = (event) => {
        if (event.keyCode === 13) { // 13 is the Enter key code
            const us = userId
            const id = idCmt
            const data = { Content, UserId: us, Anonymous, IdeaId: id }
            socket.emit('addComment', data)
            setContent('') // clear the input field
            setAnonymous(false)
        }
    }

    return (
        <>
            <div>
                <Header searchKeyWord={searchKeyWord} setSearchKeyWord={setSearchKeyWord} ideas={ideas} setIdeas={setIdeas} copiedIdeasToSearch={copiedIdeasToSearch} setIsSearching={setIsSearching} />
                <div className={style.container}>
                    <div className={style.leftSidebar}>
                        <LeftSideBar categories={categories} setIdeas={setIdeas} copiedIdeas={copiedIdeas} setIsFilterCategory={setIsFilterCategory} events={events} setIsFilterEvent={setIsFilterEvent} />
                    </div>
                    <div className={style.middleSection}>
                        <h2 className={style.post}>Posts</h2>
                        <ul className={style.homepageUl}>
                            <li className={style.arialLabel}>
                                <img src={`${profile_information.Avatar}`} alt="avatar" className={style.logoAvatar} />
                                <div className={style.inputContainer}>
                                    <button className={style.inputText} onClick={() => setShowAddModal(true)}>Create Idea</button>
                                    <span className={style.cameraIcon}><i className="fas fa-camera"></i></span>
                                </div>
                            </li>
                            <div className={style.line}></div>
                            {
                                displayedIdeas.map((idea, index) => {
                                    return (
                                        <li className={style.textInput} key={index}>
                                            <div className={style.nameDateDot}>
                                                <div className={style.avatarAndName}>
                                                    {
                                                        idea.Anonymous === false ? (<img src={idea.userPost.Avatar} alt="avatar" className={style.logoAvatar} />) : <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7vojjyljLC2ZHahToRN1w6Ll-1H1CQVrTXg&usqp=CAU' alt="avatar" className={style.logoAvatar} />
                                                    }
                                                    <div className={style.nameAndDate}>
                                                        {
                                                            idea.Anonymous === false ? (<p className={style.name}>{idea.userPost.Name}</p>) : <p className={style.name}>Anonymous</p>
                                                        }
                                                        <div className={style.dateDisplay}>{idea.LastEdition}</div>
                                                    </div>
                                                </div>
                                                {
                                                    idea.userPost._id === userId ? (
                                                        <div className={style.dropdown} key={index}>
                                                            <div className={style.dropdownToggle}>
                                                                <i className="fa fa-ellipsis-h" onClick={() => showActionsWhenHoverAndGetCurrentIdea(idea)}>
                                                                    <div className={style.dropdownMenu}>
                                                                        <a className={style.btnidea} onClick={() => setShowUpdateModal(true)}>Update Idea</a>
                                                                        <a className={style.btnidea} onClick={() => setShowDeleteModal(true)}>Delete</a>
                                                                        <a href={`${apiUrl}/file/idea/downloadzip/${downloadZipId}?accessToken=${accessToken}`} >Download ZIP</a>
                                                                    </div>
                                                                </i>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className={style.dropdown} key={index}>
                                                            <div className={style.dropdownToggle}>
                                                                <i className="fa fa-ellipsis-h" onClick={() => showActionsWhenHoverAndGetCurrentIdea(idea)}>
                                                                    <div className={style.dropdownMenu}>
                                                                        <a href={`${apiUrl}/file/idea/downloadzip/${downloadZipId}?accessToken=${accessToken}`} >Download ZIP</a>
                                                                    </div>
                                                                </i>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <div className={style.content}><b>{idea.Title}</b></div>
                                            <div>{idea.Description}</div>
                                            <div className={style.line}></div>
                                            <div className={style.likeDislikeComment}>
                                                <div className={style.interactionButtons}>
                                                    {
                                                        thumbsIdeaId && thumbsIdeaId == idea._id ? <div>
                                                            <button className={style.like} onClick={() => handleLikeClick(userId, idea._id)}>{likeState.length} <i className="fa fa-thumbs-up"></i></button>
                                                            <button className={style.dislike} onClick={() => handleDisLikeClick(userId, idea._id)}>{dislikeState.length} <i className="fa fa-thumbs-down"></i></button></div>
                                                            : <div><button className={style.like} onClick={() => handleLikeClick(userId, idea._id)}>{idea.totallike} <i className="fa fa-thumbs-up"></i></button>
                                                                <button className={style.dislike} onClick={() => handleDisLikeClick(userId, idea._id)}>{idea.totaldislike} <i className="fa fa-thumbs-down"></i></button>
                                                            </div>
                                                    }
                                                    <button type="button" className={style.comment} onClick={() => { setShowCommentModal(true); setComments(idea.comments); handleView(userId, idea._id); setLastClosureDate(idea.LastClosureDate) }}><i className="fa fa-comment"></i></button>
                                                    {
                                                        thumbsIdeaId && thumbsIdeaId == idea._id ? <div><button disabled type="button" className={style.comment}>{viewState.length} <i className="fas fa-eye"></i></button> </div>
                                                            : <div><button type="button" disabled className={style.comment}>{idea.totalview} <i className="fas fa-eye"></i></button> </div>
                                                    }
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                            {
                                isFilteringCategory === false && isFilteringEvent === false && <div className={style.paginationButtons}>
                                    {currentPage > 1 && (
                                        <button onClick={() => setCurrentPage(currentPage - 1)}>Previous Page</button>
                                    )}
                                    {currentPage < maxPage && (
                                        <button onClick={() => setCurrentPage(currentPage + 1)}>Next Page</button>
                                    )}
                                </div>
                            }
                        </ul>
                    </div>
                    <RightSidebar trendings={trendings} topLikes={topLikes} topDislikes={topDislikes} setShowSpecificModal={setShowSpecificModal} setSpecificIdea={setSpecificIdea} />
                </div>
            </div>

            {showAddModal && <CreateModal createIdea={createIdea} createIdeaForm={createIdeaForm} onChangeCreateIdeaForm={onChangeCreateIdeaForm} categories={categories} handleAnonymousChange={handleAnonymousChange} isAnonymous={isAnonymous} setShowAddModal={setShowAddModal} handleFilesChange={handleFilesChange} events={events} />}

            {showUpdateModal && <UpdateModal updateIdea={updateIdea} updateIdeaForm={updateIdeaForm} onChangeUpdateIdeaForm={onChangeUpdateIdeaForm} handleAnonymousChange={handleAnonymousChange} setShowUpdateModal={setShowUpdateModal} isAnonymous={isAnonymous} />}

            {showDeleteModal && <DeleteModal deleteIdea={deleteIdea} setShowDeleteModal={setShowDeleteModal} />}

            {showCommentModal && <CommentModal comments={comments} setContent={setContent} setAnonymous={setAnonymous} setShowCommentModal={setShowCommentModal} Anonymous={Anonymous} handleKeyDown={handleKeyDown} deleteComment={deleteComment} handleKeyDownUpdate={handleKeyDownUpdateComment} isUpdatingComment={isUpdatingComment} setIsUpdatingComment={setIsUpdatingComment} Content={Content} lastClosureDate={lastClosureDate} userId={userId} />}

            {showSpecificModal && <SpecificIdeaModal specificIdea={specificIdea} setShowSpecificModal={setShowSpecificModal} formatTime={formatTime} />}
        </>
    )
}

export default Homepage