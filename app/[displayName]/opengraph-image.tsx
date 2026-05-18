import { ImageResponse } from 'next/og';
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export const alt = 'Profile Open Graph Image';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ displayName: string }> }) {
  const { displayName } = await params;

  let username = displayName;
  let bio = '나만의 링크 모음 공간';
  let photoURL = '';

  try {
    const q = query(collection(db, "users"), where("displayName", "==", displayName));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0].data();
      username = userDoc.username || displayName;
      bio = userDoc.bio || bio;
      photoURL = userDoc.photoURL || '';
    }
  } catch (e) {
    console.error("Failed to fetch user data for OG image:", e);
  }

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
        {/* Background blobs using radial gradients */}
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
          bottom: -200,
          right: -100,
          width: 800,
          height: 800,
          backgroundImage: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(255, 255, 255, 0) 70%)',
        }} />
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '40%',
          width: 500,
          height: 500,
          backgroundImage: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
        }} />

        {/* Main Content Box (Glassmorphism/Clean look) */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid rgba(228, 228, 231, 0.8)', // zinc-200
            borderRadius: '40px',
            padding: '80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            width: '800px',
            zIndex: 10,
          }}
        >
          {photoURL ? (
            <div style={{
              display: 'flex',
              padding: '8px',
              borderRadius: '50%',
              backgroundImage: 'linear-gradient(to top right, #fbbf24, #ec4899, #a855f7)',
              marginBottom: '40px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            }}>
              <img
                src={photoURL}
                width="180"
                height="180"
                style={{
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid white',
                  backgroundColor: 'white',
                }}
              />
            </div>
          ) : (
            <div style={{
              display: 'flex',
              padding: '8px',
              borderRadius: '50%',
              backgroundImage: 'linear-gradient(to top right, #fbbf24, #ec4899, #a855f7)',
              marginBottom: '40px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            }}>
              <div
                style={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  border: '4px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 80, fontWeight: 900, color: '#09090b' }}>
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
          
          <h1 style={{ fontSize: 64, fontWeight: 900, margin: 0, color: '#09090b', letterSpacing: '-0.05em', textAlign: 'center' }}>
            {username}
          </h1>
          {bio && (
            <p style={{ fontSize: 32, marginTop: 24, color: '#71717a', fontWeight: 500, textAlign: 'center', maxWidth: '650px', lineHeight: 1.4 }}>
              {bio}
            </p>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
