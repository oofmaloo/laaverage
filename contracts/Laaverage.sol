// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;
import {PercentageMath} from "./PercentageMath.sol";
import {ISwapper} from "./Swapper.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IAaveOracle} from "./IAaveOracle.sol";
import {IPool} from "./IPool.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Laaverage {
    using SafeERC20 for IERC20;
    using PercentageMath for uint256;

    IAaveOracle internal _oracle;
    IPool internal _pool;
    ISwapper internal _swapper;   
    address payable public owner;

    event LongPosition(uint256 amount);

    constructor(IAaveOracle oracle, IPool pool, ISwapper swapper) {
        _oracle = oracle;
        _pool = pool;
        _swapper = swapper;
        owner = payable(msg.sender);
    }

    function createLongPosition(
        address collateralAsset,
        uint256 collateralAmount,
        address positionAsset,
        uint256 positionValueRatio,
        uint256 leverage
    ) public {

        IERC20(collateralAsset).safeTransferFrom(msg.sender, address(this), collateralAmount);

        IERC20(collateralAsset).approve(address(_pool), type(uint256).max);
        IERC20(positionAsset).approve(address(_swapper), type(uint256).max);


        uint256 collateralPrice = _oracle.getAssetPrice(collateralAsset);
        uint256 collateralDecimals = IERC20Metadata(collateralAsset).decimals();
        uint256 positionPrice = _oracle.getAssetPrice(positionAsset);
        uint256 positionDecimals = IERC20Metadata(positionAsset).decimals();

        uint256 collateralValue = collateralAmount * collateralPrice / (10**collateralDecimals);
        uint256 positionAmount = collateralValue.percentMul(positionValueRatio) / positionPrice * (10**positionDecimals);


        for (uint256 i = 0; i < leverage; i++) {
            if (i > 0) {
                // get new value after swap
                collateralAmount = IERC20(collateralAsset).balanceOf(address(this));
                collateralValue = collateralAmount * collateralPrice / (10**collateralDecimals);
                positionAmount = collateralValue.percentMul(positionValueRatio) / positionPrice * (10**positionDecimals);
            }
            _pool.supply(
                collateralAsset,
                collateralAmount,
                address(this),
                0
            );

            _pool.borrow(
                positionAsset,
                positionAmount,
                2,
                0,
                address(this)
            );

            // swap
            _swapper.swapExactInputSingle(positionAsset, collateralAsset, IERC20(positionAsset).balanceOf(address(this)));
        }

        collateralAmount = IERC20(collateralAsset).balanceOf(address(this));
        _pool.supply(
            collateralAsset,
            collateralAmount,
            address(this),
            0
        );
        IERC20(collateralAsset).approve(address(_pool), 0);
        IERC20(positionAsset).approve(address(_swapper), 0);

        // emit LongPosition(collateralAmount);
    }
}
