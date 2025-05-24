import React, { useEffect, useState } from "react";
import ContactPopup from "./ContactPopup";
import type { Contact } from "../../Types/types";
import {
  addContact,
  deleteContact,
  updateContact,
  uploadImage,
} from "../../../api/services/contactService";

interface ContactPopupContainerProps {
  contact?: Contact;
  onClose: () => void;
  onContactAdded?: () => void;
}

const ContactPopupContainer: React.FC<ContactPopupContainerProps> = ({
  contact,
  onClose,
  onContactAdded,
}) => {
  const [name, setName] = useState("");
  const [lastContactDate, setlastContactDate] = useState("");
  const [picture, setPicture] = useState<File | null>(null);

  const anonymousImage = "/anonymous.jpg";

  // Pre-fill values if editing
  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setlastContactDate(contact?.lastContactDate?.toISOString().split("T")[0]);
    }
  }, [contact]);

  const isEditMode = !!contact;

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Name cannot be empty.");
      return;
    }
    if (!lastContactDate) {
      alert("Last Contact Date cannot be empty.");
      return;
    }

    try {
      let pictureUrl: string | undefined;

      // If editing and picture is already a URL, retain it
      if (contact && typeof contact.picture === "string" && !picture) {
        pictureUrl = contact.picture;
      } else if (picture instanceof File) {
        pictureUrl = await uploadImage(picture); // Cloudinary upload
      } else {
        alert("You must upload a picture.");
        return;
      }

      const contactToSubmit: Omit<Contact, "id"> = {
        name,
        lastContactDate: new Date(lastContactDate),
        picture: pictureUrl,
      };

      if (isEditMode && contact) {
        await updateContact({ ...contactToSubmit, id: contact.id });
      } else {
        await addContact(contactToSubmit);
      }

      onContactAdded && (await onContactAdded());
      onClose();
    } catch (error) {
      console.error("Error submitting contact:", error);
      alert("There was an error saving the contact.");
    }
  };

  const handleDelete = async () => {
    if (contact) {
      try {
        await deleteContact(contact.id);
        onContactAdded && (await onContactAdded());
        onClose();
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  };

  return (
    <ContactPopup
      name={name}
      lastContactDate={lastContactDate}
      onClose={onClose}
      contact={contact}
      isEditMode={isEditMode}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      setName={setName}
      setlastContactDate={setlastContactDate}
      setPicture={setPicture}
    />
  );
};

export default ContactPopupContainer;
