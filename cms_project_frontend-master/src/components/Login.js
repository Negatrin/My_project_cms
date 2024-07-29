import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toastError } from '../api/ToastService';
import { getUser, loginUser } from '../api/AuthService';


function Login() {
  const [values, setValues] = useState({ userName: '', password: '' });
  const navigate = useNavigate();

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await loginUser(values);
      if (res.status === 200) {
        setTimeout(async () => {
          const data = res.data;
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('auth-token',data.token);
        }, 0);
        navigate('/contacts');
      } else {
        toastError('Invalid username or password');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Invalid credentials');
      } else {
        toastError(error.message);
      }
    }
  };


  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="input-box">
          <span className="details">userName</span>
          <input type="text" name="userName" value={values.userName} onChange={onChange}  required />
        </div>
        <div className="input-box">
          <span className="details">Password</span>
          <input type="password" name="password" value={values.password} onChange={onChange} required />
        </div>
        <div className="form-footer">
          <button type="submit" className="btn">Login</button>
          <button type="button" className="btn" onClick={() => navigate('/register')}>Register</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
