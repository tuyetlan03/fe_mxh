import style from './RightSidebar.module.css'

const RightSidebar = ({ trendings, topLikes, topDislikes, setShowSpecificModal, setSpecificIdea }) => {
    return (
        <div className={style.rightSidebar}>
            <h4><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-fire" viewBox="0 0 16 16">
                <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16Zm0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15Z" />
            </svg> Trending Ideas</h4>
            <ul className={style.right_sidebar_ul}>
                {
                    trendings.map((trending, index) => (
                        <li key={index} className={style.topTrendingIdea} onClick={() => { setShowSpecificModal(true); setSpecificIdea(trending) }}>{trending.Title}</li>
                    ))
                }
            </ul>
            <hr />
            <h4><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-fire" viewBox="0 0 16 16">
                <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16Zm0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15Z" />
            </svg> Top Like Ideas</h4>
            <ul className={style.right_sidebar_ul}>
                {
                    topLikes.map((topLike, index) => (
                        <li key={index} className={style.topLikeIdea} onClick={() => { setShowSpecificModal(true); setSpecificIdea(topLike) }}>{topLike.Title}</li>
                    ))
                }
            </ul>
            <hr />
            <h4><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-fire" viewBox="0 0 16 16">
                <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16Zm0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15Z" />
            </svg> Top Dislike Ideas</h4>
            <ul className={style.right_sidebar_ul}>
                {
                    topDislikes.map((topDislike, index) => (
                        <li key={index} className={style.topDisLikeIdea} onClick={() => { setShowSpecificModal(true); setSpecificIdea(topDislike) }}>{topDislike.Title}</li>
                    ))
                }
            </ul>
        </div>
    )
}

export default RightSidebar