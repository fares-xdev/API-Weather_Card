import "./App.css";

// MATERIAL UI COMPONENTS
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";

// AXIOS
import axios from "axios";
import { useEffect, useState } from "react";

// DAYJS DATE & TIME
import dayjs from "dayjs";
import "dayjs/locale/ar";
import "dayjs/locale/en";

// I18NEXT
import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();

  const [dateTime, setDateTime] = useState("");
  const [direction, setDirection] = useState("rtl");

  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: null,
  });

  // Convert temperature from Kelvin to Celsius
  const toCelsius = (k) => Math.round(k - 273.15);

  // Update date and time every second
  useEffect(() => {
    const updateDateTime = () => {
      dayjs.locale(i18n.language === "ar" ? "ar" : "en");
      setDateTime(dayjs().format("dddd، D MMMM YYYY - h:mm:ss A"));
    };

    updateDateTime(); // Initial run
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval); // Cleanup
  }, [i18n.language]);

  // Handle language switch and card direction
  const handleLanguageClick = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    setDirection(newLang === "ar" ? "rtl" : "ltr");
  };

  // Fetch weather data on component mount
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=30.03&lon=31.23&appid=${apiKey}`
      )
      .then((res) => {
        const data = res.data;
        setTemp({
          number: toCelsius(data.main.temp),
          min: toCelsius(data.main.temp_min),
          max: toCelsius(data.main.temp_max),
          description: data.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
        });
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div dir="rtl" className="App">
      <Container
        maxWidth="sm"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        {/* Weather card */}
        <div
          dir={direction}
          style={{
            background: "rgb(28 52 91 / 36%)",
            padding: "10px",
            borderRadius: "10px",
            boxShadow: "0px 11px 1px rgba(0,0,0,0.05)",
            width: "100%",
          }}
        >
          {/* Location and time */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
            }}
          >
            <Typography
              variant="h2"
              style={{
                margin: "0 30px",
                fontWeight: "600",
              }}
            >
              {i18n.language === "ar" ? "مصر" : "Egypt"}
            </Typography>
            <Typography variant="h5">{dateTime}</Typography>
          </div>

          <hr />

          {/* Weather details */}
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h1">{temp.number}</Typography>
                <img src={temp.icon} alt="icon" />
              </div>

              <Typography variant="h6">
                {t(`weather.${temp.description}`, {
                  defaultValue: temp.description,
                })}
              </Typography>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h5>
                  {i18n.language === "ar" ? "الصغرى" : "Min"}: {temp.min}
                </h5>
                <h5 style={{ margin: "0px 5px" }}>|</h5>
                <h5>
                  {i18n.language === "ar" ? "الكبرى" : "Max"}: {temp.max}
                </h5>
              </div>
            </div>

            <CloudIcon sx={{ fontSize: 200 }} />
          </div>
        </div>

        {/* Language switch button */}
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            width: "100%",
            marginTop: "20px",
          }}
        >
          <Button
            style={{ color: "white" }}
            variant="text"
            onClick={handleLanguageClick}
          >
            {i18n.language === "ar" ? "English" : "عربي"}
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default App;
