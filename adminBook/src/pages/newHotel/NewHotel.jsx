import './newHotel.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import { useState } from 'react';
import { hotelInputs } from '../../formSource';
import useFetch from '../../hooks/useFetch';
import axios from 'axios';

const NewHotel = () => {
	const [files, setFiles] = useState('');
	const [info, setInfo] = useState({});
	const [rooms, setRooms] = useState([]);

	const handleChange = (e) => {
		setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
	};

	//traigo todos los rooms para poder elegir luego en el select de rooms que roomsId le voy a agregar al hotel
	const { data, loading, error } = useFetch('/rooms');

	const handleSelect = (e) => {
		//si miramos la consola nos devuelve un HTMLCollection
		console.log(e.target.selectedOptions);
		// lo convertimos en un array solo de el value(room._id) y no de todo lo que contiene la HTMLCollection
		const value = Array.from(e.target.selectedOptions, (option) => option.value);
		setRooms(value);
	};

	const handleClick = async (e) => {
		e.preventDefault();
		try {
			//como voy a recibir un array uso promise.all
			const list = await Promise.all(
        //files es un objeto, para transformarlo en un array uso Object.values(files)
				Object.values(files).map(async (file) => {
					const data = new FormData();
					data.append('file', file);
					data.append('upload_preset', 'upload');
					const uploadRes = await axios.post(
						'https://api.cloudinary.com/v1_1/marangadev/image/upload',
						data
					);
					const { url } = uploadRes.data;
					return url;
				})
			);

			const newHotel = {
				...info,
				rooms,
				photos: list,
			};

      axios.post('/hotels', newHotel)
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='new'>
			<Sidebar />
			<div className='newContainer'>
				<Navbar />
				<div className='top'>
					<h1>Add new hotel</h1>
				</div>
				<div className='bottom'>
					<div className='left'>
						<img
							src={
								files
									? URL.createObjectURL(files[0])
									: 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'
							}
							alt=''
						/>
					</div>
					<div className='right'>
						<form>
							<div className='formInput'>
								<label htmlFor='file'>
									Image: <DriveFolderUploadOutlinedIcon className='icon' />
								</label>
								<input
									type='file'
									id='file'
									multiple
									onChange={(e) => setFiles(e.target.files)}
									style={{ display: 'none' }}
								/>
							</div>

							{hotelInputs.map((input) => (
								<div
									className='formInput'
									key={input.id}>
									<label>{input.label}</label>
									<input
										id={input.id}
										onChange={handleChange}
										type={input.type}
										placeholder={input.placeholder}
									/>
								</div>
							))}
							<div className='formInput'>
								<label>Featured</label>
								<select
									id='featured'
									onChange={handleChange}>
									<option value={false}>No</option>
									<option value={true}>yes</option>
								</select>
							</div>
							<div className='selectRooms'>
								<label>Rooms</label>
								<select
									id='rooms'
									multiple
									onChange={handleSelect}>
									{loading
										? 'Loading'
										: data &&
										  data.map((room) => (
												<option
													key={room._id}
													value={room._id}>
													{room.title}
												</option>
										  ))}
								</select>
							</div>
							<button onClick={handleClick}>Send</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewHotel;
