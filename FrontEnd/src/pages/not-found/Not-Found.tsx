import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../../components/ui/Cards";
import { Home, ArrowLeft, Code2, Terminal, Bug } from "lucide-react";

interface NotFoundProps {
  error?: string;
}

const NotFound: React.FC<NotFoundProps> = ({ error }) => {
  const location = useLocation();
  const [animateCode, setAnimateCode] = useState(false);

  const errr = error ? ` ${error} ` : "✗ Error: Route not found";

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );

    // Trigger code animation after component mounts
    const timer = setTimeout(() => setAnimateCode(true), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const codeLines = [
    "$ npm start",
    "Starting development server...",
    `✗ Error:"${errr}"`,
    `✗ Path: "${location.pathname}"`,
    "$ git checkout main",
    "✓ Switched to main branch",
    "$ npm run build",
    "✓ Build successful!",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Error Message */}
        <div className="text-center lg:text-left space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-blue-600">
              <Code2 size={32} />
              <span className="text-2xl font-bold">CodeApire</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                404
              </h1>
              <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800">
                Oops! Page Not Found
              </h2>
            </div>

            <p className="text-lg text-gray-600 max-w-md mx-auto lg:mx-0">
              Looks like this page got lost in the code! Don't worry, even the
              best developers encounter bugs. Let's get you back on track to
              master those tech skills.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-2 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex ">
              <Link
                to="/auth/signup"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-2 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 w-fit"
              >
                <Home size={20} />
                Back to Home
              </Link>
            </button>
            <button>
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>

          {/* Error Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">404</div>
              <div className="text-sm text-gray-500">Error Code</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">0ms</div>
              <div className="text-sm text-gray-500">Load Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">100%</div>
              <div className="text-sm text-gray-500">Not Found</div>
            </div>
          </div>
        </div>

        {/* Right side - Code Terminal Illustration */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md bg-gray-900 border-gray-700 shadow-2xl">
            <CardContent className="p-0">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 rounded-t-lg">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 text-center text-gray-400 text-sm font-mono">
                  Terminal - Error Debug
                </div>
              </div>

              {/* Terminal Content */}
              <div className="p-6 font-mono text-sm space-y-2 min-h-[300px]">
                {codeLines.map((line, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-500 ${
                      animateCode
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-4"
                    }`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    {line.startsWith("$") ? (
                      <div className="text-green-400">{line}</div>
                    ) : line.startsWith("✓") ? (
                      <div className="text-green-400">{line}</div>
                    ) : line.startsWith("✗") ? (
                      <div className="text-red-400">{line}</div>
                    ) : (
                      <div className="text-blue-400">{line}</div>
                    )}
                  </div>
                ))}

                <div
                  className={`flex items-center gap-2 pt-4 transition-all duration-500 ${
                    animateCode ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transitionDelay: "2000ms" }}
                >
                  <Terminal size={16} className="text-green-400" />
                  <span className="text-green-400">
                    Ready for next command...
                  </span>
                  <span className="animate-pulse text-green-400">|</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Elements */}
      <div
        className="fixed top-20 left-20 opacity-20 animate-bounce"
        style={{ animationDelay: "0s" }}
      >
        <Bug size={24} className="text-purple-600" />
      </div>
      <div
        className="fixed top-40 right-32 opacity-20 animate-bounce"
        style={{ animationDelay: "1s" }}
      >
        <Code2 size={32} className="text-blue-600" />
      </div>
      <div
        className="fixed bottom-32 left-32 opacity-20 animate-bounce"
        style={{ animationDelay: "2s" }}
      >
        <Terminal size={28} className="text-pink-600" />
      </div>
    </div>
  );
};

export default NotFound;
