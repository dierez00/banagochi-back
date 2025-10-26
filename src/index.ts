import dotenv from 'dotenv';
import app from './app';
import connectDB from './config/db';

dotenv.config();

const PORT = process.env.PORT;

connectDB().then(()=>{
  app.listen(PORT, () => {
            console.log('Connected to MongoDB');
            console.log(`Server running on port ${PORT}`);
        });
    })

