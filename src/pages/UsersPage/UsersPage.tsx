import { useEffect } from 'react'
import { memo } from 'react'
import { useAppDispatch, useAppSelector } from '@/utils/hooks'
import { getUsersRequest } from '@/store/users/usersSlice'
import { getDisplayName } from '@/utils/user'
import { LoadingSpinner } from '@/components/ui'
import './UsersPage.scss'

const UsersPage = memo(() => {
  const dispatch = useAppDispatch()
  const { users, loading, pagination } = useAppSelector((state) => state.users)

  useEffect(() => {
    dispatch(getUsersRequest({ page: 1, limit: 10 }))
  }, [dispatch])

  return (
    <div className="users-page">
      <h1>Пользователи</h1>
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="users-list">
            {users.map((user) => (
              <div key={user.user_id} className="user-card">
                <h3>{getDisplayName(user)}</h3>
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
})

UsersPage.displayName = 'UsersPage'

export default UsersPage





