import React, { useState, useEffect } from 'react';
import Contact from "./Contact";

const ContactList = ({ data, currentPage, getAllContacts }) => {
    const [contacts,setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredContacts, setFilteredContacts] = useState(data?.content || []);

    useEffect(() => {
        setFilteredContacts(data?.content || []);
    }, [data]);

    useEffect(() => {
        filterContacts();
    }, [searchTerm, data]);

    // useEffect (()=>{
    //     const fetchContacts = async ()=>{
    //         try{
    //             const data = await getAllContacts(localStorage.getItem('userId'));
    //             if (!data)
    //             {
    //                 throw new Error('No data found');
    //             }
    //             setContacts(data);
    //             console.log('data is' ,data)
    //         }catch(error){
    //             console.error(error)
    //         }
    //     }
    //     fetchContacts()
    // },[])

    const filterContacts = () => {
        if (!searchTerm) {
            setFilteredContacts(data?.content || []);
        } else {
            const filtered = data?.content.filter(contact =>
                contact.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredContacts(filtered);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <main className='main'>
            <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
                style={{ display: 'block', margin: '20px auto', padding: '10px', width: '80%', maxWidth: '600px', fontSize: '16px' }}
            />
            {filteredContacts.length === 0 && <div>No Contacts. Please add a new contact</div>}

            <ul className='contact__list'>
                {filteredContacts.length > 0 && filteredContacts.map(contact => <Contact contact={contact} key={contact.id} />)}
            </ul>

            {filteredContacts.length > 0 && data?.totalPages > 1 &&
            <div className='pagination'>
                <a onClick={() => getAllContacts(currentPage - 1)} className={0 === currentPage ? 'disabled' : ''}>&laquo;</a>

                {data && [...Array(data.totalPages).keys()].map((page) => 
                    <a onClick={() => getAllContacts(page)} className={currentPage === page ? 'active' : ''} key={page}>{page + 1}</a>
                )}

                <a onClick={() => getAllContacts(currentPage + 1)} className={data.totalPages === currentPage + 1 ? 'disabled' : ''}>&raquo;</a>
            </div>
            }
        </main>
    );
}

export default ContactList;