import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blog.js';

dotenv.config();
const PORT = process.env.PORT || 5000
const app = express();
app.use(cors());

app.use("/auth", authRoutes);
app.use("/blog", blogRoutes);

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    app.listen(PORT, ()=>console.log(`Server Port: ${PORT}`));
}).catch((error=>console.log(error)));