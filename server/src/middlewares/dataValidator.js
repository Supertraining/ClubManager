import { body, param, validationResult } from 'express-validator';

/** 'HH:mm' -> minutes from midnight. NaN when malformed. */
const toMinutes = (hhmm) => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm || ''));
  if (!m) return NaN;
  return Number(m[1]) * 60 + Number(m[2]);
};

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validate = {

  userReservation: [

    body('court').exists().notEmpty(),
    body('weekday').exists().notEmpty(),
    body('date').exists().notEmpty(),
    body('initialTime').exists().notEmpty(),
    body('finalTime').exists().notEmpty(),
    body('id').exists().notEmpty(),
    body('permanent').exists().notEmpty(),

    handleValidationErrors
  ],

  courtReservation: [

    body('name').exists().notEmpty(),
    body('selectedDates.date').exists().notEmpty(),
    body('selectedDates.initialTime').exists().notEmpty(),
    body('selectedDates.finalTime').exists().notEmpty(),
    body('for').exists().notEmpty().optional(),
    body('selectedDates.permanent').exists().notEmpty(),

    // A booking is between 1 and 2 hours, in half-hour steps. The client
    // offers the same three options, but it is a UI, not a guarantee: without
    // this a crafted request could book a court for 5 seconds and still pass
    // the EXCLUDE constraint, since that only stops overlaps.
    body('selectedDates.initialTime').custom((value, { req }) => {
      const start = toMinutes(value);
      const end = toMinutes(req.body?.selectedDates?.finalTime);
      if ([start, end].some(Number.isNaN)) throw new Error();
      const duration = end - start;
      if (duration < 60) throw new Error('La reserva dura menos de 1 hora.');
      if (duration > 120) throw new Error('La reserva dura más de 2 horas.');
      if (duration % 30 !== 0) throw new Error('La duración tiene que ser múltiplo de 30 minutos.');
      return true;
    }),

    handleValidationErrors
  ],

  user: [
    body('username').exists().trim().notEmpty().isEmail().normalizeEmail()
      .custom(value => {
        if (value.includes('.com.com')) {
          throw new Error()
        }
        return true;
      }),
    body('password').exists().trim().notEmpty().isStrongPassword({minLength: 8, minUppercase: 1, minNumbers: 1}),
    body('nombre').exists().trim().notEmpty(),
    body('apellido').exists().trim().notEmpty(),
    body('edad').exists().trim().notEmpty(),
    body('telefono').exists().trim().notEmpty(),

    handleValidationErrors
  ],

  userUpdate: [
    param('id').exists().trim().notEmpty(),
    body('username').exists().trim().notEmpty().isEmail().normalizeEmail().optional().optional()
      .custom(value => {
        if (value.includes('.com.com')) {
          throw new Error()
        }
        return true;
      }),
    body('password').exists().trim().notEmpty().isStrongPassword({minLength: 8, minUppercase: 1, minNumbers: 1}).optional(),
    body('nombre').exists().trim().notEmpty().optional(),
    body('apellido').exists().trim().notEmpty().optional(),
    body('edad').exists().trim().notEmpty().optional(),
    body('telefono').exists().trim().notEmpty().optional(),

    handleValidationErrors
  ],

  userUpdatePassword: [
    body('password').exists().trim().notEmpty()
  ],

  activityId: [
    //Esta expresión regular /^[0-9a-fA-F]{24}$/ asegura que el ID cumpla con los requisitos de "una cadena de 24 caracteres hexadecimales"
    param('id').exists().trim().notEmpty().matches(/^[0-9a-fA-F]{24}$/),

    handleValidationErrors
  ],

  activity: [
    body('img').exists().trim().notEmpty(),
    body('imgText').exists().trim().notEmpty(),
    body('activity').exists().trim().notEmpty(),
    body('description').exists().trim().notEmpty(),
    body('category.*.name').exists().trim().notEmpty(),
    body('category.*.age_range').exists().trim().notEmpty(),
    body('category.*.days').exists().trim().notEmpty(),
    body('category.*.schedule').exists().trim().notEmpty(),
  ],
  
  activityUpdate: [
    body('img').exists().trim().notEmpty().optional(),
    body('imgText').exists().trim().notEmpty().optional(),
    body('activity').exists().trim().notEmpty().optional(),
    body('description').exists().trim().notEmpty().optional(),
    body('category.*.name').exists().trim().notEmpty().optional(),
    body('category.*.age_range').exists().trim().notEmpty().optional(),
    body('category.*.days').exists().trim().notEmpty().optional(),
    body('category.*.schedule').exists().trim().notEmpty().optional(),
  ],

}