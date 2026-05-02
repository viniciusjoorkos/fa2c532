import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface AvatarCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onSave: (base64: string) => Promise<void>;
}

export function AvatarCropDialog({ open, onOpenChange, imageUrl, onSave }: AvatarCropDialogProps) {
  const [saving, setSaving] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      imgRef.current = img;
      // Reset state
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      draw();
    };
  }, [imageUrl, open]);

  useEffect(() => {
    draw();
  }, [zoom, offset]);

  function draw() {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 300;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    // Calculate scaling to cover the square
    const scale = Math.max(size / img.width, size / img.height) * zoom;
    const w = img.width * scale;
    const h = img.height * scale;

    const cx = size / 2;
    const cy = size / 2;

    ctx.save();
    
    // Create circular clipping path for preview (optional, can just be square)
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(
      img,
      cx - w / 2 + offset.x,
      cy - h / 2 + offset.y,
      w,
      h
    );

    ctx.restore();
  }

  function handleMouseDown(e: React.MouseEvent | React.TouchEvent) {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStart.current = { x: clientX - offset.x, y: clientY - offset.y };
  }

  function handleMouseMove(e: React.MouseEvent | React.TouchEvent) {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setOffset({
      x: clientX - dragStart.current.x,
      y: clientY - dragStart.current.y,
    });
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  async function handleSave() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSaving(true);
    try {
      const base64 = canvas.toDataURL("image/jpeg", 0.9);
      await onSave(base64);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajustar Imagem</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-4">
          <div 
            className="relative cursor-move overflow-hidden rounded-full border-4 border-primary/20 shadow-xl"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            <canvas ref={canvasRef} className="block bg-black/5" />
            {/* Guide overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_2px_rgba(255,255,255,0.5)]"></div>
          </div>

          <div className="w-full max-w-[300px] space-y-2 text-center">
            <label className="text-xs text-muted-foreground">Zoom</label>
            <input 
              type="range" 
              min="1" 
              max="3" 
              step="0.01" 
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <p className="text-[10px] text-muted-foreground">Arraste a imagem para reposicionar</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground hover:opacity-90">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
