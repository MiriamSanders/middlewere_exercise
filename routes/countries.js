const express = require("express");
const { auth } = require("../middlewares/auth");
const { CountryModel, validateCountry } = require("../models/countryModel")
const router = express.Router();


router.get("/", async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 4;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  try {
    let data = await CountryModel
      .find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }

})

router.post("/", auth, async (req, res) => {
  let valdiateBody = validateCountry(req.body);
  if (valdiateBody.error) {
    return res.status(400).json(valdiateBody.error.details)
  }
  try {
    let country = new CountryModel(req.body);
    country.user_id = req.tokenData._id;
    await country.save();
    res.status(201).json(country)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

router.put("/:idEdit", auth, async (req, res) => {
  try {
    let idEdit = req.params.idEdit;

    let data = await CountryModel.updateOne(
      { _id: idEdit, user_id: req.tokenData._id },
    );

    if (data.modifiedCount === 0) {
      return res.status(403).json({ msg: "You don't have permission to edit this record" });
    }

    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.delete("/:idDel", auth, async (req, res) => {
  try {
    let idDel = req.params.idDel;

    let data = await CountryModel.deleteOne(
      { _id: idDel, user_id: req.tokenData._id }
    );

    if (data.deletedCount === 0) {
      return res.status(403).json({ msg: "You don't have permission to delete this record" });
    }

    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

module.exports = router;