import React, { useEffect, useState } from "react";

export default function Hero() {
  // State for sensor data
  const [microphoneLevel, setMicrophoneLevel] = useState<number>(0);
  const [mouseMovement, setMouseMovement] = useState<number>(0);
  const [clipboardHash, setClipboardHash] = useState<number>(0);
  const [windowSizeChangeCount, setWindowSizeChangeCount] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [keyPressCount, setKeyPressCount] = useState<number>(0);
  const [timeOfDay, setTimeOfDay] = useState<number>(0);
  const [randomNumber, setRandomNumber] = useState<number>(0);

  // State for checkboxes
  const [useMicrophone, setUseMicrophone] = useState<boolean>(true);
  const [useMouseMovement, setUseMouseMovement] = useState<boolean>(true);
  const [useClipboard, setUseClipboard] = useState<boolean>(true);
  const [useWindowSize, setUseWindowSize] = useState<boolean>(true);
  const [useScrollPosition, setUseScrollPosition] = useState<boolean>(true);
  const [useKeyPress, setUseKeyPress] = useState<boolean>(true);
  const [useTimeOfDay, setUseTimeOfDay] = useState<boolean>(true);

  // Microphone Sensor
  useEffect(() => {
    const getMicrophoneLevel = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const calculateMicrophoneLevel = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          setMicrophoneLevel(sum / dataArray.length);
        };

        setInterval(calculateMicrophoneLevel, 100);
      }
    };

    getMicrophoneLevel();
  }, []);

  // Mouse Movement Sensor
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouseMovement((prev) => prev + Math.abs(event.movementX) + Math.abs(event.movementY));
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Clipboard Changes
  useEffect(() => {
    const handleClipboardChange = async () => {
      const text = await navigator.clipboard.readText();
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) - hash + text.charCodeAt(i)) >>> 0; // Ensure non-negative 32-bit integer
      }
      setClipboardHash(hash);
    };
    

    window.addEventListener("copy", handleClipboardChange);

    return () => {
      window.removeEventListener("copy", handleClipboardChange);
    };
  }, []);

  // Window Resize Sensor
  useEffect(() => {
    const handleResize = () => {
      setWindowSizeChangeCount((prev) => prev + 1);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Scroll Position Sensor
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Key Press Intensity Sensor
  useEffect(() => {
    const handleKeyPress = () => {
      setKeyPressCount((prev) => prev + 1);
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  // Time of Day
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeOfDay(now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds());
    };

    const interval = setInterval(updateTime, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Generate Random Number
  useEffect(() => {
    const generateRandomNumber = () => {
      let seed = 0;

      if (useMicrophone) seed += microphoneLevel % 1;
      if (useMouseMovement) seed += (mouseMovement % 100) / 100;
      if (useClipboard) seed += (clipboardHash % 1000) / 1000;
      if (useWindowSize) seed += (windowSizeChangeCount % 10) / 10;
      if (useScrollPosition) seed += (scrollPosition % 1000) / 1000;
      if (useKeyPress) seed += (keyPressCount % 100) / 100;
      if (useTimeOfDay) seed += (timeOfDay % 86400) / 86400;

      setRandomNumber(seed % 1); // Normalize to 0-1
    };

    generateRandomNumber();
  }, [
    microphoneLevel,
    mouseMovement,
    clipboardHash,
    windowSizeChangeCount,
    scrollPosition,
    keyPressCount,
    timeOfDay,
    useMicrophone,
    useMouseMovement,
    useClipboard,
    useWindowSize,
    useScrollPosition,
    useKeyPress,
    useTimeOfDay,
  ]);

  // Local styling
  const styles = {
    container: `min-h-screen bg-gradient-to-r from-gray-900 to-black flex justify-center items-center p-6`,
    card: `text-center bg-black bg-opacity-80 p-8 rounded-xl shadow-lg max-w-[50vw] w-full`,
    heading: `text-4xl font-extrabold mb-6 whitespace-nowrap`,
    subheading: `text-lg text-blue-400 mb-8`,
    number: `text-6xl font-extrabold text-green-400 mb-6`,
    label: `text-sm text-gray-300 flex items-center gap-2 mb-4`,
    sensorData: `text-gray-300 text-sm space-y-3`,
    checkbox: `form-checkbox text-pink-500 focus:ring-pink-500 focus:ring-offset-gray-900`,
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Random Number Generator</h1>
        <p className={styles.subheading}>
          Select sensors to include and interact with your laptop!
        </p>
        <div className={styles.number}>{randomNumber.toFixed(5)}</div>
        <div className={styles.sensorData}>
          <label className={styles.label}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={useMicrophone}
              onChange={() => setUseMicrophone((prev) => !prev)}
            />
            Use Microphone Level:{" "}
            <span className="text-green-400">{microphoneLevel.toFixed(2)}</span>
          </label>
          <label className={styles.label}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={useMouseMovement}
              onChange={() => setUseMouseMovement((prev) => !prev)}
            />
            Use Mouse Movement Intensity:{" "}
            <span className="text-blue-400">{mouseMovement}</span>
          </label>
          <label className={styles.label}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={useClipboard}
              onChange={() => setUseClipboard((prev) => !prev)}
            />
            Use Clipboard Content:{" "}
            <span className="text-pink-400">{clipboardHash}</span>
          </label>
          <label className={styles.label}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={useWindowSize}
              onChange={() => setUseWindowSize((prev) => !prev)}
            />
            Use Window Size Changes:{" "}
            <span className="text-yellow-400">{windowSizeChangeCount}</span>
          </label>
          <label className={styles.label}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={useScrollPosition}
              onChange={() => setUseScrollPosition((prev) => !prev)}
            />
            Use Scroll Position:{" "}
            <span className="text-teal-400">{scrollPosition}</span>
          </label>
          <label className={styles.label}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={useKeyPress}
              onChange={() => setUseKeyPress((prev) => !prev)}
            />
            Use Key Press Intensity:{" "}
            <span className="text-orange-400">{keyPressCount}</span>
          </label>
          <label className={styles.label}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={useTimeOfDay}
              onChange={() => setUseTimeOfDay((prev) => !prev)}
            />
            Use Time of Day:{" "}
            <span className="text-purple-400">{timeOfDay}</span>
          </label>
        </div>
      </div>
    </div>
  );
}
