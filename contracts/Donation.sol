// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract Donation {
    uint256 public donationCount = 0;

    struct DonationStruct {
        uint256 id;
        address donateur;
        uint256 montant;
        uint256 timestamp;
    }

    mapping(uint256 => DonationStruct) public donations;
    mapping(address => uint256[]) public donationsByDonateur;

    event DonationCreated(
        uint256 id,
        address indexed donateur,
        uint256 montant,
        uint256 timestamp
    );

    function createDonation() public payable {
        require(msg.value > 0, "Le montant doit être supérieur à 0");

        donationCount++;
        donations[donationCount] = DonationStruct(
            donationCount,
            msg.sender,
            msg.value,
            block.timestamp
        );
        donationsByDonateur[msg.sender].push(donationCount);

        emit DonationCreated(
            donationCount,
            msg.sender,
            msg.value,
            block.timestamp
        );
    }

    function getDonation(
        uint256 _id
    )
        public
        view
        returns (
            uint256 id,
            address donateur,
            uint256 montant,
            uint256 timestamp
        )
    {
        DonationStruct storage donation = donations[_id];
        return (
            donation.id,
            donation.donateur,
            donation.montant,
            donation.timestamp
        );
    }

    function getDonationsByDonateur(
        address _donateur
    ) public view returns (uint256[] memory) {
        return donationsByDonateur[_donateur];
    }
}
