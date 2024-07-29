import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toastError, toastSuccess } from '../api/ToastService';
import { registerUser } from '../api/AuthService';

function Register() {
  const [values, setValues] = useState({ userName: '', password: '' });
  const navigate = useNavigate();

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (values.password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    try {
      const res = await registerUser(values);
      if (res.status === 201) {
        toastSuccess('Registration successful. Please log in.');
        navigate('/');
      }
    } catch (error) {
      toastError('User with these credentials already exists');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div className="input-box">
          <span className="details">userName</span>
          <input type="text" name="userName" value={values.userName} onChange={onChange} required />
        </div>
        <div className="input-box">
          <span className="details">Password</span>
          <input type="password" name="password" value={values.password} onChange={onChange} required />
        </div>
        <div className="form-footer">
          <button type="submit" className="btn">Register</button>
          <button type="button" className="btn" onClick={() => navigate('/')}>Back to Login</button>
        </div>
      </form>
    </div>
  );
}

export default Register;
