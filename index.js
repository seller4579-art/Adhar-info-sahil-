const express = require("express");
const app = express();

const UPSTREAM = "https://sahilxher.madewith.me/api/aadhr";
const KEY = process.env.UPSTREAM_KEY || "FIGHTER";

async function forward(input, res) {
  try {
    const r = await fetch(
      `${UPSTREAM}?key=${KEY}&q=${encodeURIComponent(input ?? "")}`
    );
    const text = await r.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(r.status).send(text);
    }

    data.developer = "@Boss_Hcrr";
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: "upstream failed" });
  }
}

app.get("/", (req, res) => {
  res.json({ status: "ok", usage: "/api/aadhr?q=anything" });
});

app.get("/api/ip", (req, res) => forward(req.query.q, res));
app.get("/api/ip/:input", (req, res) => forward(req.params.input, res));

module.exports = app;
