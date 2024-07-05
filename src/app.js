document.addEventListener('DOMContentLoaded', () => {
  
  if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable();  
  } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
  } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      return;
  }

  
  const contractABI =[
      {
        "constant": true,
        "inputs": [],
        "name": "donationCount",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x2abfab4d"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          },
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "donationsByDonateur",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x51c7f7d6"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "donations",
        "outputs": [
          {
            "name": "id",
            "type": "uint256"
          },
          {
            "name": "donateur",
            "type": "address"
          },
          {
            "name": "montant",
            "type": "uint256"
          },
          {
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xf8626af8"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": true,
            "name": "donateur",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "montant",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "name": "DonationCreated",
        "type": "event",
        "signature": "0x6389d52932f001f805bda3695335e2ce2064320790f711cffd61bf0805131ce7"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "createDonation",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function",
        "signature": "0x08196a9e"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "getDonation",
        "outputs": [
          {
            "name": "id",
            "type": "uint256"
          },
          {
            "name": "donateur",
            "type": "address"
          },
          {
            "name": "montant",
            "type": "uint256"
          },
          {
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xef07a81f"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_donateur",
            "type": "address"
          }
        ],
        "name": "getDonationsByDonateur",
        "outputs": [
          {
            "name": "",
            "type": "uint256[]"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x88c656ab"
      }
    ];

  // Adresse du contrat déployé
  const contractAddress = '0x5877de16B380e889D6e4BDeaBc756105c16c874e';
  const donationContract = new web3.eth.Contract(contractABI, contractAddress);

  // Récupération des éléments du DOM
  const donationForm = document.getElementById('donationForm');
  const amountInput = document.getElementById('amount');
  const messageDiv = document.getElementById('message');
  const donationList = document.getElementById('donationList');

  // Ajout d'un écouteur d'événements pour le formulaire de donation
  donationForm.addEventListener('submit', async (event) => {
      event.preventDefault();  // Empêche le comportement par défaut du formulaire
      const amount = amountInput.value;
      const accounts = await web3.eth.getAccounts();  // Récupère les comptes disponibles

      try {
          // Appel de la fonction createDonation du contrat intelligent
          await donationContract.methods.createDonation().send({ from: accounts[0], value: amount });
          displayMessage(`Donation de ${amount} Wei effectuée avec succès`, 'success');
          amountInput.value = '';
          loadDonations();  // Recharge la liste des donations
      } catch (error) {
          displayMessage(`Erreur: ${error.message}`, 'error');
      }
  });

  // Fonction pour charger les donations
  async function loadDonations() {
      const donationCount = await donationContract.methods.nextId().call();  // Récupère le nombre de donations
      donationList.innerHTML = '';

      for (let i = 0; i < donationCount; i++) {
          const donation = await donationContract.methods.donations(i).call();
          const row = document.createElement('tr');
          row.innerHTML = `<td>${donation.donateur}</td><td>${donation.montant}</td><td>${new Date(donation.timestamp * 1000).toLocaleString()}</td>`;
          donationList.appendChild(row);
      }
  }

  // Fonction pour afficher un message à l'utilisateur
  function displayMessage(message, type) {
      messageDiv.innerText = message;
      messageDiv.className = type === 'success' ? 'success' : 'error';
      messageDiv.classList.remove('hidden');
      setTimeout(() => {
          messageDiv.classList.add('hidden');
      }, 5000);
  }

  // Charger les donations au chargement de la page
  loadDonations();
});