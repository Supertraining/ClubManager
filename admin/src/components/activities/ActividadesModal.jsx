import PropTypes from 'prop-types'
const ActividadesModal = ({ categories }) => {

  return (
    <>
      <table
        className='modal-table table-responsive bg-transparent w-100'>

        <thead
          className='bg-success text-white text-center border border-success'>

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

          { categories?.map((category, i) => (

            <tr
              className='my-1 text-center text-dark border border-success'
              key={ i }>

              <td className='tableData fw-bold'>
                { category.name }
              </td>

              <td className='tableData'>
                { category.age_range }
              </td>

              <td className='tableData'>
                { category.days }
              </td>

              <td className='tableData'>
                { category.schedule }

              </td>

            </tr>
          )) }

        </tbody>

      </table>
    </>

  )
}

ActividadesModal.propTypes = {
  categories: PropTypes.array.isRequired
}

export default ActividadesModal

