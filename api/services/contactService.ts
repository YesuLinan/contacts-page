import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { Contact } from "../../src/Types/types";
import { v4 as uuidv4 } from "uuid";

const API_BASE = "https://take-home-assessment-6juk.onrender.com/api/contacts";

export async function addContact(contact: Omit<Contact, "id">) {
  console.log("Adding contact:", contact);
  const res = await fetch(API_BASE + '/newContact', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
  return res.json();
}

export async function updateContact(contact: Contact) {
  console.log("Updating contact:", contact);
  const res = await fetch(`${API_BASE}/${contact.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
  return res.json();
}

export async function getContacts(): Promise<Contact[]> {
  console.log("Fetching contacts...");
  const res = await fetch(API_BASE+ '/allContacts');
  if (!res.ok) {
    throw new Error(`Failed to fetch contacts: ${res.statusText}`);
  }
  const data = await res.json();
  return data.map((contact: any) => ({
    ...contact,
    lastContactDate: contact.lastContactDate ? new Date(contact.lastContactDate) : null,
  }));
}

export async function deleteContact(id: string) {
  console.log("Deleting contact with id:", id);
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Failed to delete contact: ${res.statusText}`);
  }
  return res.json();
}

export async function uploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // converts to Base64
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}