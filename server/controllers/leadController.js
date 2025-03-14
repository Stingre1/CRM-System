import Lead from '../models/leadModel.js';
import User from '../models/userModel.js';

// @desc Get all leads
// @method GET api/leads
const getAllLeads = async (req, res) => {
  try {
    console.log("getAllLeads - User Role:", req.user.role);
    console.log("getAllLeads - User ID:", req.user._id);

    let query = Lead.find().populate('assignedTo', 'name');
    console.log("getAllLeads - Mongoose Query (before execution):", query.getQuery());
    if (req.user.role === 'Sales Rep') {
      console.log("getAllLeads - SalesRep Role DETECTED. Applying filter.");
      query = query.where('assignedTo').equals(req.user._id); // <--- Simplified filter using .where() only
    } else {
      console.log("getAllLeads - Admin/SalesManager Role. No filtering applied.");
    }

    console.log("getAllLeads - Mongoose Query (before execution):", query.getQuery());

    const leads = await query.exec();
    console.log("getAllLeads - Number of leads returned:", leads.length);

    res.status(200).json({
      message: 'Leads fetched successfully.',
      leads,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error. Could not fetch leads.',
    });
  }
};

// @desc Get a lead by ID
// @method GET api/leads/:leadId
const getLeadById = async (req, res) => {
  const id = req.params.leadId;
  console.log(id);
  try {
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }
    res.status(200).json({
      message: 'Lead fetched successfully.',
      lead,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error. Could not fetch requested lead.',
    });
  }
};

// @desc Create a new lead
// @method POST api/leads/
const createLead = async (req, res) => {
  const { leadName, phoneNumber, email, status, leadDetails } = req.body;
  // console.log(`${leadName}, ${phoneNumber}, ${email}, ${leadDetails}`);
  try {
    const lead = new Lead({
      leadName,
      phoneNumber,
      email,
      status,
      leadDetails,
    });

    await lead.save();

    res.status(201).json({
      message: 'Lead created successfully.',
      lead,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error. Could not create lead.',
    });
  }
};

// @desc Update a lead's details
// @method PUT api/leads/:leadId
const updateLead = async (req, res) => {
  const id = req.params.leadId;
  const updates = req.body;

  try {
    const validFields = ['leadName', 'phoneNumber', 'email', 'status', 'leadDetails', 'assignedTo'];
    const updateKeys = Object.keys(updates); // gets just the keys

    //validate
    if (!updateKeys.every(key => validFields.includes(key))) {
      return res.status(400).json({ message: 'Invalid fields in request body' });
  }

    const lead = await Lead.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true } // Return the updated document and validate
    );

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    res.status(200).json({
      message: `Lead ${lead.leadName} updated successfully.`
    });
  } catch (err) {

    console.error(err);
    res.status(500).json({
      message: 'Internal server error. Could not update lead.',
    });
  }
};

// @desc Delete a lead
// @method DELETE api/leads/:id
const deleteLead = async (req, res) => {
  const id = req.params.leadId;

  try {
    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    res.status(200).json({
      message: 'Lead deleted successfully.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error. Could not delete lead.',
    });
  }
};

// @desc Assign a lead to a sales representative
// @method PUT api/leads/assign/:leadId/
const assignLead = async (req, res) => {
  const leadId = req.params.leadId;
  const { salesRepId } = req.body;

  try {
    const salesRep = await User.findById(salesRepId);
    if (!salesRep || salesRep.role !== 'Sales Rep') {
      return res.status(400).json({ message: 'Invalid Sales Representative ID.' });
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    // Update the lead with the new sales rep
    lead.assignedTo = salesRepId;
    lead.status = 'Assigned'; // Update status to 'Assigned'

    await lead.save();

    res.status(200).json({ message: 'Lead successfully assigned.', lead });
  } catch (err) {
    console.error(`Error assigning lead: ${err.message}`);
    res.status(500).json({ message: 'Server error while assigning lead.' });
  }
};

// @desc Search leads by a query (e.g., name, email, status)
// @method GET api/leads/search?query=value
const searchLeads = async (req, res) => {
  const query = req.query;

  try {
    const leads = await Lead.find({
      $or: [
        { leadName: { $regex: query, $options: 'i' } }, // Case-insensitive search by name
        { email: { $regex: query, $options: 'i' } },   // Case-insensitive search by email
        { status: { $regex: query, $options: 'i' } },  // Case-insensitive search by status
      ],
    });

    res.status(200).json({
      message: 'Leads fetched successfully.',
      leads,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error. Could not search leads.',
    });
  }
};

export {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  assignLead,
  searchLeads,
};