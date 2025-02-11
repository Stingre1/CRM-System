import Contact from '../models/contactModel.js';

// @desc Get all contacts
// @method GET api/contacts
const getAllContacts = async (req, res) => {
  const userId = req.user._id;
  try {
    let contacts;

    // If the user is a Sales Rep, only show their own contacts
    if (req.user.role === 'Sales Rep') {
      contacts = await Contact.find({ salesRep: userId })
      .populate('lead', 'leadName email')
      .populate('salesRep', 'name'); 
    } else {
      // Admins and Sales Managers can see all contacts
      contacts = await Contact.find()
      .populate('lead', 'leadName email')
      .populate('salesRep', 'name'); 
    }

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
  const userId = req.user._id;

  try {
    console.log("Contact id from req: ", id);
    const contact = await Contact.findById(id)
      .populate('lead', 'leadName email')
      .populate('salesRep', 'name');
    console.log("Contact: ", contact);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    // If the user is a Sales Rep, check if they own the contact
    if (req.user.role === 'Sales Rep' && contact.salesRep.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You can only access your own contacts.' });
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
  const { firstName, lastName, email, phoneNumber, lead, notes, salesRep } = req.body;

  // Only Admins and Sales Managers can create contacts
  if (req.user.role !== 'Admin' && req.user.role !== 'Sales Manager') {
    return res.status(403).json({ message: 'You are not authorized to create a contact.' });
  }

  try {
    const contact = new Contact({
      firstName,
      lastName,
      email,
      phoneNumber,
      lead,
      notes,
      salesRep, // Assigning salesRep as part of the contact creation
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
  const id = req.params.contactId;
  const updates = req.body;
  const userId = req.user._id;

  try {
    const validFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'lead', 'salesRep', 'notes'];
    const updateKeys = Object.keys(updates);

    // Validate fields
    if (!updateKeys.every(key => validFields.includes(key))) {
      return res.status(400).json({ message: 'Invalid fields in request body' });
    }

    console.log("Contact in update contact from req:", id); 
    const contact = await Contact.findById(id);
    console.log("Contact in update contact:", contact); 
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    // Check if the logged-in user is the owner or if they are an Admin/Sales Manager
    if (req.user.role === 'Sales Rep' && contact.salesRep.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You can only update your own contacts.' });
    }

    // Proceed with the update
    const updatedContact = await Contact.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    res.status(200).json({
      message: 'Contact updated successfully.',
      contact: updatedContact,
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
  const userId = req.user._id;

  try {
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    // Check if the logged-in user is the owner or if they are an Admin/Sales Manager
    if (req.user.role === 'Sales Rep' && contact.salesRep.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You can only delete your own contacts.' });
    }

    await Contact.findByIdAndDelete(id);

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
