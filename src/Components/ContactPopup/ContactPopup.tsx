import React from "react";
import InputContainer from "../Input/InputContainer";
import type { Contact, InputChangeEvent } from "../../Types/types";
import Button from "../Button/Button";

interface ContactPopupProps {
  name: string;
  lastContactDate: string;
  contact?: Contact;
  onClose: () => void;
  isEditMode: boolean;
  onSubmit: () => void;
  onDelete: () => void;
  setName: (name: string) => void;
  setlastContactDate: (date: string) => void;
  setPicture: (picture: File | null) => void;
}

const ContactPopup: React.FC<ContactPopupProps> = ({
  name,
  lastContactDate: lastContactDate,
  contact,
  onClose,
  isEditMode,
  onSubmit,
  onDelete,
  setName,
  setlastContactDate,
  setPicture,
}) => {
  return (
    // Blackout background with some transparency (backdrop-filter for blur + bg opacity)
    <div
      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose} // close when clicking outside popup
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // prevent close on popup click
      >
        <h2 className="text-xl font-semibold text-center mb-6">
          {isEditMode ? "Editing Contact" : "Adding Contact"}
        </h2>

        <InputContainer
          title={"Contact Name"}
          value={name}
          onChange={(e: any) => setName(e.target.value)}
          maxLength={50}
        />

        <InputContainer
          title={"Profile Picture"}
          type="file"
          onChange={(e: InputChangeEvent) => {
            const file = e.target.files && e.target.files[0];
            setPicture(file ?? null);
          }}
        />

        <InputContainer
          title={"Last Contact Date"}
          type="date"
          value={lastContactDate} // format date to YYYY-MM-DD
          onChange={(e: any) => setlastContactDate(e.target.value)}
        />

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <Button text={isEditMode ? "Update Contact" : "Add Contact"} onClick={onSubmit} />
          {isEditMode && <Button text="Delete Contact" onClick={onDelete}/>}
        </div>
      </div>
    </div>
  );
};

export default ContactPopup;
