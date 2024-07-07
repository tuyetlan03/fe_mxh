//import từ thư viện bên ngoài
import React, { useState, useEffect } from "react"
import axios from "axios"
import { io } from 'socket.io-client'
import Modal from "react-modal"
import { useNavigate } from "react-router-dom";
//import từ bên trong src
import Header from '../header/Header'
import LeftSidebar from "../sidebar/LeftSidebar"
import style from './Profile.module.css'
import CreateModal from "../modals/CreateModal"
import UpdateModal from "../modals/UpdateModal"
import DeleteModal from "../modals/DeleteModal"
import CommentModal from "../modals/CommentModal"
import { apiUrl, PROFILE_INFORMATION, ACCESS_TOKEN } from "../../../constants/constants"
import formatTime from '../../../utilities/formatTime'

Modal.setAppElement("#root")
const socket = io('https://server-enterprise.onrender.com', { transports: ['websocket'] })

function Profile() {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const profile_information = JSON.parse(localStorage.getItem(PROFILE_INFORMATION))
    const navigate = useNavigate()
    const userId = profile_information._id
    const convertedDoB = new Date(profile_information.DoB)
    profile_information.DoB = convertedDoB.toISOString().substr(0, 10)

    const IDEAS_PER_PAGE = 5
    const [currentPage, setCurrentPage] = useState(1)
    const [maxPage, setmaxPage] = useState(0)
    const [currentIdeas, setCurrentIdeas] = useState([])
    const [showAddModal, setShowAddModal] = useState(false) // trạng thái của modal hiển thị form add
    const [showUpdateModal, setShowUpdateModal] = useState(false) // trạng thái của modal hiển thị form update
    const [showCommentModal, setShowCommentModal] = useState(false) // trạng thái của modal hiển thị form comment
    const [showDeleteModal, setShowDeleteModal] = useState(false) // trạng thái của modal hiển thị delete confirm
    const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false)
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [isFilterCategory, setIsFilterCategory] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [isFilterEvent, setIsFilterEvent] = useState(false)

    const [profileIdeas, setProfileIdeas] = useState([])
    const [copiedIdeas, setCopiedIdeas] = useState([])
    const [copiedIdeasToSearch, setCopiedIdeasToSearch] = useState([])
    global.profileideas = profileIdeas
    const [categories, setCategories] = useState([])
    const [events, setEvents] = useState([])
    const [comments, setComments] = useState([])

    const [lastClosureDate, setLastClosureDate] = useState(null)
    const [downloadZipId, setDownloadZipId] = useState('')
    const [deleteIdeaId, setDeleteIdeaId] = useState('') // trạng thái lưu trữ giá trị id của idea sẽ bị xóa
    const [selectedFile, setSelectedFile] = useState(null)
    const [files, setFiles] = useState([])
    const [searchKeyWord, setSearchKeyWord] = useState('')

    const [updateProfileForm, setUpdateProfileForm] = useState({
        Name: profile_information.Name,
        Gender: profile_information.Gender,
        PhoneNumber: profile_information.PhoneNumber,
        DoB: profile_information.DoB,
        Email: profile_information.Email,
        Department: profile_information.Department
    })

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
        updatingDescription: ''
    })

    const [likeState, setLikeState] = useState([])
    const [dislikeState, setDislikeState] = useState([])
    const [viewState, setViewState] = useState([])
    const [thumbsIdeaId, setThumbsIdeaId] = useState(null)
    const [Content, setContent] = useState('')
    const [Anonymous, setAnonymous] = useState(false)
    const [idCmt, setIdCmt] = useState(null)
    const [z, setZ] = useState(null)
    const [isUpdatingComment, setIsUpdatingComment] = useState(false)
    let displayedIdeas = []
    if (isFilterCategory === true) {
        displayedIdeas = profileIdeas
    }
    else if (isFilterEvent === true) {
        displayedIdeas = profileIdeas
    }
    else if (isSearching === true) {
        displayedIdeas = profileIdeas
    }
    else {
        displayedIdeas = currentIdeas
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`${apiUrl}/idea/personalpage/${profile_information._id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                if (response.data.success) {
                    console.log(response.data)
                    response.data.ideas.forEach((idea) => {
                        idea.LastEdition = formatTime(new Date(idea.LastEdition))
                        idea.comments.forEach((comment) => {
                            comment.LastEdition = formatTime(new Date(comment.LastEdition))
                        })
                    })
                    setProfileIdeas(response.data.ideas)
                    setmaxPage(Math.ceil(response.data.ideas.length / IDEAS_PER_PAGE))
                    setCurrentIdeas(response.data.ideas.slice((currentPage - 1) * IDEAS_PER_PAGE, currentPage * IDEAS_PER_PAGE))
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
                    setCreateIdeaForm({
                        Title: '',
                        Description: '',
                        UserId: userId,
                        CategoryId: response.data.categories[0]._id,
                        AcademicYear: response.data.events[0].Year
                    })
                }
            } catch (error) {
                console.log(error.response.data)
                if (error.response.status === 401) {
                    navigate('/error')
                }
            }

        })()

        socket.on('like', (likedata, thumbsIdeaId) => {
            setLikeState(likedata)
            setThumbsIdeaId(thumbsIdeaId)
            setProfileIdeas(global.profileideas)
        })
        socket.on('dislike', (dislikedata, thumbsIdeaId) => {
            setDislikeState(dislikedata)
            setThumbsIdeaId(thumbsIdeaId)
            setProfileIdeas(global.profileideas)
        })
        socket.on('view', (viewdata, thumbsIdeaId) => {
            setViewState(viewdata)
            setThumbsIdeaId(thumbsIdeaId)
            setProfileIdeas(global.profileideas)
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

    const onChangeUpdateProfileForm = event => setUpdateProfileForm({ ...updateProfileForm, [event.target.name]: event.target.value })
    const onChangeCreateIdeaForm = event => setCreateIdeaForm({ ...createIdeaForm, [event.target.name]: event.target.value })
    const onChangeUpdateIdeaForm = event => setUpdateIdeaForm({ ...updateIdeaForm, [event.target.name]: event.target.value })
    const handleFileChange = event => setSelectedFile(event.target.files[0])
    const handleFilesChange = (event) => setFiles([...files, ...event.target.files])
    const handleAnonymousChange = event => setIsAnonymous(event.target.value === 'anonymous')

    const { Name, Gender, PhoneNumber, DoB, Email, Department } = updateProfileForm

    const updateProfile = () => {
        const formData = new FormData()
        formData.append('Name', Name)
        formData.append('Gender', Gender)
        formData.append('PhoneNumber', PhoneNumber)
        formData.append('DoB', DoB)
        formData.append('Email', Email)
        formData.append('Department', Department)
        formData.append('Avatar', selectedFile)
        console.log(formData)
        setShowUpdateProfileModal(false);
        (async () => {
            try {
                const response = await axios.put(`${apiUrl}/user/updateProfile/${profile_information._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                if (response.data.success) {
                    console.log(response.data.updatedProfile)
                    localStorage.setItem(PROFILE_INFORMATION, JSON.stringify(response.data.updatedProfile))
                }
            } catch (error) {
                console.log(error.response.data)
                if (error.response.status === 401) {
                    navigate('/error')
                }
            }
        })()
    }

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
                    setProfileIdeas([response.data.idea, ...profileIdeas])
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
                    const newIdeas = profileIdeas.map(idea => {
                        if (idea._id === response.data.idea._id) {
                            idea.Title = response.data.idea.Title
                            idea.Description = response.data.idea.Description
                            idea.Anonymous = response.data.idea.Anonymous
                        }
                        return idea
                    })
                    setProfileIdeas(newIdeas)
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
                    const afterDeletedIdeas = profileIdeas.filter(idea => idea._id !== deleteIdeaId)
                    setProfileIdeas(afterDeletedIdeas)
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
                <Header searchKeyWord={searchKeyWord} setSearchKeyWord={setSearchKeyWord} ideas={profileIdeas} setIdeas={setProfileIdeas} copiedIdeasToSearch={copiedIdeasToSearch} setIsSearching={setIsSearching} />
                <div className={style.container}>
                    <LeftSidebar categories={categories} setIdeas={setProfileIdeas} copiedIdeas={copiedIdeas} setIsFilterCategory={setIsFilterCategory} events={events} setIsFilterEvent={setIsFilterEvent} />
                    <div className={style.section}>
                        <ul>
                            <div className={style.avatarProfile}>
                                <img src={`${profile_information.Avatar}`} alt="avatar" className={style.logoProfile} />
                                <li className={style.profileName}>
                                    <div className={style.nameInfo}>
                                        <div className={style.nameAndBtn}>
                                            <p className={style.nameProfile}>{updateProfileForm.Name}</p>
                                            <button className={style.btnEditProfile} onClick={() => setShowUpdateProfileModal(true)}>Edit Profile</button>
                                            <Modal className={style.EditProfile} isOpen={showUpdateProfileModal} onRequestClose={() => setShowUpdateProfileModal(false)}>
                                                <form onSubmit={updateProfile}>
                                                    <div className={style.modalEditProfile}>
                                                        <div className={style.avatarEditProfile}>
                                                            <li><img src={`${profile_information.Avatar}`} alt="avatar" className={style.logoEditProfile} /></li>
                                                        </div>
                                                        <div className={style.modalEdit}>
                                                            <div className={style.modalName}>
                                                                <label>Name: </label>
                                                                <input type="text" name="Name" value={updateProfileForm.Name} className={style.inputModalProfile} onChange={onChangeUpdateProfileForm} />
                                                            </div>
                                                            <div className={style.modalGender}>
                                                                <label>Gender: </label>
                                                                <select value={updateProfileForm.Gender} name='Gender' className={style.inputModalProfileGender} onChange={onChangeUpdateProfileForm} >
                                                                    <option value="Male">Male</option>
                                                                    <option value="Female">Female</option>
                                                                </select>
                                                            </div>
                                                            <div className={style.modalName}>
                                                                <label>Phone Number: </label>
                                                                <input type="text" name="PhoneNumber" value={updateProfileForm.PhoneNumber} className={style.inputModalProfile} onChange={onChangeUpdateProfileForm} />
                                                            </div>
                                                            <div className={style.modalName}>
                                                                <label>Date of Birth: </label>
                                                                <input type="date" name="DoB" value={updateProfileForm.DoB} className={style.inputModalProfile} onChange={onChangeUpdateProfileForm} />
                                                            </div>
                                                            <div className={style.modalName}>
                                                                <label>Email: </label>
                                                                <input type="text" name="Email" value={updateProfileForm.Email} className={style.inputModalProfile} onChange={onChangeUpdateProfileForm} disabled={true} />
                                                            </div>
                                                            <div>
                                                                <label>Avatar: </label>
                                                                <input type='file' onChange={handleFileChange} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={style.btnSubmitCancel}>
                                                        <div className={style.btnSubmit}>
                                                            <button type="submit" className="btn btn-success" >Submit</button>
                                                        </div>
                                                        <div className={style.btnCancel}>
                                                            <button type="button" className="btn btn-danger" onClick={() => setShowUpdateProfileModal(false)}>Cancel</button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </Modal>
                                        </div>
                                        <div className={style.profileDescription}>
                                            <p className={style.posts}>{profileIdeas.length} Posts</p>
                                            <p className={style.friends}>{profileIdeas.reduce((acc, cur) => { return acc + cur.totalview; }, 0)} <i className="fas fa-eye"></i></p>
                                            <p className={style.friends}>{profileIdeas.reduce((acc, cur) => { return acc + cur.totallike; }, 0)} <i className="fa fa-thumbs-up"></i></p>
                                            <p className={style.friends}>{profileIdeas.reduce((acc, cur) => { return acc + cur.totaldislike; }, 0)} <i className="fa fa-thumbs-down"></i></p>
                                        </div>
                                    </div>
                                </li>
                            </div>
                            <div className={style.line}></div>
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
                                                    <img src={`${idea.userPost.Avatar}`} alt="avatar" className={style.logoAvatar} />
                                                    <div className={style.nameAndDate}>
                                                        <p className={style.name}>{idea.userPost.Name}</p>
                                                        <div className={style.dateDisplay}>{idea.LastEdition}</div>
                                                    </div>
                                                </div>
                                                <div className={style.dropdown}>
                                                    <div className={style.dropdownToggle}>
                                                        <i className="fa fa-ellipsis-h" onClick={() => showActionsWhenHoverAndGetCurrentIdea(idea)}>
                                                            <div className={style.dropdownMenu}>
                                                                <a className={style.btnidea} href="#" onClick={() => setShowUpdateModal(true)}>Update Idea</a>
                                                                <a className={style.btnidea} href="#" onClick={() => setShowDeleteModal(true)}>Delete</a>
                                                                <a className={style.btnidea} ><a href={`${apiUrl}/file/idea/downloadzip/${downloadZipId}`} >Download ZIP</a></a>
                                                            </div>
                                                        </i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={style.content}><b>{idea.Title}</b></div>
                                            <div>{idea.Description}</div>
                                            <div className={style.line}></div>
                                            <div className={style.likeDislikeComment}>
                                                <div className={style.interactionButtons}>
                                                    {
                                                        thumbsIdeaId && thumbsIdeaId === idea._id ? <div><button className={style.like} onClick={() => handleLikeClick(userId, idea._id)}>{likeState.length}<i className="fa fa-thumbs-up"></i></button>
                                                            <button className={style.dislike} onClick={() => handleDisLikeClick(userId, idea._id)}>{dislikeState.length} <i className="fa fa-thumbs-down"></i></button></div>
                                                            : <div><button className={style.like} onClick={() => handleLikeClick(userId, idea._id)}>{idea.totallike} <i className="fa fa-thumbs-up"></i></button>
                                                                <button className={style.dislike} onClick={() => handleDisLikeClick(userId, idea._id)}>{idea.totaldislike} <i className="fa fa-thumbs-down"></i></button></div>
                                                    }
                                                    <button type="button" className={style.comment} onClick={() => { setShowCommentModal(true); setComments(idea.comments); handleView(userId, idea._id); setLastClosureDate(idea.LastClosureDate) }}><i className="fa fa-comment"></i></button>
                                                    {
                                                        thumbsIdeaId && thumbsIdeaId === idea._id ? <div><button disabled type="button" className={style.comment}>{viewState.length}<i className="fas fa-eye"></i></button> </div>
                                                            : <div><button type="button" disabled className={style.comment}>{idea.totalview}<i className="fas fa-eye"></i></button> </div>
                                                    }
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                            {
                                isFilterCategory === false && <div className={style.paginationButtons}>
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
                </div>
            </div>

            {showAddModal && <CreateModal createIdea={createIdea} createIdeaForm={createIdeaForm} onChangeCreateIdeaForm={onChangeCreateIdeaForm} categories={categories} handleAnonymousChange={handleAnonymousChange} isAnonymous={isAnonymous} setShowAddModal={setShowAddModal} handleFilesChange={handleFilesChange} events={events} />}

            {showUpdateModal && <UpdateModal updateIdea={updateIdea} updateIdeaForm={updateIdeaForm} onChangeUpdateIdeaForm={onChangeUpdateIdeaForm} handleAnonymousChange={handleAnonymousChange} setShowUpdateModal={setShowUpdateModal} isAnonymous={isAnonymous} />}

            {showDeleteModal && <DeleteModal deleteIdea={deleteIdea} setShowDeleteModal={setShowDeleteModal} />}

            {showCommentModal && <CommentModal comments={comments} setContent={setContent} setAnonymous={setAnonymous} setShowCommentModal={setShowCommentModal} Anonymous={Anonymous} handleKeyDown={handleKeyDown} deleteComment={deleteComment} handleKeyDownUpdate={handleKeyDownUpdateComment} isUpdatingComment={isUpdatingComment} setIsUpdatingComment={setIsUpdatingComment} Content={Content} lastClosureDate={lastClosureDate} userId={userId} />}
        </>
    )
}

export default Profile