import Contact from "../models/Contact.js";

// POST /api/contact - Submit a contact message
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields (name, email, subject, and message)",
      });
    }

    const newContact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Thank you for contacting HackMate! We will get back to you shortly.",
      contact: newContact,
    });
  } catch (error) {
    console.error("Submit contact error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit contact message",
      error: error.message,
    });
  }
};

// GET /api/contact - Retrieve all contact messages (Admin)
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching contact inquiries",
      error: error.message,
    });
  }
};

