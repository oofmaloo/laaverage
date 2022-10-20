// npx hardhat run scripts/long-position.ts --network buidlerevm_docker
// npx hardhat run scripts/long-position.ts --network localhost

import {deployments, ethers, getNamedAccounts, getChainId} from 'hardhat';
const {parseUnits} = ethers.utils;
const {deploy, get, getArtifact, save, run} = deployments;

async function main() {
  const {deploy, execute, read} = deployments;

  const {deployer} = await getNamedAccounts();
  const chainId = await getChainId()
  const chainIdKey = parseInt(chainId)

  const impersonatedSignerAddress = "0xF12167D4025B1F5c3C1bB6734e4Ea20A85497F4D"
  const impersonatedSigner = await ethers.getImpersonatedSigner(impersonatedSignerAddress);

  const daiAddress = "0xdf1742fe5b0bfc12331d8eaec6b478dfdbd31464";
  const daiAmount = "1000000000000000000"

  const usdcAddress = "0xa2025b15a1757311bfd68cb14eaefcc237af5b43";
  const usdcAmount = "1000000000"


  const linkAddress = "0x07c725d58437504ca5f814ae406e70e21c5e8e9e";


  const laaverageAddress = (await deployments.get('Laaverage')).address;

  const mintableERC20 = await ethers.getContractFactory("MintableERC20");
  const _underlyingErc20 = await mintableERC20.attach(usdcAddress);
  await _underlyingErc20.connect(impersonatedSigner).approve(laaverageAddress, usdcAmount);

  const balance = await _underlyingErc20.balanceOf(impersonatedSignerAddress);

  console.log("balance", balance);

  const LaaverageContract = await ethers.getContractAt('Laaverage', laaverageAddress);

  let tx = await LaaverageContract.connect(impersonatedSigner).createLongPosition(
    usdcAddress, // collateralAsset
    usdcAmount, // collateralAmount,
    linkAddress, // positionAsset,
    "6000", // positionValueRatio,
    "2", // leverage
  );

  // await execute('Laaverage', { from: deployer }, 'createLongPosition', 
  //     daiAddress, // collateralAsset
  //     daiAmount, // collateralAmount,
  //     linkAddress, // positionAsset,
  //     "6000", // positionValueRatio,
  //     "2", // leverage
  // );

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
