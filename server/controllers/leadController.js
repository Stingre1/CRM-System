import Lead from '../models/leadModel.js';
import User from '../models/userModel.js';


const getAllLeads = async(req, res) => {
    try{
        const leads = await Lead.find();
        res.status(200).json({
            message: "Leads fetched successfully.",
            leads
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error. Could not fetch leads."
        });
    }
}

const getLeadById = async(req, res) => {
    const userId = req.param.userId;

    try {
        const lead = await Lead.findById(userId);
        res.status(200).json({
            message: "Lead fetched successfully.",
            lead
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error. Could not fetch requested lead."
        });
    }
}

// @desc Lets admin users assign Leads to other types of users
// @method PUT api/leads/:LeadId

const assignLead = async (req, res) => {
  const { leadId } = req.params.leadId;
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




export { getAllLeads, getLeadById,  }