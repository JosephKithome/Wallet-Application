import mongoose from 'mongoose';
export var dbConection = function () {
    mongoose
        .connect("".concat(process.env.MONGO_URI))
        .then(function () {
        console.log('Connected to MongoDB');
    })
        .catch(function (error) {
        console.error('MongoDB connection error:', error);
    });
};
