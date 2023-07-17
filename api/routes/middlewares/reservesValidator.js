import { body, validationResult } from 'express-validator';

// Validation middleware for the first object
export const validateUserReservation = [

  body('court').exists().notEmpty(),
  body('weekday').exists().notEmpty(),
  body('date').exists().notEmpty(),
  body('initialTime').exists().notEmpty(),
  body('finalTime').exists().notEmpty(),
  body('id').exists().notEmpty(),
  body('permanent').exists().notEmpty(),

  (req, res, next) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();

  },
];


export const validateCourtReservation = [
  
  body('name').exists().notEmpty(),
  body('selectedDates.weekday').exists().notEmpty(),
  body('selectedDates.date').exists().notEmpty(),
  body('selectedDates.initialTime').exists().notEmpty(),
  body('selectedDates.finalTime').exists().notEmpty(),
  body('selectedDates.id').exists().notEmpty(),
  body('selectedDates.permanent').exists().notEmpty(),

  (req, res, next) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();

  },
];
