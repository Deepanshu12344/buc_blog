import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';

dotenv.config();
const app = express();
app.use(cors());

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 8000;
mongoose.connect("mongodb://localhost:27017/buc_blog")
.then(()=>{
    app.listen(PORT, ()=>console.log(`Server Port: ${PORT}`));
}).catch((error=>console.log(error)));