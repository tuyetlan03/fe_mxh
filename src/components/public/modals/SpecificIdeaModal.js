import {useEffect, useState, useRef} from 'react'
import style from './SpecificIdeaModal.module.css'

const SpecificIdeaModal = ({ specificIdea, setShowSpecificModal, formatTime }) => {
    const [height, setHeight] = useState(0)
    const myRef = useRef(null)
    useEffect(() => {
        specificIdea.LastEdition = formatTime(new Date(specificIdea.LastEdition))
        setHeight(myRef.current.offsetHeight)
    }, [])
    return (
        <div className={style.overlaySpecificIdea}>
            <div className={style.modalSpecificIdea}>
                <div className={style.headerSpecificIdea}>
                    <div className={style.labelSpecificIdea}>Specific Idea</div>
                    <button onClick={() => setShowSpecificModal(false)} className={style.closeCommentModal}><i className="fa fa-close"></i></button>
                </div>
                <div className={style.bodySpecificIdea} ref={myRef}>
                    <div className={style.userInformation}>
                        <div className={style.avatarSpecificIdea}>
                            <img src={specificIdea.userPost.Avatar} alt='avatar' />
                        </div>
                        <div className={style.nameAndDateSpecificIdea}>
                            <div className={style.nameSpecificIdea}>{specificIdea.userPost.Name}</div>
                            <div className={style.dateSpecificIDea}>{specificIdea.LastEdition}</div>
                        </div>
                    </div>
                    <div className={style.ideaContent}>
                        <div className={style.titleSpecificIdea}>
                            {specificIdea.Title}
                        </div>
                        <div className={style.descriptionSpecificIdea}>
                            {specificIdea.Description}
                        </div>
                    </div>
                </div>
                <div className={style.footerSpecificIdea} style={{ height: `calc(700px - 52px - 30px - ${height}px)` }}>
                    <div className={style.commentLabel}>Comments</div>
                    {
                        specificIdea.comments.map((comment, index) => (
                            <div className={style.listCommentsSpecificIdea} key={index}>
                                <div className={style.avatarComment}><img src={comment.Anonymous === false ? comment.usercomment.Avatar : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7vojjyljLC2ZHahToRN1w6Ll-1H1CQVrTXg&usqp=CAU'} alt='avatar'/></div>
                                <div className={style.commentUserNameAndContent}>
                                    <div className={style.commentUserName}>{comment.Anonymous === false ? comment.usercomment.Name : 'Anonymous'}</div>
                                    <div className={style.commentContent}>{comment.Content}</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default SpecificIdeaModal