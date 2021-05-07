const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  username: state => state.user.username,
  name: state => state.user.name,
  userId: state => state.user.userId,
  roles: state => state.user.roles,
}
export default getters
