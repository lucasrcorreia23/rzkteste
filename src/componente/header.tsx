// components/Header.js
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <div className="bg-brandfont text-white p-2">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center mx-auto space-x-4">
          <Link className="text-xl font-bold py-8" href="https://rzkdigital.com.br/" target="_blank">
            <Image src="logotipo.svg" width={200} height={0} alt="" />
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default Header;