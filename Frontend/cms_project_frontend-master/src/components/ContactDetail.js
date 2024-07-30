import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { getContact } from '../api/ContactService';
import { toastError, toastSuccess } from '../api/ToastService';

const ContactDetail = ({ updateContact, updateImage, deleteContactById}) => {
    const inputRef = useRef();
    const navigate = useNavigate(); // Use useNavigate hook
    const [contact, setContact] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        status: '',
    });

    const handleDelete = async () => { // Make handleDelete async
        try {
            const token = localStorage.getItem('auth-token');
            await deleteContactById(id, token); // Await the deleteContactById call
            toastSuccess('Contact deleted successfully');
            navigate('/contacts'); // Navigate to contacts list after successful deletion
        } catch (error) {
            console.log(error);
            toastError(error.message);
        }
    };

    const { id } = useParams();

    const fetchContact = async (id) => {
        try {
            const token = localStorage.getItem('auth-token');
            const { data } = await getContact(id,token);
            setContact(data);
            console.log(data);
            //toastSuccess('Contact retrieved');
        } catch (error) {
            console.log(error);
            toastError(error.message);
        }
    };

   

    const udpatePhoto = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file, file.name);
            formData.append('id', id);
            //await updateImage(formData);
            setContact((prev) => ({ ...prev, photoUrl: `${prev.photoUrl}?updated_at=${new Date().getTime()}` }));
            toastSuccess('Photo updated');
        } catch (error) {
            console.log(error);
            toastError(error.message);
        }
    };

    const onChange = (event) => {
        setContact({ ...contact, [event.target.name]: event.target.value });
    };

    const onUpdateContact = async (event) => {
        const token = localStorage.getItem('auth-token');
        event.preventDefault();
        await updateContact(contact,token );        
        fetchContact(id);
        toastSuccess('Contact Updated');
    };

    useEffect(() => {
        fetchContact(id);
    }, [id]);

    return (
        <>
            <Link to={'/contacts'} className='link'><i className='bi bi-arrow-left'></i> Back to list</Link>
            <div className='profile'>
                <div className='profile__details'>
                    
                    <div className='profile__metadata'>
                        <p className='profile__name'>{contact.name}'s Information</p>
                    </div>
                </div>
                <div className='profile__settings'>
                    <div>
                        <form onSubmit={onUpdateContact} className="form">
                            <div className="user-details">
                                <input type="hidden" defaultValue={contact.id} name="id" required />
                                <div className="input-box">
                                    <span className="details">Name</span>
                                    <input type="text" value={contact.name} onChange={onChange} name="name" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Email</span>
                                    <input type="text" value={contact.email} onChange={onChange} name="email" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Phone</span>
                                    <input type="text" value={contact.phone} onChange={onChange} name="phone" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Address</span>
                                    <input type="text" value={contact.address} onChange={onChange} name="address" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Title</span>
                                    <input type="text" value={contact.title} onChange={onChange} name="title" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Status</span>
                                    <input type="text" value={contact.status} onChange={onChange} name="status" required />
                                </div>
                            </div>
                            <div className="form_footer">
                                <button type="submit" className="btn">Save</button>
                                <button type="button" onClick={handleDelete} className="btn">Delete Contact</button> {/* Add type="button" to avoid form submission */}
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <form style={{ display: 'none' }}>
                <input type='file' ref={inputRef} onChange={(event) => udpatePhoto(event.target.files[0])} name='file' accept='image/*' />
            </form>
        </>
    )
}

export default ContactDetail;
