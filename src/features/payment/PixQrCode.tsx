import QRCode from 'qrcode'
import { useEffect, useState } from 'react'

interface PixQrCodeProps {
  payload: string
  className?: string
}

export function PixQrCode({ payload, className = '' }: PixQrCodeProps) {
  const [dataUrl, setDataUrl] = useState<string>()

  useEffect(() => {
    let isCurrent = true

    QRCode.toDataURL(payload, {
      margin: 1,
      width: 480,
      errorCorrectionLevel: 'M',
      color: { dark: '#1f2b47', light: '#ffffff' },
    })
      .then((url) => isCurrent && setDataUrl(url))
      .catch(() => isCurrent && setDataUrl(undefined))

    return () => {
      isCurrent = false
    }
  }, [payload])

  return (
    <div className={`aspect-square bg-white ${className}`}>
      {dataUrl && (
        <img src={dataUrl} alt="QR Code do Pix" className="size-full rounded-[inherit]" />
      )}
    </div>
  )
}
