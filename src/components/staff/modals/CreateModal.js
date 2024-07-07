import { useRef, useState } from 'react'

import style from './CreateModal.module.css'
import { PROFILE_INFORMATION } from '../../../constants/constants'

const CreateModal = ({ createIdea, createIdeaForm, onChangeCreateIdeaForm, categories, handleAnonymousChange, isAnonymous, setShowAddModal, handleFilesChange, events }) => {
    const profile_information = JSON.parse(localStorage.getItem(PROFILE_INFORMATION))
    const [showMessageModal, setShowMessageModal] = useState(false)
    const [message, setMessage] = useState('')
    const [isChecked, setIsChecked] = useState(true)
    const [showConditionModal, setShowConditionMosdal] = useState(false)
    const fileInputRef = useRef(null)
    const today = new Date()
    const todayTime = today.getTime()
    const onSubmitIdea = (event) => {
        event.preventDefault()
        if (isChecked) {
            setShowAddModal(false)
            createIdea()
        }
        else {
            setMessage('Creating idea falied, you have to agree terms and conditions')
            setShowMessageModal(true)
        }
    }
    return (
        <>
            <div className={style.modalCreateIdea}>
                <form className={style.modalBodyCreateIdea} onSubmit={onSubmitIdea}>
                    <div className={style.modalBodyCreateIdea}>
                        <div>
                            <div className={style.createIdeaHeader}>
                                <h1 className={style.createIdea}>Create Idea</h1>
                            </div>
                        </div>
                        <div className={style.createIdeaContent}>
                            <div className={style.createIdeaAvt} >
                                <img className={style.avtIdea} src={`${profile_information.Avatar}`} alt='avatar' />
                            </div>
                            <div className={style.createIdeaName}>{profile_information.Name}</div>
                            <div className={style.dropdownMode}>
                                <div className={style.dropdown_content}>
                                    <select className={style.selectCate} value={createIdeaForm.CategoryId} name='CategoryId' onChange={onChangeCreateIdeaForm}>
                                        {
                                            categories.map((category, index) => {
                                                if (category.Status === 'Opening') {
                                                    return (
                                                        <option key={index} value={category._id}>
                                                            {category.Title}
                                                        </option>
                                                    )
                                                }
                                            })
                                        }
                                    </select>
                                    <select className={style.selectCate} value={createIdeaForm.AcademicYear} name='AcademicYear' onChange={onChangeCreateIdeaForm}>
                                        {
                                            events.map((eventObject, index) => {
                                                const newFirstClosureDate = new Date(eventObject.FirstClosureDate)
                                                const firstClosureDateTime = newFirstClosureDate.getTime()
                                                if (firstClosureDateTime >= todayTime) {
                                                    return (
                                                        <option key={index} value={eventObject.Year}>
                                                            {eventObject.Year}
                                                        </option>
                                                    )
                                                }
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className={style.formTitle}>
                                <input type='text' className={style.addTile} name='Title' placeholder="Title" onChange={onChangeCreateIdeaForm} required={true} />
                            </div>
                            <hr className={style.gach}></hr>
                        </div>

                        <div className={style.createIdeaFooter}>
                            <div className={style.footerLeft}>
                                <div className={style.inputIdea}>
                                    <textarea rows={10} className={style.inputForm} name='Description' placeholder="Description" onChange={onChangeCreateIdeaForm} required={true}></textarea>
                                </div>
                                <div className={style.addInfor}>
                                    <label className={style.lbPublic}>
                                        <input className={style.public} type="radio" name="isAnonymous" value="public" checked={!isAnonymous} onChange={handleAnonymousChange} />
                                        Public
                                    </label>
                                    <label className={style.lbAno}>
                                        <input className={style.anonymous} type="radio" name="isAnonymous" value="anonymous" checked={isAnonymous} onChange={handleAnonymousChange} />
                                        Anonymous
                                    </label>

                                    <div className={style.changeColor}>
                                        <img src="https://cdn-icons-png.flaticon.com/512/2659/2659360.png" className={style.imgChange} onClick={() => fileInputRef.current.click()} alt='image'/>
                                        <input type='file' ref={fileInputRef} onChange={handleFilesChange} multiple className={style.fileInput} />
                                    </div>
                                    <div className={style.footerLeftIcon}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-emoji-smile" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                            <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className={style.condition}>
                                    <label>
                                        <input type="checkbox" checked={isChecked} onChange={(event) => setIsChecked(event.target.checked)} /> I agree to Condition
                                    </label>
                                    <span className={style.linkCondition} onClick={() => setShowConditionMosdal(true)}>See conditions</span>
                                </div>
                                <div className={style.submitIdea1}>
                                    <div className={style.submitIdea2}>
                                        <button className={style.submitIdea3} type="submit">Post</button>
                                    </div>
                                </div>
                            </div>
                            <div className={style.footerRight}>
                                <button className={style.closeModalCreateIdea} onClick={() => setShowAddModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {showMessageModal && (
                <div className={style.overlayMessageModal}>
                    <div className={style.messageModal}>
                        <div className={style.messageLabel}>Message</div>
                        <div className={style.messageContent}>{message}</div>
                        <div className={style.messageButtonOk} onClick={() => { setShowMessageModal(false); setMessage('') }}>OK</div>
                    </div>
                </div>
            )}

            {showConditionModal && (
                <div className={style.overlayConditionModal}>
                    <div className={style.conditionModal}>
                        <div className={style.conditionLabel}>Condition</div>
                        <div className={style.conditionBody}>
                            <div className={style.conditionContent}>
                             <label> When you post an idea on a social network, you still retain the intellectual property rights of that idea, however, you need to be aware of some legal regulations and laws related to the posting of content on social networks as follows:</label>   
                               <ul>
                                <li>
                                Make sure that your ideas do not infringe any other person's intellectual property rights, including copyrights, trademarks, designs and
                                </li>
                                <li>If your idea is considered commercially viable, you may want to consider patenting or trademarking to secure your ownership.</li>
                                <li>If you want to protect your idea, you can use some electronic storage and certification services, like Safe Creative, to store and certify the idea's existence.</li>
                                <li>If your ideas are copied or abused on the platform, you may request that the content be removed or your intellectual property rights protected in accordance with the law.</li>
                               </ul>
                            </div>
                            
                        </div>
                        <div className={style.condtionButton} onClick={() => setShowConditionMosdal(false)}>OK</div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CreateModal