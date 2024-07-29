import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import ContactList from './components/ContactList';
import { getallContacts, saveContact, updatePhoto, deleteContact } from './api/ContactService';
import { Routes, Route, Navigate } from 'react-router-dom';
import ContactDetail from './components/ContactDetail';
import { toastError, toastSuccess } from './api/ToastService';
import { ToastContainer } from 'react-toastify';
import Login from './components/Login';
import Register from './components/Register';
import { getUser } from './api/AuthService';

function App() {
  const modalRef = useRef();
  const fileRef = useRef();
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [file, setFile] = useState(undefined);
  //const [name, setname] = useState(null)
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    title: '',
    status: '',
  });

  const location = useLocation();
  const navigate = useNavigate();

  const getAllContacts = async (page = 0, size = 10) => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('auth-token');
      setCurrentPage(page);
      if (userId) {
        const { data } = await getallContacts(userId, page, size, token);
        setData(data);
      }
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleNewContact = async (event) => {
    event.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('auth-token');
      const { data: newContact } = await saveContact(values, userId, token);
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('id', newContact.id);

      toggleModal(false);
      setFile(undefined);
      fileRef.current.value = null;
      setValues({
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        status: '',
      });

      setData((prevData) => ({
        ...prevData,
        content: [newContact, ...prevData.content],
        totalElements: prevData.totalElements + 1,
      }));
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const updateContact = async (updatedContact) => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('auth-token');
      const { data: updatedData } = await saveContact(updatedContact, userId, token);

      setData((prevData) => ({
        ...prevData,
        content: prevData.content.map((contact) =>
          contact.id === updatedData.id ? updatedData : contact
        ),
      }));
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const updateImage = async (formData) => {
    try {
      //const { data: photoUrl } = await updatePhoto(formData);
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const deleteContactById = async (id) => {
    try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('auth-token');
        await deleteContact(id, userId, token);

        setData((prevData) => ({
            ...prevData,
            content: prevData.content.filter((contact) => contact.id !== id),
            totalElements: prevData.totalElements - 1,
        }));
        toastSuccess('Contact deleted successfully');
        navigate('/contacts');
    } catch (error) {
        console.log(error);
        toastError(error.message);
    }
};


  const toggleModal = (show) => (show ? modalRef.current.showModal() : modalRef.current.close());

  useEffect(() => {
    getAllContacts();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    //const token = localStorage.getItem('auth-token');
    //const res = getUser(userId, token)
    //setname(res.data.userName)
    if (userId) {
      setData({}); // Clear the current contacts data
      getAllContacts(); // Fetch the contacts for the new user
    }
  }, [localStorage.getItem('userId')]); // Add dependency on userId

  return (
    <>
      {location.pathname !== '/login' && location.pathname !== '/register' && (
        <Header toggleModal={toggleModal} nbOfContacts={data.totalElements}/>
      )}
      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contacts" element={<ContactList data={data} currentPage={currentPage} getAllContacts={getAllContacts} />} />
            <Route path="/contacts/:id" element={<ContactDetail updateContact={updateContact} updateImage={updateImage} deleteContactById={deleteContactById} />} />
          </Routes>
        </div>
      </main>

      <dialog ref={modalRef} className="modal" id="modal">
        <div className="modal__header">
          <h3>New Contact</h3>
          <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form onSubmit={handleNewContact}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Name</span>
                <input type="text" value={values.name} onChange={onChange} name="name" required />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input type="text" value={values.email} onChange={onChange} name="email" required />
              </div>
              <div className="input-box">
                <span className="details">Title</span>
                <input type="text" value={values.title} onChange={onChange} name="title" required />
              </div>
              <div className="input-box">
                <span className="details">Phone Number</span>
                <input type="text" value={values.phone} onChange={onChange} name="phone" required />
              </div>
              <div className="input-box">
                <span className="details">Address</span>
                <input type="text" value={values.address} onChange={onChange} name="address" required />
              </div>
              <div className="input-box">
                <span className="details">Account Status</span>
                <input type="text" value={values.status} onChange={onChange} name="status" required />
              </div>
              <div className="file-input">
                <span className="details">Profile Photo</span>
                <input type="file" onChange={(event) => setFile(event.target.files[0])} ref={fileRef} name="photo" required />
              </div>
            </div>
            <div className="form_footer">
              <button onClick={() => toggleModal(false)} type="button" className="btn btn-danger">Cancel</button>
              <button type="submit" className="btn">Save</button>
            </div>
          </form>
        </div>
      </dialog>
      <ToastContainer />
    </>
  );
}

export default App;
