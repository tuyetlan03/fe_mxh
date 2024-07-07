//import từ thư viện bên ngoài
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

//import từ bên trong src
import { apiUrl, ACCESS_TOKEN, ACCOUNT_ID, ROLE, PROFILE_INFORMATION, USERNAME } from "../../../constants/constants"
import style from './LoginForm.module.css'
import { Link } from 'react-router-dom'

const LoginForm = () => {
    const navigate = useNavigate()
    const [loginForm, setLoginForm] = useState({
        Username: "",
        Password: ""
    })
    const [isDisableAccount, setIsDisableAccount] = useState(false)
    const [incorrectAccount, setIncorrectAccount] = useState(false)
    const onChangeLoginForm = event => setLoginForm({ ...loginForm, [event.target.name]: event.target.value })
    const login = async event => {
        event.preventDefault()
        setIsDisableAccount(false)
        try {
            const response = await axios.post(`${apiUrl}/auth/account/login`, loginForm)
            if (response.data.success) {
                console.log(response.data)
                setIsDisableAccount(false)
                localStorage.setItem(USERNAME, loginForm.Username)
                localStorage.setItem(ACCESS_TOKEN, response.data.accessToken)
                localStorage.setItem(ACCOUNT_ID, response.data.accountId)
                localStorage.setItem(ROLE, response.data.role)
                localStorage.setItem(PROFILE_INFORMATION, JSON.stringify(response.data.user))
                const role = response.data.role
                if (role === 'Staff')
                    navigate("/homepage")
                else if (role === 'QAM')
                    navigate("/qualityAssuranceManager")
                else if (role === 'Administrator')
                    navigate('/admin')
                else if (role === 'QAC')
                    navigate('/qualityAssuranceCoordinator')
            }
        } catch (error) {
            if (error.response.data.message === "Username or password is invalid") {
                setIncorrectAccount(true)
            }
            if (error.response.data.message === 'Your account is not active') {
                setIsDisableAccount(true)
            }
            console.error(error.response.data.message)
        }
    }

    const { Username, Password } = loginForm
    return (
        <>
            <div className={style.loginWrapper}>
                <div className={style.loginContainer}>
                    <form className={style.loginForm} onSubmit={login}>
                        <h1 className={style.loginText}>Login Account</h1>
                        {
                            incorrectAccount && <div className={style.warning_incorrect_account}>Incorrect Username or Password</div>
                        }
                        {
                            isDisableAccount && <div className={style.disableAccountMessage}>This account is disable, please try another account</div>
                        }
                        <div className={style.formGroup}>
                            <input
                                className={style.formControl}
                                type="text"
                                name="Username"
                                placeholder="Username"
                                required
                                value={Username}
                                onChange={onChangeLoginForm}
                            />
                        </div>

                        <div className={style.formGroup}>
                            <input
                                className={style.formControl}
                                type="password"
                                name="Password"
                                placeholder="Password"
                                required
                                value={Password}
                                onChange={onChangeLoginForm}
                            />

                            <div className={style.rememberme}>
                                <input className={style.formCheckInput} type="checkbox" id="rememberMe" />
                                <label className={style.lbRemember}>Remember me</label>
                            </div>
                        </div>
                        <div className={style.loginBtnWrapper}>
                            <input type="submit" className={style.loginBtn} value='Login' />
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default LoginForm
