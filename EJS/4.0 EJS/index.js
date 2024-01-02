import express from "express";

const app = express();
const port = 3000;

const d = new Date();
const day = d.getDay();

app.get("/", (req, res) => {
    const d = new Date("May 8, 2024 10:30:00");
    const day = d.getDay();

    let type = "weekday";
    let adv = "it's time to work hard";

    if (day === 0 || day === 6) {
        type = "the weekend";
        adv = "it's time to relax";
    }

    res.render("index.ejs", 
    {dayType: type,
    advice: adv}
    );
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
