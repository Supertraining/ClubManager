import * as model from '../models/court.js';


let instance = null;
export default class CourtsDAO {

    save = async (court) => {

        try {

            let data = await model
                .usermodel
                .create(court);

            return data;

        } catch (err) {

            console.log(err);

        }

    }

    getAll = async () => {

        try {

            let data = await model
                .usermodel
                .find();

            return data;

        } catch (err) {

            console.log(err);

        }
    }

    getUnavailableDatesByName = async (name) => {

        try {

            let data = await model
                .usermodel
                .findOne(
                    {
                        name: name
                    }
                );

            let unavailableDates = data.get('unavailableDates')
                 
            return unavailableDates;

        } catch (err) {

            console.log(err);

        }

    }

    
    reserveDate = async (reserve) => {
        
        try {

            let data = await model
            .usermodel
            .updateOne(
                {
                    name: reserve.name
                },
                {
                        $push:
                        {
                            [`unavailableDates.${reserve.day}`]: reserve.selectedDates
                        }
                    }
                    );
                    
                    return data;
                    
                } catch (err) {
                    console.log(err);
                }
            }
            
            deleteById = async (id) => {
        
                try {
        
                    let data = await model
                        .usermodel
                        .findByIdAndDelete(id);
        
                    return data;
        
                } catch (err) {
        
                    console.log(err);
        
                }
        
            }
        
            updateById = async (id, newData) => {
                try {
        
                    let data = await model
                        .usermodel
                        .findByIdAndUpdate(id, newData);
        
                    return data;
        
                } catch (err) {
        
                    console.log(err);
        
                }
    }
    
}
        


