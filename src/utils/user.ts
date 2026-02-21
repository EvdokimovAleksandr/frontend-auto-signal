interface UserLike {
  user_id?: string
  username?: string | null
  name?: string | null
  first_name?: string | null
  last_name?: string | null
}

export const getDisplayName = (user: UserLike | null | undefined): string => {
  if (!user) return 'Гость'
  if (user.name) return user.name
  if (user.first_name || user.last_name) {
    return [user.first_name, user.last_name].filter(Boolean).join(' ').trim()
  }
  if (user.username) return user.username
  if (user.user_id) return `User ${user.user_id}`
  return 'Гость'
}
