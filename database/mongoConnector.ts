import mongoose from 'mongoose';
export const dbConection = ()=>{
    mongoose
    .connect('mongodb+srv://blackberry:6NRlEX0xkOj0lXEa@vibewire.uze1ulu.mongodb.net/?retryWrites=true&w=majority&appName=vibewire')
    .then(() => {
        console.log('Connected to MongoDB');
    
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });
}