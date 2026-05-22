/**
 * Generates a lightweight, deterministic device fingerprint hash based on browser attributes.
 */
export async function getDeviceFingerprint(): Promise<string> {
  if (typeof window === 'undefined') return '';

  try {
    // Collect stable browser hardware and environment markers
    const components = [
      navigator.userAgent,
      navigator.language,
      window.screen.colorDepth,
      `${window.screen.width}x${window.screen.height}`,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 'unknown',
      // Canvas fingerprinting (extracts subtle rendering variance between device GPUs)
      getCanvasSignature(),
    ];

    const dataString = components.join('||');
    
    // Hash the compiled features using native Web Crypto API (SHA-256)
    const encoder = new TextEncoder();
    const data = encoder.encode(dataString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert buffer to hex string
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } catch (error) {
    console.error('Failed to compute device signature:', error);
    return 'fallback-sig-' + navigator.userAgent.replace(/\s+/g, '-').substring(0, 32);
  }
}

function getCanvasSignature(): string {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    // Subtle vector paths that compile differently depending on OS subpixel font-rendering engines
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#A4143D"; // Aviorè Wine Red
    ctx.fillRect(10, 5, 50, 20);
    ctx.fillStyle = "#09090B";
    ctx.fillText("aviore_growth_engine_v1", 2, 15);
    
    return canvas.toDataURL();
  } catch {
    return '';
  }
}