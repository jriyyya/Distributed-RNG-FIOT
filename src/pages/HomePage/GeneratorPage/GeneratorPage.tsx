import React, { useState, useEffect } from "react";

export default function GeneratorPage() {
  const [randomNumber, setRandomNumber] = useState<number>(0);
  const [backlog, setBacklog] = useState<string>("");

  const GEN_LEN = 26;
  const BACKLOG_CENTER = 5.62 * 24 * 60 * 60 * 1000;
  const BACKLOG_DEVIATION = 0.33 * 60 * 60 * 1000;

  // Simulate backlog value update
  useEffect(() => {
    const updateBacklog = () => {
      const deviation =
        -BACKLOG_DEVIATION + 2 * Math.random() * BACKLOG_DEVIATION;
      setBacklog(formatTime(BACKLOG_CENTER + deviation));
    };

    const interval = setInterval(updateBacklog, 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate random number
  useEffect(() => {
    const generateRandomNumber = () => {
      setRandomNumber(Math.random());
    };

    const interval = setInterval(generateRandomNumber, 50);
    return () => clearInterval(interval);
  }, []);


  const generateHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
    return hash;
  };

  const normalizeHash = (hash: number): number => {
    return Math.abs(hash % 1000) / 1000; // Normalize based on a modulo range
  };

    const fetchAndHashImages = async () => {
      const sensorHashes: number[] = [];
      try {
        for (let i = 0; i < GEN_LEN; i++) {
          const response = await fetch("https://www.earthcam.com/"); // Simulate image fetch
          const imageData = await response.text();
          const hash = generateHash(imageData);
          const normalizedHash = normalizeHash(hash);
          sensorHashes.push(normalizedHash);
        }
      } catch (error) {
        console.error("Error fetching sensor images:", error);
      }
    };

    fetchAndHashImages();

  // Generate sensor logs
  const generateSensorLogs = () => {
    const logs = [];
    for (let i = 1; i <= GEN_LEN; i++) {
      logs.push(
        <p key={i} className="text-green-400">
          Normalized Sensor {i}:{" "}
          <span className="text-white">{Math.random().toFixed(6)}</span>
        </p>
      );
    }
    return logs;
  };

  // Format time for backlog
  const formatTime = (ms: number) => {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    ms %= 24 * 60 * 60 * 1000;
    const hours = Math.floor(ms / (60 * 60 * 1000));
    ms %= 60 * 60 * 1000;
    const minutes = Math.floor(ms / (60 * 1000));
    ms %= 60 * 1000;
    const seconds = Math.floor(ms / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-[#112] text-wheat flex flex-col justify-center items-center p-6 font-sans">
      <div className="bg-[#223] p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <p className="text-sm text-wheat opacity-70 font-bold -mt-4 mb-2">
          1 Consumer at 10/s
        </p>
        <p className="text-lg">
          Current Random Number:{" "}
          <span className="text-green-400 text-2xl">{randomNumber.toFixed(6)}</span>
        </p>
        <p className="mt-4 text-sm text-wheat">
          Backlog: <span className="font-mono text-white">{backlog}</span>
        </p>
        <div className="overflow-y-scroll h-64 bg-[#112] rounded-lg mt-6 p-4 flex flex-col-reverse gap-2 text-sm">
          {generateSensorLogs()}
        </div>
      </div>
    </div>
  );
}
