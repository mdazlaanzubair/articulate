import { Outlet } from "react-router";
import { Footer } from "./components/custom/Footer";
import { Header } from "./components/custom/Header";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <main className="m-0 p-0 max-w-[500px] w-[400px] h-auto flex flex-col items-center justify-center border rounded-lg shadow-sm">
      <Header />
      <div className="container w-full h-auto p-5">
        <Outlet />
      </div>
      <Footer />
      <Toaster closeButton={true} position="bottom-right" />
    </main>
  );
}

export default App;
