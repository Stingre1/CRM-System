import Contact from '../models/contactModel.js';

// @desc Get all contacts
// @method GET api/contacts
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().populate('lead', 'leadName email');
    res.status(200).json({
      message: 'Contacts fetched successfully.',
      contacts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error. Could not fetch contacts.',
    });
  }
};

// @desc Get a contact by ID
// @method GET api/contacts/:id
const getContactById = async (req, res) => {
  const id = req.params.id;

  try {
    const contact = await Contact.findById(id).populate('lead', 'leadName email');
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    res.status(200).json({
      message: 'Contact fetched successfully.',
      contact,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error. Could not fetch requested contact.',
    });
  }
};

// @desc Create a new contact
// @method POST api/contacts
const createContact = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, lead, notes } = req.body;

  try {
    const contact = new Contact({
      firstName,
      lastName,
      email,
      phoneNumber,
      lead,
      notes,
    });

    await contact.save();

    res.status(201).json({
      message: 'Contact created successfully.',
      contact,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error. Could not create contact.',
    });
  }
};

// @desc Update a contact
// @method PUT api/contacts/:id
const updateContact = async (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  try {
    const validFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'notes'];
    const updateKeys = Objec.keys(updates);

    //validate
    if (!updateKeys.every(key => validFields.includes(key))) {
      return res.status(400).json({ message: 'Invalid fields in request body' });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    res.status(200).json({
      message: 'Contact updated successfully.',
      contact,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error. Could not update contact.',
    });
  }
};

// @desc Delete a contact
// @method DELETE api/contacts/:id
const deleteContact = async (req, res) => {
  const id = req.params.id;

  try {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    res.status(200).json({
      message: 'Contact deleted successfully.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error. Could not delete contact.',
    });
  }
};

export { getAllContacts, getContactById, createContact, updateContact, deleteContact };
