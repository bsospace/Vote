import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import 'tailwindcss/tailwind.css';

interface QRScannerProps {
    onResult: (result: any) => void;
  }

const QRScanner: React.FC<QRScannerProps> = () => {
    const videoElementRef = useRef<HTMLVideoElement | null>(null);
    const [scanned, setScannedText] = useState('');

    useEffect(() => {
        const video = videoElementRef.current;
        if (!video) return;

        const qrScanner = new QrScanner(
            video,
            (result: QrScanner.ScanResult) => {
                console.log('decoded qr code:', result);
                setScannedText(result.data);
            },
            {
                returnDetailedScanResult: true,
                highlightScanRegion: true,
                highlightCodeOutline: true,
            }
        );
        qrScanner.start();
        console.log('start');

        return () => {
            console.log(qrScanner);
            qrScanner.stop();
            qrScanner.destroy();
        };
    }, []);

    return (
        <div>
            <div className="flex items-center justify-center mb-2.5">
                <video className="object-cover border border-gray-300 w-88 h-88 rounded-3xl" ref={videoElementRef} />
            </div>
            <p className="break-words">SCANNED: {scanned}</p>
        </div>
    );
};

export default QRScanner;
