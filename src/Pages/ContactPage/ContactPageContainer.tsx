import React, { useCallback, useEffect } from "react";
import ContactPage from "./ContactPage";
import { getContacts } from "../../../api/services/contactService";
import type { Contact } from "../../Types/types";
import ContactPopupContainer from "../../Components/ContactPopup/ContactPopupContainer";
//usar axios para hacer la peticion

const ContactPageContainer = () => {
  const [isAddContactOpen, setIsAddContactOpen] = React.useState(false);
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null);
  const [contactCards, setContactCards] = React.useState<Contact[]>([]);

  const fetchContacts = useCallback(async () => {
    try {
      const contacts = await getContacts();
      setContactCards(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsAddContactOpen(true);
  };

  return (
    <>
      <ContactPage
        onOpenPopup={() => {
          setSelectedContact(null);
          setIsAddContactOpen(true);
        }}
        contact={contactCards}
        onContactClick={handleContactClick}
      />
      {isAddContactOpen && (
        <ContactPopupContainer
          onClose={() => setIsAddContactOpen(false)}
          onContactAdded={fetchContacts}
          contact={selectedContact ? selectedContact : undefined}
        />
      )}
    </>
  );
};

export default ContactPageContainer;