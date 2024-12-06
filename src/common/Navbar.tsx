import ConnectWallet from "./ConnectWallet";
import FlexSeparator from "./FlexSeparator";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center p-4">
      {/* Logo and Title Section */}
      <div className="flex items-center text-3xl font-semibold gap-x-4">
        {/* <h1>Random Number Generator</h1> */}
      </div>
      <FlexSeparator />
    </nav>
  );
}
