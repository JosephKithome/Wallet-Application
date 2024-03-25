import mongoose from 'mongoose';
export const dbConection = ()=>{
    mongoose
    .connect(`${process.env.MONGO_URI}`)
    .then(() => {
        console.log('Connected to MongoDB');
    
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });
}