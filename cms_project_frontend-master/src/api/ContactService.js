import axios from "axios";

const API_URL = 'http://localhost:8082/contacts';

export async function saveContact(contact,userId, token) {
    return await axios.post(`${API_URL}?userId=${userId}`, contact, { headers: { Authorization: `Bearer ${token}` } });
}

export async function getContacts(page = 0, size = 10, token) {
    return await axios.get(`${API_URL}?page=${page}&size=${size}`, { headers: { Authorization: `Bearer ${token}` } });
}

export async function getContact(id, token) {
    return await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
}

export async function updateContact(contact, token) {
    return await axios.post(API_URL, contact, { headers: { Authorization: `Bearer ${token}` } });
}

export async function updatePhoto(formData,contactId) {
    return await axios.put(`${API_URL}/${contactId}/photo`, formData);
}

export async function deleteContact(contactId,userId, token) {
    return await axios.delete(`${API_URL}/users/${userId}/contacts/${contactId}`, { headers: { Authorization: `Bearer ${token}` } });
}

export async function getallContacts(userId, page = 0, size = 10, token) {
    return await axios.get(`${API_URL}/users/${userId}/contacts?page=${page}&size=${size}`, { headers: { Authorization: `Bearer ${token}` } });
}