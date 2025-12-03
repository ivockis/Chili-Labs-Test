import Image from 'next/image';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
                <header className="bg-gray-800 shadow-md">
                  <div className="container mx-auto px-4 py-2 flex items-center justify-between">
                    {/* Left: Logo */}
                    <div className="flex-none">
                      <Link href="/">
                        <Image
                          src="/chili.png" // 'chili.png' is in the 'public' folder
                          alt="ShopIvo Logo"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </Link>
                    </div>
            
                    {/* Center: ShopIvo Text */}
                    <div className="flex-grow text-center">
                      <span className="text-2xl font-bold text-white">ShopIvo</span>
                    </div>
            
                    {/* Right: Placeholder to balance the space, same width as logo (40px) */}
                    <div className="flex-none w-[40px]"></div>
                  </div>
                </header>  );
};

export default Header;
