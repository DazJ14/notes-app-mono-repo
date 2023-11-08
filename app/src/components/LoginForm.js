import Togglable from './Togglable'
import PropTypes from 'prop-types'

const LoginForm = ({ handleSubmit, ...props }) => {
  return (
    <Togglable buttonLabel='SHOW LOGIN'>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type='text'
            value={props.username}
            name='Username'
            placeholder='Username'
            onChange={props.handleUsernameChange}
          />
        </div>
        <div>
          <input
            type='password'
            value={props.password}
            name='Password'
            placeholder='Password'
            onChange={props.handlePasswordChange}
          />
        </div>
        <button id='form-login-button' type='submit'>
          Login
        </button>
      </form>
    </Togglable>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
}

export default LoginForm
