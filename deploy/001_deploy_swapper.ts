import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy, execute} = deployments;

  const {deployer} = await getNamedAccounts();

  await deploy('Swapper', {
    from: deployer,
    args: ["0xE592427A0AEce92De3Edee1F18E0157C05861564"],
    log: true,
  });

};
export default func;
