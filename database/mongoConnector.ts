import mongoose from 'mongoose';
import { CustomLogger } from '../utils/logger';
export class MongoConnector {
    private logger = new CustomLogger();

     connect = ()=>{
        mongoose
        .connect('mongodb+srv://blackberry:6NRlEX0xkOj0lXEa@vibewire.uze1ulu.mongodb.net/?retryWrites=true&w=majority&appName=vibewire')
        .then(() => {
            console.log('Connected to MongoDB');
        
        })
        .catch((error: any) => {
            console.log('MongoDB connection error:', error.message.toString());
        });
    

    }
}