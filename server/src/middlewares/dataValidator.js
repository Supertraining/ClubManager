import { body, param, validationResult } from 'express-validator';

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
    body('selectedDates.weekday').exists().notEmpty(),
    body('selectedDates.date').exists().notEmpty(),
    body('selectedDates.initialTime').exists().notEmpty(),
    body('selectedDates.finalTime').exists().notEmpty(),
    body('selectedDates.id').exists().notEmpty(),
    body('for').exists().notEmpty().optional(),
    body('selectedDates.permanent').exists().notEmpty(),

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