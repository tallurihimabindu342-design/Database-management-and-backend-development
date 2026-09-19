import Notification from "../models/Notification.js";

/**
 * GET /api/notifications/:patientName
 * Returns all notifications for a patient, newest first.
 */
export async function getNotifications(req, res) {
  try {
    const { patientName } = req.params;
    const notifications = await Notification.find({ patientName })
      .sort({ createdAt: -1 })
      .limit(50);
    return res.json(notifications);
  } catch (err) {
    console.error("Get notifications error:", err.message);
    return res.status(500).json({ error: "Failed to fetch notifications." });
  }
}

/**
 * PATCH /api/notifications/:id/read
 * Marks a single notification as read.
 */
export async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }
    return res.json(notification);
  } catch (err) {
    console.error("Mark as read error:", err.message);
    return res.status(500).json({ error: "Failed to update notification." });
  }
}

/**
 * PATCH /api/notifications/:patientName/read-all
 * Marks all notifications for a patient as read.
 */
export async function markAllAsRead(req, res) {
  try {
    const { patientName } = req.params;
    await Notification.updateMany({ patientName, read: false }, { read: true });
    return res.json({ message: "All notifications marked as read." });
  } catch (err) {
    console.error("Mark all as read error:", err.message);
    return res.status(500).json({ error: "Failed to update notifications." });
  }
}

/**
 * POST /api/notifications
 * Creates a new notification — used internally by other controllers.
 */
export async function createNotification(req, res) {
  try {
    const { patientName, type, title, message } = req.body;
    if (!patientName || !type || !message) {
      return res.status(400).json({ error: "patientName, type and message are required." });
    }
    const notification = await Notification.create({ patientName, type, title, message });
    return res.status(201).json(notification);
  } catch (err) {
    console.error("Create notification error:", err.message);
    return res.status(500).json({ error: "Failed to create notification." });
  }
}