import express from 'express';
import {
  createHeading,
  getHeadings,
  updateHeading,
  deleteHeading,
  reorderHeadings
} from '../controllers/headings.controller.js';

const router = express.Router();

router.post('/', createHeading);
router.get('/', getHeadings);
router.put('/:id', updateHeading);
router.delete('/:id', deleteHeading);
router.put('/reorder', reorderHeadings);

export default router;