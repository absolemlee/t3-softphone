// src/components/Softphone.tsx
import React, { useEffect, useRef, useState } from 'react';
import { UserAgent } from 'sip.js';

type SoftphoneProps = {
  target?: string; // e.g., '10002' for the extension to call (optional, for dashboard embedding)
  admin?: boolean; // if true, show admin features
};

export default function Softphone({ target = '10002', admin = false }: SoftphoneProps) {
  const [callActive, setCallActive] = useState(false);
  const [status, setStatus] = useState('Not Registered');
  const userAgentRef = useRef<UserAgent | null>(null);
  const sessionRef = useRef<any>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // TODO: Move these credentials to .env or secure storage!
    const ua = new UserAgent({
      uri: UserAgent.makeURI('sip:10001@pbx.koriki.net'),
      authorizationUsername: '10001',
      authorizationPassword: process.env.NEXT_PUBLIC_SIP_PASSWORD ?? 'your_sip_password',
      transportOptions: {
        server: 'wss://pbx.koriki.net:7443',
      },
      delegate: {
        onInvite: async (invitation) => {
          sessionRef.current = invitation;
          await invitation.accept();
          setCallActive(true);
        },
      },
      sessionDescriptionHandlerFactoryOptions: {
        constraints: { audio: true, video: false },
      },
    });

    ua.start()
      .then(() => setStatus('Registered'))
      .catch((err) => setStatus(`Error: ${err.message}`));

    userAgentRef.current = ua;

    return () => {
      ua.stop();
    };
  }, []);

  // Outbound Call
  const makeCall = async () => {
    const session = userAgentRef.current?.invite(`sip:${target}@pbx.koriki.net`);
    sessionRef.current = session;
    session.stateChange.addListener((state: string) => {
      if (state === 'Established') setCallActive(true);
      if (state === 'Terminated') setCallActive(false);
    });
  };

  const hangUp = () => {
    sessionRef.current?.bye();
  };

  return (
    <div className="p-4 border rounded shadow bg-white">
      <h1 className="text-xl font-bold">Koriki Softphone</h1>
      <p>Status: {status}</p>
      {admin && <div className="mb-2 text-sm text-blue-600">[Admin Panel]</div>}

      <div className="my-4">
        {!callActive ? (
          <button onClick={makeCall} className="px-4 py-2 bg-green-500 rounded text-white">
            Call {target}
          </button>
        ) : (
          <button onClick={hangUp} className="px-4 py-2 bg-red-500 rounded text-white">
            Hang Up
          </button>
        )}
      </div>

      <audio ref={remoteAudioRef} autoPlay hidden />
    </div>
  );
}
