import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
// defalut 3000
const PORT = process.env.PORT;
const API_KEY = process.env.OPENWEATHER_KEY;

// Convert import.meta.url to __dirname due module type so we have to convert for path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__filename);
console.log(__dirname);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const formatDate = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${dayName}, ${monthName} ${day}, ${year}`;
};

// Sending / serve the HTML file
app.get("/", async (req, res) => {
    // default london
    const city = req.query.city || "london";
    const FetchURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
    
    try {
        const { data } = await axios.get(FetchURL);
        const currentDate = formatDate(new Date());
        res.render('index', { weatherData: data , currentDate: currentDate });
    } catch (error) {
        let errorMessage = 'Error fetching weather data';
        if (error.response) {
            errorMessage = error.response.data.message || 'Error while fetching weather data';
        } else if (error.request) {
            errorMessage = 'No response received from weather service';
        } else {
            errorMessage = 'Error setting up weather request';
        }
        const currentDate = formatDate(new Date());
        res.render('index', { weatherData: null, error: errorMessage , currentDate:currentDate});
    }
});

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}...`);
});
