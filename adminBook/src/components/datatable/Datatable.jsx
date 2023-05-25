import './datatable.scss';
import { DataGrid } from '@mui/x-data-grid';
import { userColumns, userRows } from '../../datatablesource';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { useEffect } from 'react';
import axios from 'axios';

const Datatable = ({ columns }) => {
	//en el fetch usamos un path dinamico ya que depende de lo que seleccione en el dashboard es la data que me tenga que traer para renderizar, users, hoteles, etc en la misma tabla
	const location = useLocation();
	const path = location.pathname.split('/')[1];
	const { data, loading, error } = useFetch(`/${path}`);
		console.log(data);
	//no podemos hacerle un filter directamente a data, asi que lo metemos en un estado y despues en handle delte lo filtamos para borrar.
	const [list, setList] = useState([]);

	useEffect(() => {
		setList(data);
	}, [data]);

	const handleDelete = async (id) => {
		try {
			//delete from mongoDB
			await axios.delete(`/${path}/${id}`);
			//delete from list
			setList(list.filter((item) => item._id !== id));
		} catch (error) {}
	};

	const actionColumn = [
		{
			field: 'action',
			headerName: 'Action',
			width: 200,
			renderCell: (params) => {
				return (
					<div className='cellAction'>
						<Link
							to='/users/test'
							style={{ textDecoration: 'none' }}>
							<div className='viewButton'>View</div>
						</Link>
						<div
							className='deleteButton'
							onClick={() => handleDelete(params.row._id)}>
							Delete
						</div>
					</div>
				);
			},
		},
	];
	return (
		<div className='datatable'>
			<div className='datatableTitle'>
				{path}
				<Link
					to={`/${path}/new`}
					className='link'>
					Add New
				</Link>
			</div>
			{list && 
			<DataGrid
				className='datagrid'
				rows={list}
				columns={columns.concat(actionColumn)}
				pageSize={9}
				rowsPerPageOptions={[9]}
				checkboxSelection
				getRowId={(row) => row._id}
			/>}
		</div>
	);
};

export default Datatable;
