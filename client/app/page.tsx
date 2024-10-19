import { Button } from "@/components/ui/button"; // Adjust path based on where your components are
import Link from "next/link";
import { useRouter } from "next/navigation";


const Home: React.FC = () => {

  return (
    <div className="w-full h-screen">
      {/* Background and gradient effects */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
      </div>

      {/* Buttons for login and signup */}
      <div className="flex justify-center items-center h-full space-x-4">
        <Link href="/Login">
          <Button variant="default">
            Login
          </Button>
        </Link>
        <Link href="/Signup"><Button variant="default" >
          Signup
        </Button></Link>

      </div>
    </div>
  );
};

export default Home;
