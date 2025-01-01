import WorkHour from '../models/WorkHour.model.js';
import mongoose from 'mongoose';

export const createWorkHour = async (req, res) => {
  try {
    const { startDate, endDate, startTime, endTime, heading, isComplete } = req.body;
    
    const workHour = await WorkHour.create({
      startDate,
      endDate,
      startTime,
      endTime,
      heading,
      isComplete,
      user: req.user._id
    });

    await workHour.populate('heading');
    res.status(201).json(workHour);
  } catch (error) {
    console.error('Create work hour error:', error);
    res.status(500).json({ message: 'Failed to create work hour' });
  }
};

export const getWorkHours = async (req, res) => {
  try {
    const workHours = await WorkHour.find({ user: req.user._id })
      .populate('heading')
      .sort({ startDate: -1 });
    res.json(workHours);
  } catch (error) {
    console.error('Get work hours error:', error);
    res.status(500).json({ message: 'Failed to fetch work hours' });
  }
};

export const updateWorkHour = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const workHour = await WorkHour.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updates,
      { new: true }
    ).populate('heading');

    if (!workHour) {
      return res.status(404).json({ message: 'Work hour not found' });
    }

    res.json(workHour);
  } catch (error) {
    console.error('Update work hour error:', error);
    res.status(500).json({ message: 'Failed to update work hour' });
  }
};

export const deleteWorkHour = async (req, res) => {
  try {
    const { id } = req.params;
    const workHour = await WorkHour.findOneAndDelete({ 
      _id: id, 
      user: req.user._id 
    });

    if (!workHour) {
      return res.status(404).json({ message: 'Work hour not found' });
    }

    res.json({ message: 'Work hour deleted successfully' });
  } catch (error) {
    console.error('Delete work hour error:', error);
    res.status(500).json({ message: 'Failed to delete work hour' });
  }
};

export const updateWorkHoursStatus = async (req, res) => {
  try {
    const { startDate, endDate, heading, isComplete } = req.body;
    
    const query = { user: req.user._id };
    if (startDate) query.startDate = { $gte: startDate };
    if (endDate) query.endDate = { $lte: endDate };
    if (heading) query.heading = heading;

    const result = await WorkHour.updateMany(
      query,
      { $set: { isComplete } }
    );

    res.json({ 
      message: 'Work hours updated successfully',
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Update work hours status error:', error);
    res.status(500).json({ message: 'Failed to update work hours status' });
  }
};