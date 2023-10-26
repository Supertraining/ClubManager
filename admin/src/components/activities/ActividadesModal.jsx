import PropTypes from 'prop-types'
const ActividadesModal = ({ categories }) => {

  return (
    <>
      { categories?.map((category) => (
        <div key={ category.name } className="d-flex flex-column align-items-center">

          <h6 className='fs-5 text-decoration-underline'>
            { category.days }
          </h6>

          <ul>
            <li>
              <b>{ category.name }: </b>
              <i className='text-success'>
                { category.schedule }
              </i>
            </li>
          </ul>

        </div>
      )) }
    </>

  )
}

ActividadesModal.propTypes = {
  categories: PropTypes.array.isRequired
}

export default ActividadesModal

