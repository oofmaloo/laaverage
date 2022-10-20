import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy, execute} = deployments;

  const {deployer} = await getNamedAccounts();

  const aavePoolAddress = "0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6"
  const aaveOracleAddress = "0x5bed0810073cc9f0DacF73C648202249E87eF6cB"
  const swapperAddress = (await deployments.get('Swapper')).address;

  await deploy('Laaverage', {
    from: deployer,
    args: [aaveOracleAddress, aavePoolAddress, swapperAddress],
    log: true,
  });

  // await execute('PoolAddressesProvider', { from: deployer }, 'setACLAdmin', deployer);


};
export default func;
