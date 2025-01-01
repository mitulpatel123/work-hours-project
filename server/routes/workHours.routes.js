import express from 'express';
import {
  createWorkHour,
  getWorkHours,
  updateWorkHour,
  deleteWorkHour,
  updateWorkHoursStatus
} from '../controllers/workHours.controller.js';

const router = express.Router();

router.post('/', createWorkHour);
router.get('/', getWorkHours);
router.put('/:id', updateWorkHour);
router.delete('/:id', deleteWorkHour);
router.put('/status/batch', updateWorkHoursStatus);

export default router;