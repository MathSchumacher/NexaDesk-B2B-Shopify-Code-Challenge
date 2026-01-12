import { useState, useRef, useEffect } from 'react';
import { Camera, X, Check, ZoomIn, ZoomOut } from 'lucide-react';
import { toast } from 'sonner';

interface AvatarCropperProps {
  onSave: (base64: string) => void;
  onCancel: () => void;
  initialImage?: string;
}

export const AvatarCropper = ({ onSave, onCancel }: AvatarCropperProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Load image from file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione uma imagem válida.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        setScale(1);
        setPosition({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  // Draw image on canvas whenever state changes
  useEffect(() => {
    if (!imageSrc || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fill background
    ctx.fillStyle = '#1e1e2d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = imageRef.current;
    
    // Calculate centered position
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    
    const drawX = centerX - (scaledWidth / 2) + position.x;
    const drawY = centerY - (scaledHeight / 2) + position.y;

    ctx.save();
    
    // Draw the circular mask
    ctx.beginPath();
    ctx.arc(centerX, centerY, 100, 0, Math.PI * 2);
    ctx.clip(); // Clip to circle

    // Draw image
    ctx.drawImage(img, drawX, drawY, scaledWidth, scaledHeight);
    
    ctx.restore();

    // Draw circular border overlay
    ctx.beginPath();
    ctx.arc(centerX, centerY, 100, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#3b82f6'; // Primary color
    ctx.stroke();

    // Draw semi-transparent overlay outside circle for visual guidance
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    // Outer rectangle
    ctx.rect(0, 0, canvas.width, canvas.height);
    // Inner circle (counter-clockwise to create hole)
    ctx.arc(centerX, centerY, 100, 0, Math.PI * 2, true);
    ctx.fill();

  }, [imageSrc, scale, position]);

  const handleSave = () => {
    if (!canvasRef.current) return;
    
    // Create a temporary canvas for the final cropped output
    const outCanvas = document.createElement('canvas');
    outCanvas.width = 200;
    outCanvas.height = 200;
    const ctx = outCanvas.getContext('2d');
    
    if (!imageRef.current || !canvasRef.current || !ctx) return;

    // Draw circular clip path on output canvas
    ctx.beginPath();
    ctx.arc(100, 100, 100, 0, Math.PI * 2);
    ctx.clip();

    // Calculate drawing params based on current view
    const img = imageRef.current;
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    
    // Adjusted position relative to center
    const drawX = 100 - (scaledWidth / 2) + position.x;
    const drawY = 100 - (scaledHeight / 2) + position.y;

    ctx.drawImage(img, drawX, drawY, scaledWidth, scaledHeight);

    const base64 = outCanvas.toDataURL('image/png', 0.8);
    onSave(base64);
  };

  // Mouse/Touch Event Handlers for Dragging
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!imageSrc) {
    return (
      <div className="avatar-cropper-upload">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange} 
          accept="image/*" 
          style={{ display: 'none' }} 
        />
        <div 
          className="upload-dropzone"
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed var(--border-color)',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: 'rgba(255,255,255,0.02)'
          }}
        >
          <div style={{ 
            background: 'rgba(59, 130, 246, 0.1)', 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Camera size={32} color="#3b82f6" />
          </div>
          <h3 style={{ marginBottom: '8px', color: '#fff' }}>Carregar Foto</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Clique para selecionar ou arraste uma imagem aqui
          </p>
        </div>
        <button className="cancel-btn" onClick={onCancel} style={{ marginTop: '20px', width: '100%', padding: '10px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <div className="avatar-cropper-editor">
      {/* Hidden Image Source for Canvas */}
      <img 
        ref={imageRef} 
        src={imageSrc} 
        alt="Source" 
        style={{ display: 'none' }} 
        onLoad={() => {
          // Force re-render once image is loaded to draw
          setScale(1); 
        }}
      />
      
      <div className="cropper-canvas-container" style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', cursor: isDragging ? 'grabbing' : 'grab' }}>
        <canvas 
          ref={canvasRef}
          width={320}
          height={320}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          style={{ display: 'block', background: '#000', width: '100%', maxWidth: '320px', margin: '0 auto' }}
        />
      </div>

      <div className="cropper-controls" style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="icon-btn">
          <ZoomOut size={20} />
        </button>
        <input 
          type="range" 
          min="0.5" 
          max="3" 
          step="0.1" 
          value={scale} 
          onChange={e => setScale(parseFloat(e.target.value))}
          style={{ width: '120px' }}
        />
        <button onClick={() => setScale(s => Math.min(3, s + 0.1))} className="icon-btn">
          <ZoomIn size={20} />
        </button>
      </div>

      <div className="cropper-actions" style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
        <button 
          onClick={onCancel}
          style={{ 
            flex: 1, 
            padding: '10px', 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '8px', 
            color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            cursor: 'pointer'
          }}
        >
          <X size={18} /> Cancelar
        </button>
        <button 
          onClick={handleSave}
          style={{ 
            flex: 1, 
            padding: '10px', 
            background: 'var(--primary-500)', 
            border: 'none', 
            borderRadius: '8px', 
            color: '#fff', 
            fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            cursor: 'pointer'
          }}
        >
          <Check size={18} /> Salvar Foto
        </button>
      </div>

      <style>{`
        .icon-btn {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          width: 36px;
          height: 36px;
          border-radius: 8px;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .icon-btn:hover {
          background: var(--bg-hover);
          color: var(--primary-400);
        }
        input[type=range] {
          accent-color: var(--primary-500);
        }
      `}</style>
    </div>
  );
};
