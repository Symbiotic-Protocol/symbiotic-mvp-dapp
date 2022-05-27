const addresses = require("../addresses.json");

module.exports = async ({ getNamedAccounts, deployments, network }) => {
  console.log(deployments, network)
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  let celoDollarAddress;
  if (network.name === 'alfajores') {
    celoDollarAddress = addresses.alfajoresCeloDollarAddress
  } else {
    celoDollarAddress = addresses.mainnetCeloDollarAddress
  }
  await deploy("SymbioticProtocol", {
    from: deployer,
    args: [celoDollarAddress],
    log: true,
  });
};

module.exports.tags = ["SymbioticProtocol"];
