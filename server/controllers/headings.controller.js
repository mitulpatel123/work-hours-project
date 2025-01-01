import Heading from '../models/Heading.model.js';
import WorkHour from '../models/WorkHour.model.js';

export const createHeading = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ message: 'Valid heading name is required (minimum 2 characters)' });
    }

    // Find the maximum order for the user's headings
    const maxOrder = await Heading.findOne({ user: req.user._id })
      .sort({ order: -1 })
      .select('order');

    const heading = await Heading.create({
      name: name.trim(),
      order: maxOrder ? maxOrder.order + 1 : 0,
      user: req.user._id,
    });

    res.status(201).json(heading);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A heading with this name already exists' });
    }
    console.error('Create heading error:', error);
    res.status(500).json({ message: 'Failed to create heading' });
  }
};

export const getHeadings = async (req, res) => {
  try {
    const headings = await Heading.find({ user: req.user._id })
      .sort({ order: 1 });
    res.json(headings);
  } catch (error) {
    console.error('Get headings error:', error);
    res.status(500).json({ message: 'Failed to fetch headings' });
  }
};

export const updateHeading = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ message: 'Valid heading name is required (minimum 2 characters)' });
    }

    const heading = await Heading.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    if (!heading) {
      return res.status(404).json({ message: 'Heading not found' });
    }

    res.json(heading);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A heading with this name already exists' });
    }
    console.error('Update heading error:', error);
    res.status(500).json({ message: 'Failed to update heading' });
  }
};

export const deleteHeading = async (req, res) => {
  try {
    const { id } = req.params;

    // First check if heading is being used
    const usedInWorkHours = await WorkHour.exists({
      heading: id,
      user: req.user._id,
    });

    if (usedInWorkHours) {
      return res.status(400).json({
        message: 'Cannot delete heading that is being used in work hours entries'
      });
    }

    const heading = await Heading.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!heading) {
      return res.status(404).json({ message: 'Heading not found' });
    }

    // Reorder remaining headings to ensure no gaps
    await Heading.updateMany(
      {
        user: req.user._id,
        order: { $gt: heading.order },
      },
      { $inc: { order: -1 } }
    );

    res.json({ message: 'Heading deleted successfully' });
  } catch (error) {
    console.error('Delete heading error:', error);
    res.status(500).json({ message: 'Failed to delete heading' });
  }
};

export const reorderHeadings = async (req, res) => {
  try {
    const { orders } = req.body;

    if (!Array.isArray(orders)) {
      return res.status(400).json({ message: 'Invalid orders format' });
    }

    // Validate the orders array
    const isValid = orders.every(item => 
      item && 
      typeof item === 'object' && 
      typeof item.id === 'string' && 
      typeof item.order === 'number' && 
      item.order >= 0
    );

    if (!isValid) {
      return res.status(400).json({ 
        message: 'Each order item must have an id (string) and order (non-negative number)' 
      });
    }

    // Create bulk update operations
    const operations = orders.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id, user: req.user._id },
        update: { $set: { order } },
        runValidators: true
      }
    }));

    const result = await Heading.bulkWrite(operations);

    if (result.modifiedCount !== orders.length) {
      return res.status(400).json({ 
        message: 'Some headings could not be updated. Please verify all IDs are valid.' 
      });
    }

    res.json({ message: 'Headings reordered successfully' });
  } catch (error) {
    console.error('Reorder headings error:', error);
    res.status(500).json({ message: 'Failed to reorder headings' });
  }
};