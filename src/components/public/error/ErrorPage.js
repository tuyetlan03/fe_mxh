import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import style from './ErrorPage.module.css'

const ErrorPage = () => {
  const navigate = useNavigate()

  // Tự động c?\huyển hướng đến trang chủ sau 5 giây
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/')
    }, 5000)
    return () => clearTimeout(timeout)
  }, [navigate])

  return (
    <div className={style.errorPageContainer}>
      <div className={style.notfound}>
        <div className={style.notfound404}>
          <h1>4<span>0</span>4</h1>
        </div>
        <h2>The page you requested could not found</h2>
      </div>
    </div>
  )
}

export default ErrorPage