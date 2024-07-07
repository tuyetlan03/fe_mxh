//import từ thư viện bên ngoài
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from 'react-router-dom'

//import từ bên trong src
import style from "./Header.module.css"
import ChangePasswordModal from "../../public/modals/ChangePasswordModal"
import { ACCESS_TOKEN, ACCOUNT_ID, ROLE, PROFILE_INFORMATION } from '../../../constants/constants'

const Header = ({ searchKeyWord, setSearchKeyWord, ideas, setIdeas, copiedIdeasToSearch, setIsSearching }) => {
	const profile_information = JSON.parse(localStorage.getItem(PROFILE_INFORMATION))
	const navigate = useNavigate()
	const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
	const [fixed, setFixed] = useState(false)
	useEffect(() => {
		window.addEventListener("scroll", handleScroll)
		return () => {
			window.removeEventListener("scroll", handleScroll)
		}
	}, [])

	const logout = event => {
		event.preventDefault()
		localStorage.removeItem(ACCESS_TOKEN)
		localStorage.removeItem(ACCOUNT_ID)
		localStorage.removeItem(ROLE)
		localStorage.removeItem(PROFILE_INFORMATION)
		navigate('/')
	}

	const handleScroll = () => {
		if (window.pageYOffset >= 0) {
			setFixed(true)
		} else {
			setFixed(false)
		}
	}

	const onSearchKeyWordChange = (event) => {
		setSearchKeyWord(event.target.value)
		if (event.target.value === '') {
			setIsSearching(false)
			setIdeas(copiedIdeasToSearch)
		}
		else {
			setIsSearching(true)
			const filteredIdeas = copiedIdeasToSearch.filter(idea => idea.Title.toLowerCase().includes(event.target.value.toLowerCase()))
			setIdeas(filteredIdeas)
		}
	}

	return (
		<>
			<header className={fixed ? style.fixed : ""}>
				<nav className={style.navbar}>
					<div className={style.logo}>
						<Link to="/homepage">
							<img src={'https://th.bing.com/th/id/R.36c561fead49be39b078d6e3cf81183e?rik=W57wT%2bLmBCKoCw&riu=http%3a%2f%2flogos-download.com%2fwp-content%2fuploads%2f2016%2f07%2fGuinness_World_Records_logo.png&ehk=bBtJ%2b1IZ8oz%2fEDUudx5DBHamBz3jqWrqXCTvKmNkPro%3d&risl=&pid=ImgRaw&r=0'} alt="avatar" />
						</Link>
					</div>
					<div className={style.searchContainer}>
						<input type="text" placeholder="Search" value={searchKeyWord} onChange={(event) => onSearchKeyWordChange(event)} />
					</div>
					<div className={style.dropdown}>
						<div className={style.dropdownToggle}>
							<img src={`${profile_information.Avatar}`} alt="avatar" className={style.avatar} />
							<i className="fa fa-caret-down">
								<div className={style.dropdownMenu}>
									<div><Link to="/profile">Profile</Link></div>
									<div onClick={() => setShowChangePasswordModal(true)}>Change Password</div>
									<div onClick={logout}>Logout</div>
								</div>
							</i>
						</div>
					</div>
				</nav>
			</header>

			{showChangePasswordModal && <ChangePasswordModal setShowChangePasswordModal={setShowChangePasswordModal} />}
		</>
	)
}

export default Header