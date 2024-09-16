const Address = require("../models/useraddress");
const User = require("../models/user");
const { validationResult } = require("express-validator");

const validatethaiPhoneNumber = (phoneNumber) => {
    const regex = /^(?:\+66|0)[1-9][0-9]{8}$/
    return regex.test(phoneNumber);
}

exports.createAddress = async (req, res) => {

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const loggedInUserId = req.user.id;

    const { recipientName, postalAddress, houseNumber, contactNumber } =
      req.body;

    if (!validatethaiPhoneNumber(contactNumber)) {
      return res
       .status(400)
       .json({ message: "Invalid Thai phone number format" });
    }

    const user = await User.findByPk(loggedInUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addressCount = await Address.count({
      where: { userId: loggedInUserId },
    });
    if (addressCount >= 5) {
      return res
        .status(400)
        .json({ message: "User can only have a maximum of 5 addresses" });
    }

    const address = await Address.create({
      userId: loggedInUserId,
      recipientName,
      postalAddress,
      houseNumber,
      contactNumber,
    });
    res.status(201).json({ message: "Address created successfully", address });
  } catch (error) {
    console.error("Error while creating address:", error);
    res.status(500).json({ message: "Server error while creating address" });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const { addressId } = req.params;

    const address = await Address.findOne({
      where: { id: addressId, userId: loggedInUserId },
    });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    await address.destroy();
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error while deleting address:", error);
    res.status(500).json({ message: "Server error while deleting address" });
  }
};

exports.FavoriteAddress = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const { addressId } = req.params;

        const address = await Address.findOne({
            where: { id: addressId, userId: loggedInUserId },
        });

        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }
        
        if(!validatethaiPhoneNumber(address.contactNumber)) {
            return res.status(400).json({message: "Invalid Thai phone number format" });
        }
    
        await Address.update(
            { Favorite: false},
            {where: {userId: loggedInUserId}}
        )

        await address.update({ Favorite: true})
        res.status(200).json({ message: "Address marked as favorite successfully" , address });
    } catch (error) {
        console.error("Error while marking address as favorite:", error);
        res.status(500).json({ message: "Server error while marking address as favorite" });
    }
}
