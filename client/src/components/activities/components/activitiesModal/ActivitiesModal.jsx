import { useId } from 'react';
import PropTypes from 'prop-types';

const ActivitiesModal = ({ category }) => {
  return (
    <>
      <table className='table table-responsive bg-transparent w-100'>
        <thead className='bg-success text-white text-center border border-success'>
          <tr>
            <th
              scope='col'
              className='text-center fw-light p-0'>
              Categoría
            </th>
            <th
              scope='col'
              className='text-center fw-light p-0'>
              Edad
            </th>
            <th
              scope='col'
              className='text-center fw-light p-0'>
              Días
            </th>
            <th
              scope='col'
              className='text-center fw-light p-0'>
              Horario
            </th>
          </tr>
        </thead>

        <tbody>
          {category?.map((category) => (
            <tr
              className='my-1 text-center text-dark border border-success'
              key={useId()}>
              <td className='tableData fw-bold'>{category.name}</td>

              <td className='tableData'>{category.age_range}</td>

              <td className='tableData'>{category.days}</td>

              <td className='tableData'>{category.schedule}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

ActivitiesModal.propTypes = {
  category: PropTypes.array,
};

export default ActivitiesModal;
