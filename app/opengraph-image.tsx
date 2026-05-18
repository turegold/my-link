import { ImageResponse } from 'next/og';

export const alt = 'MyLink - 나만의 링크를 하나의 주소로';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: '#ffffff',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background blobs using radial gradients to simulate blur */}
        <div style={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 600,
          height: 600,
          backgroundImage: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(255, 255, 255, 0) 70%)',
        }} />
        <div style={{
          position: 'absolute',
          top: '20%',
          right: -150,
          width: 700,
          height: 700,
          backgroundImage: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(255, 255, 255, 0) 70%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -200,
          left: '20%',
          width: 800,
          height: 800,
          backgroundImage: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(255, 255, 255, 0) 70%)',
        }} />

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          padding: '40px',
          textAlign: 'center',
        }}>
          {/* Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 24px',
            borderRadius: '999px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: '#10b981',
            fontWeight: 600,
            fontSize: 24,
            marginBottom: '40px',
          }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            지금 바로 무료로 시작하세요
          </div>

          {/* Main Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ 
              fontSize: 88, 
              fontWeight: 800, 
              margin: 0, 
              color: '#09090b', // zinc-950
              letterSpacing: '-0.05em',
              lineHeight: 1.1,
            }}>
              나만의 링크를
            </h1>
            <h1 style={{ 
              fontSize: 96, 
              fontWeight: 900, 
              margin: 0, 
              letterSpacing: '-0.05em',
              lineHeight: 1.1,
              backgroundClip: 'text',
              color: 'transparent',
              backgroundImage: 'linear-gradient(to right, #10b981, #3b82f6, #a855f7)',
            }}>
              하나의 주소로
            </h1>
          </div>

          {/* Subtitle */}
          <p style={{ 
            fontSize: 32, 
            marginTop: '40px', 
            color: '#71717a', // zinc-500
            fontWeight: 500, 
            textAlign: 'center', 
            maxWidth: '850px',
            lineHeight: 1.5,
          }}>
            인스타그램, 유튜브, 블로그 등 흩어져 있는<br />
            당신의 모든 링크를 하나의 멋진 프로필에 담아보세요.
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
