const express = require("express");
const router = express.Router();
const WayMarkedTrailsAdapter = require("../adapters/wayMarkedTrails/wayMarkedTrails.js");


router.get("/fromEpsg4326toEpsg3857", async (req, res) => {
    WayMarkedTrailsAdapter.fromEpsg4326toEpsg3857(req, res);
});

router.get("/fromEpsg3857toEpsg4326", async (req, res) => {
    WayMarkedTrailsAdapter.fromEpsg3857toEpsg4326(req, res);
});

router.get("/trailsByClick", async (req, res) => {
    WayMarkedTrailsAdapter.getTrailsByClick(req, res);
});

router.get("/trailById", async (req, res) => {
    WayMarkedTrailsAdapter.getTrailById(req, res);
});

router.get("/trailElevation", async (req, res) => {
    WayMarkedTrailsAdapter.getTrailElevation(req, res);
});

router.get("/highlightTrail", async (req, res) => {
    WayMarkedTrailsAdapter.getHighlightTrail(req, res);
});

module.exports = router;  // Esporta un'istanza del service