import React, { useState, useEffect } from "react"
import axios from "axios"
import Modal from "react-modal"
import style from "./HomeAd.module.css"
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet"

import { apiUrl, ACCESS_TOKEN } from "../../../constants/constants"
import HeaderAd from "../header/HeaderAd"
import SidebarAd from "../sidebar/SidebarAd"
import ChangePasswordModal from "../../public/modals/ChangePasswordModal"

function HomeAd() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const navigate = useNavigate()
  const roles = ['Administrator', 'QAM', 'QAC', 'Staff']
  const departments = ['None','IT', 'Marketing', 'Sale', 'HR']
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showDisableUserModal, setShowDisableUserModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [message, setMessage] = useState('')
  const [disableAccountId, setDisableAccountId] = useState('')
  const [isChangedAccountStatus, setIsChangedAccountStatus] = useState(false)
  const [accounts, setAccounts] = useState([])

  const [createAccountForm, setCreateAccountForm] = useState({
    Username: "",
    Password: "",
    Role: roles[0],
    PhoneNumber: "",
    Email: "",
    Department: departments[0]
  })

  const { Username, Password, Role, PhoneNumber, Email, Department } = createAccountForm
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/account/listAccount`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        if (response.data.success) {
          setIsChangedAccountStatus(false)
          console.log(response.data.accounts)
          setAccounts(response.data.accounts)
        }
      } catch (error) {
        console.log(error)
        if (error.response.status === 401) {
          navigate('/error')
        }

      }
    })()
  }, [isChangedAccountStatus])

  const onChangeCreateAccountForm = (event) => setCreateAccountForm({ ...createAccountForm, [event.target.name]: event.target.value })

  const createAccount = event => {
    console.log(createAccountForm)
    event.preventDefault()
    setShowAddUserModal(false);
    (async () => {
      try {
        const response = await axios.post(`${apiUrl}/auth/account/createAccount`, createAccountForm, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        if (response.data.success) {
          console.log(response.data)
          const newAccount = {...response.data.newAccount, Email: [response.data.Email], Department: [response.data.Department]}
          setAccounts([newAccount, ...accounts])
          setCreateAccountForm({
            Username: "",
            Password: "",
            Role: roles[0],
            PhoneNumber: "",
            Email: "",
            Department: departments[0]
          })
        }
      } catch (error) {
        console.log(error.response.data)
        if (error.response.status === 401) {
          navigate('/error')
        }
        else {
          setMessage(error.response.data.message)
          setShowMessageModal(true)
        }
      }
    })()
  }

  const showDisableAccountModalAndGetAccountId = (id) => {
    setShowDisableUserModal(true)
    setDisableAccountId(id)
  }

  const changeAccountStatus = (id) => {
    setIsChangedAccountStatus(true)
    setShowDisableUserModal(false);
    (async () => {
      try {
        const response = await axios.put(`${apiUrl}/auth/account/changeAccountStatus/${id}`, {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        if (response.success === true) {
          console.log(response.data)
          const changedAccountStatusList = accounts.filter(account => {
            if (account._id === response.data.changeAccount._id) account.Active = response.data.changeAccount.Active
          })
          setAccounts(changedAccountStatusList)
        }
      } catch (error) {
        console.error(error.response.data)
        if (error.response.status === 401) {
          navigate('/error')
        }
      }
    })()
  }

  return (
    <>
      <div className={style.accountManage}>
        <Helmet>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>
        <label htmlFor="navInput" className={style.overlaySidebar}></label>
        <SidebarAd />

        <div className={style.adContainer}>
          <HeaderAd />
          <div className={style.containerBody}>
            <div className={style.setEvent}>
              <button className={style.btnSetEvent} onClick={() => setShowChangePasswordModal(true)}> Change password</button>
            </div>
            <div className={style.rowAd}>
              <div className={style.cardAd}>
                <div className={style.cardTb}>
                  <div className={style.cardHeader}>
                    <div className={style.cardSmall}>
                      <h6 className={style.accountTableTilte}>Account Management / {accounts.length} accounts</h6>
                      <p className={style.addUser}>
                        <i className="fa fa-user-plus" aria-hidden="true" title="Add Account" onClick={() => setShowAddUserModal(true)}></i>
                      </p>
                    </div>
                  </div>
                  <Modal className={style.addModal} isOpen={showAddUserModal} onRequestClose={() => setShowAddUserModal(false)}>
                    <div className={style.modalAddEvent}>
                      <form className={style.modalBodyAddAccount} onSubmit={createAccount}>
                        <div className={style.modalBodyAddEvent}>
                          <div>
                            <div className={style.addModalHeader}>
                              <i className="fa fa-reply" aria-hidden="true" onClick={() => setShowAddUserModal(false)}></i>
                              <h2>Add Account</h2>
                            </div>
                            <div className={style.addModalBody}>
                              <div className={style.addFormGroup}>
                                <input type="text" className={style.addFormControl} placeholder="Username" name="Username" value={Username} onChange={onChangeCreateAccountForm} required></input>
                              </div>
                              <div className={style.addFormGroup}>
                                <input type="password" className={style.addFormControl} placeholder="Password" name="Password" value={Password} onChange={onChangeCreateAccountForm} required></input>
                              </div>
                              <div className={style.addFormGroup}>
                                <input type="email" className={style.addFormControl} placeholder="Email" name="Email" value={Email} onChange={onChangeCreateAccountForm} required></input>
                              </div>
                              <div className={style.addFormGroup} >
                                <select name="Role" value={Role} onChange={onChangeCreateAccountForm}>
                                  {
                                    roles.map((role, index) => (
                                      <option key={index} value={role}>{role}</option>
                                    ))
                                  }
                                </select>
                              </div>
                              <div className={style.addFormGroup}>
                                <input type="text" className={style.addFormControl} placeholder="Phone Number" name="PhoneNumber" value={PhoneNumber} onChange={onChangeCreateAccountForm} required></input>
                              </div>
                              <div className={style.addFormGroup} >
                                <select name="Department" value={Department} onChange={onChangeCreateAccountForm}>
                                  {
                                    Role === roles[0] || Role === roles[1] ? <option value={'None'}>This role will not be able to select a department</option> :
                                      (
                                        departments.map((department, index) => (
                                          <option key={index} value={department}>{department}</option>
                                        ))
                                      )
                                  }
                                </select>
                              </div>
                              <button type="submit" className={style.createAccount}>Create Account</button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </Modal>

                  <div className={style.cardBodyAd}>
                    <div className={style.tableResponsive}>
                      <table className="table align-items-center">
                        <thead>
                          <tr>
                            <th className={style.thAccount}>Account</th>
                            <th className={style.thAccount}>Role</th>
                            <th className={style.thAccount}>Department</th>
                            <th className={style.thAccount}>Active</th>
                            <th className={style.thAccount}>Disable</th>
                          </tr>
                        </thead>
                        <tbody>
                          {accounts.map((account, index) => (
                            <tr key={index}>
                              <td>
                                <div className={style.tbCenter}>
                                  <div className={style.nameAccount}>
                                    <h6 className={style.nameUser}>{account.Username}</h6>
                                    <p className={style.emailUser}><a className={style.email}>{account.Email}</a></p>
                                  </div>
                                </div>
                              </td>
                              <td className={style.row}><span>{account.Role}</span></td>
                              <td className={style.row}>{account.Department}</td>
                              <td className={style.row}>
                                {
                                  account.Active === true ? <button className={style.statusOnl_Disable} disabled={true} onClick={() => changeAccountStatus(account._id)}>Active</button> : <button className={style.statusOnl} onClick={() => changeAccountStatus(account._id)}>Active</button>
                                }
                              </td>
                              <td className={style.row}>
                                <div className={style.addModal}>
                                  {
                                    account.Active === true ? <button className={style.btnDisable} onClick={() => showDisableAccountModalAndGetAccountId(account._id)}>Disable</button> : <button disabled={true} className={style.btnDisable_Disable} onClick={() => setShowDisableUserModal(true)}>Disable</button>
                                  }
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>


                  {/* Nodal disable account  */}
                  <Modal className={style.addModal} isOpen={showDisableUserModal} onRequestClose={() => setShowDisableUserModal(false)}>
                    <div className={style.modalAddEvent}>
                      <form className={style.modalBodyAddEvent}>
                        <div className={style.modalBodyAddEvent}>
                          <div className={style.modalContentDeleteIdea}>
                            <img src="https://cdn-icons-png.flaticon.com/128/9789/9789276.png" className={style.imgResponsive} />
                            <h2 className={style.containerDelete}>Disable Account</h2>
                            <p className={style.contextDeleteIdea}>Are you sure you want to disable account? This action cannot be undone.</p>
                            <button className={style.btnAgree} onClick={() => changeAccountStatus(disableAccountId)}>Disable</button>
                            <button className={style.btnCancel} onClick={() => setShowDisableUserModal(false)}>Cancel</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showChangePasswordModal && <ChangePasswordModal setShowChangePasswordModal={setShowChangePasswordModal} />}

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
export default HomeAd