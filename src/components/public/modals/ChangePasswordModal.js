import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import style from './ChangePasswordModal.module.css'
import { apiUrl, USERNAME, ACCOUNT_ID, ACCESS_TOKEN } from '../../../constants/constants'

const ChangePasswordModal = ({ setShowChangePasswordModal }) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const username = localStorage.getItem(USERNAME)
    const accountId = localStorage.getItem(ACCOUNT_ID)
    const navigate = useNavigate()
    const [showMessageModal, setShowMessageModal] = useState(false)
    const [message, setMessage] = useState('')
    const [isPasswordNotMatched, setIsPasswordNotMatched] = useState(false)
    const [changePasswordForm, setChangePasswordForm] = useState({
        Username: username,
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const onChangePasswordForm = (event) => setChangePasswordForm({ ...changePasswordForm, [event.target.name]: event.target.value })

    useEffect(() => {
        if (changePasswordForm.newPassword === changePasswordForm.confirmPassword) {
            setIsPasswordNotMatched(false)
        }
        else {
            setIsPasswordNotMatched(true)
        }
    }, [changePasswordForm.newPassword, changePasswordForm.confirmPassword])

    const changePassword = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.put(`${apiUrl}/auth/account/changePassword/${accountId}`, changePasswordForm, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            setShowChangePasswordModal(false)
            if (response.data.success === true) {
                console.log(response.data)
                setMessage('You have changed password successfully')
                setShowMessageModal(true)
            }
        } catch (error) {
            console.log(error.response.data)
            if (error.response.status === 401) {
                navigate('/error')
            } else {
                setMessage('You have changed password failed, please try again')
                setShowMessageModal(true)
            }
        }
    }
    return (
        <>
            <form onSubmit={changePassword}>
                <div className={style.overlayChangePasswordModal}>
                    <div className={style.changePasswordModal}>
                        <div className={style.changePasswordModal_header}>
                            Change Password
                        </div>
                        <div className={style.changePasswordModal_body}>
                            <div className={style.changePasswordForm_input}>
                                <label htmlFor='username'>Username</label>
                                <input type='text' id='username' name='Username' value={changePasswordForm.Username} onChange={onChangePasswordForm} disabled={true} />
                            </div>
                            <div className={style.changePasswordForm_input}>
                                <label htmlFor='oldPassword'>Current Password</label>
                                <input type='password' id='oldPassword' name='oldPassword' value={changePasswordForm.oldPassword} onChange={onChangePasswordForm} required />
                            </div>
                            <div className={style.changePasswordForm_input}>
                                <label htmlFor='newPassword'>New Password</label>
                                <input type='password' id='newPassword' name='newPassword' value={changePasswordForm.newPassword} onChange={(event) => onChangePasswordForm(event)} required />
                            </div>
                            <div className={style.changePasswordForm_input}>
                                <label htmlFor='confirmPassword'>Confirm Password</label>
                                <input type='password' id='confirmPassword' name='confirmPassword' value={changePasswordForm.confirmPassword} onChange={(event) => onChangePasswordForm(event)} required />
                            </div>
                        </div>
                        <div className={style.changePasswordModal_footer}>
                            {
                                isPasswordNotMatched === true ? <input type='submit' value='Change Password' disabled={true} className={style.disableSubmitBtn} /> : <input type='submit' value='Change Password' className={style.submitBtn} />
                            }
                            <input type='button' value='Cancel' className={style.cancelBtn} onClick={() => setShowChangePasswordModal(false)} />
                        </div>
                    </div>
                </div>
            </form>

            {showMessageModal === true && (
                <div className={style.overlayMessageModal}>
                    <div className={style.messageModal}>
                        <div className={style.message}>{message}</div>
                        <button onClick={() => setShowMessageModal(false)}>Confirm</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default ChangePasswordModal