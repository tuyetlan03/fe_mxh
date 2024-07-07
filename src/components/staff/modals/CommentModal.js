import { useEffect, useState } from 'react'

import style from './CommentModal.module.css'
import { PROFILE_INFORMATION } from '../../../constants/constants'

const CommentModal = ({ comments, setContent, setAnonymous, setShowCommentModal, Anonymous, handleKeyDown, handleKeyDownUpdate, deleteComment, setIsUpdatingComment, isUpdatingComment, Content, lastClosureDate, userId }) => {
    const profile_information = JSON.parse(localStorage.getItem(PROFILE_INFORMATION))
    const [updateComment, setUpdateComment] = useState({
        Content: '',
        _id: '',
        usercomment: {}
    })
    const [isAnonymousWhenUpdatingComment, setIsAnonymousWhenUpdatingComment] = useState(false)
    const [expiredEvent, setExpiredEvent] = useState(false)
    const checkLastClosureDate = () => {
        const newlastClosureDate = new Date(lastClosureDate)
        const lastClosureDateTime = newlastClosureDate.getTime()
        const today = new Date()
        const todayTime = today.getTime()
        if (lastClosureDateTime < todayTime) {
            setExpiredEvent(true)
        }
    }

    useEffect(() => {
        checkLastClosureDate()
    }, [])

    const getCommentInformationToInputField = (comment) => {
        setIsUpdatingComment(true)
        setUpdateComment({
            Content: comment.Content,
            _id: comment._id,
            usercomment: comment.usercomment
        })
        setIsAnonymousWhenUpdatingComment(comment.Anonymous)
    }

    return (
        <div className={style.overlayCommentIdea}>
            <div className={style.modalCommentIdea}>
                <div className={style.nameIdea}>
                    <h5 className={style.nameIdeaModal}>Idea's </h5>
                    <button onClick={() => setShowCommentModal(false)} className={style.closeCommentModal}><i className="fa fa-close"></i></button>
                </div>
                <div className={style.commentContainer}>
                    {
                        comments.map((comment, index) => {
                            return (
                                <div key={index} className={style.commentModal}>
                                    <div className={style.avatarComment}>
                                        {
                                            comment.Anonymous === true ? <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7vojjyljLC2ZHahToRN1w6Ll-1H1CQVrTXg&usqp=CAU' alt="avatar" className={style.logoAvatarCommentModal} /> : <img src={comment.usercomment.Avatar} alt="avatar" className={style.logoAvatarCommentModal} />
                                        }
                                        <div className={style.commentAndName}>
                                            {
                                                comment.Anonymous === true ? <h6 className={style.commentName}>Anonymous</h6> : <h6 className={style.commentName}>{comment.usercomment.Name}</h6>
                                            }
                                            <h6 className={style.commentComment}>{comment.Content}</h6>
                                            <h6 className={style.commentComment1}>{comment.LastEdition}</h6>
                                        </div>
                                        {
                                            comment.usercomment._id === userId ? (
                                                <div className={style.dropdown}>
                                                    <div className={style.dropdownToggle}>...
                                                        <div className={style.dropdownMenu}>
                                                            <a className={style.btnidea} onClick={() => getCommentInformationToInputField(comment)}>Update</a>
                                                            <a className={style.btnidea} onClick={() => deleteComment(comment._id)}>Delete</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : <></>
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className={style.avatarCommentCheck}>
                    {
                        expiredEvent === false ? (
                            <>
                                <img src={`${profile_information.Avatar}`} alt="avatar" className={style.logoAvatarComment} />
                                {
                                    isUpdatingComment === false ? (
                                        <>
                                            <input className={style.inputModalComment} type="text" value={Content} onChange={(event) => setContent(event.target.value)} onKeyDown={handleKeyDown} name="comment" placeholder="  Write comment" />
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={Anonymous} onChange={(event) => setAnonymous(event.target.checked)} />
                                                <label className="form-check-label" htmlFor="flexSwitchCheckDefault"></label>
                                            </div>
                                        </>
                                    ) :
                                        <>
                                            <input className={style.inputModalComment} type="text" value={updateComment.Content} onChange={(event) => setUpdateComment({ ...updateComment, [event.target.name]: event.target.value })} onKeyDown={handleKeyDownUpdate(isAnonymousWhenUpdatingComment, updateComment._id)} name="Content" placeholder="  Write comment" />
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={isAnonymousWhenUpdatingComment} onChange={(event) => setIsAnonymousWhenUpdatingComment(event.target.checked)} />
                                                <label className="form-check-label" htmlFor="flexSwitchCheckDefault"></label>
                                            </div>
                                        </>
                                }
                            </>
                        ) : <div className={style.commentMessage}>You cannot comment in this idea because this idea belongs to a closed event</div>
                    }
                </div>
            </div>
        </div>
    )
}

export default CommentModal