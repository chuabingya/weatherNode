import React, { useState, useEffect } from "react";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Features } from "./components/features";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Gallery } from "./components/gallery";
import { Team } from "./components/Team";
import { Contact } from "./components/contact";
import Weather from "./components/weather";
import WeaSea from "./components/weaSea";
import WeaHis from "./components/weaHis";
import FetchWeather from "./components/fetchWeather";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
  offset: function (anchor, toggle) {
    // Ensure the section lands at the top of the viewport
    return 0;  // No offset, scrolls to the top of the section
  },
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    //set landing page JSON file
    setLandingPageData(JsonData);

    // Set the document title
    document.title = "WeatherNodes Initiative";
  }, []);

  return (
    <div>
      <Navigation />
      <Header data={landingPageData.Header} />
      <Weather data={landingPageData.Weather}/>
      <WeaSea data={landingPageData.WeaSea}/>
      <WeaHis data={landingPageData.WeaHis}/>
      <Features data={landingPageData.Features} />
      <Services data={landingPageData.Services} />
      <About data={landingPageData.About} />
      <Gallery data={landingPageData.Gallery} />
      <Team data={landingPageData.Team} />
      <Contact data={landingPageData.Contact} />
      <FetchWeather data={landingPageData.FetchWeather} />
    </div>
  );
};

export default App;
