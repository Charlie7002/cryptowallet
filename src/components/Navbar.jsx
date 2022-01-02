import { useState } from 'react';
import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';

import logo from '../../images/logo5.svg';

const NavbarItem = ({ title, classProps }) => {
	return (
		<a
			href={
				title === 'Market'
					? 'https://cryptoapp-reactredux.netlify.app/'
					: title === 'Exchange'
					? 'https://cryptoapp-reactredux.netlify.app/exchanges'
					: title === 'Tutorials'
					? 'https://www.coinbase.com/fr/learn/crypto-basics'
					: ''
			}
			className={`mx-4 cursor-pointer p-3 ${classProps}`}
		>
			{title}
		</a>
	);
};

const Navbar = () => {
	const [toggleMenu, setToggleMenu] = useState(false);

	return (
		<nav className="w-full flex md:justify-center justify-between items-center p-4">
			<div className="md:flex-[0.5]   justify-center items-center">
				<img src={logo} alt="logo" className="w-48 cursor-pointer " />
			</div>
			<ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
				{['Market', 'Exchange', 'Tutorials', 'Wallets'].map(
					(item, index) => (
						<NavbarItem key={item + index} title={item} />
					),
				)}
				<li className="bg-[#4f04c9] py-2 px-7 mx-4 rounded-full cursor-pointer  transition ease-in-out delay-150   hover:bg-[#6c13fc] duration-300 ">
					Login
				</li>
			</ul>
			<div className="flex relative">
				{!toggleMenu && (
					<HiMenuAlt4
						fontSize={28}
						className="text-white md:hidden cursor-pointer"
						onClick={() => setToggleMenu(true)}
					/>
				)}
				{/* {toggleMenu && (
					<AiOutlineClose
						fontSize={28}
						className="text-white md:hidden cursor-pointer"
						onClick={() => setToggleMenu(false)}
					/>
				)} */}
				{toggleMenu && (
					<ul className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in">
						<li className="text-xl w-full my-2 ">
							<AiOutlineClose onClick={() => setToggleMenu(false)} />
						</li>
						{['Market', 'Exchange', 'Tutorials', 'Wallets'].map(
							(item, index) => (
								<NavbarItem
									key={item + index}
									title={item}
									classprops="my-2 text-lg"
								/>
							),
						)}
					</ul>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
