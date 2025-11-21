import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../utils/hooks'
import { getUsersRequest } from '../../store/users/usersSlice'
import './UsersPage.css'

const UsersPage = () => {
  const dispatch = useAppDispatch()
  const { users, loading, pagination } = useAppSelector((state) => state.users)

  useEffect(() => {
    dispatch(getUsersRequest({ page: 1, limit: 10 }))
  }, [dispatch])

  return (
    <div className="users-page">
      <h1>Пользователи</h1>
      
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <>
          <div className="users-list">
            {users.map((user) => (
              <div key={user.id} className="user-card">
                <h3>{user.name || user.username || `User ${user.user_id}`}</h3>
                <p>ID: {user.user_id}</p>
                {user.username && <p>Username: @{user.username}</p>}
              </div>
            ))}
          </div>
          
          {pagination && (
            <div className="pagination">
              <p>
                Страница {pagination.currentPage} из {pagination.totalPages}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default UsersPage


