import { useEffect, useRef } from 'react';

export default function ParticlesBg() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();

        const shapes = ['square', 'circle', 'triangle', 'squiggle', 'bracket'];
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FFFFFF']; // Pink, Cyan, Yellow, White

        const particles = Array.from({ length: 35 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 40 + 20,
            speedX: (Math.random() - 0.5) * 1.5,
            speedY: (Math.random() - 0.5) * 1.5,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 2,
            type: shapes[Math.floor(Math.random() * shapes.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            bracketLabel: Math.random() > 0.5 ? '{' : '}'
        }));

        let frame = 0;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frame++;

            particles.forEach((p) => {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);

                ctx.lineWidth = 4;
                ctx.strokeStyle = '#111111';
                ctx.fillStyle = p.color;

                ctx.beginPath();
                if (p.type === 'square') {
                    // Draw neo shadow
                    ctx.fillStyle = '#111111';
                    ctx.fillRect(-p.size / 2 + 6, -p.size / 2 + 6, p.size, p.size);
                    // Draw main shape
                    ctx.fillStyle = p.color;
                    ctx.rect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.fill();
                    ctx.stroke();
                } else if (p.type === 'circle') {
                    ctx.fillStyle = '#111111';
                    ctx.arc(6, 6, p.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.fillStyle = p.color;
                    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                } else if (p.type === 'triangle') {
                    // shadow
                    ctx.fillStyle = '#111111';
                    ctx.moveTo(6, -p.size / 2 + 6);
                    ctx.lineTo(p.size / 2 + 6, p.size / 2 + 6);
                    ctx.lineTo(-p.size / 2 + 6, p.size / 2 + 6);
                    ctx.closePath();
                    ctx.fill();
                    
                    ctx.beginPath();
                    ctx.fillStyle = p.color;
                    ctx.moveTo(0, -p.size / 2);
                    ctx.lineTo(p.size / 2, p.size / 2);
                    ctx.lineTo(-p.size / 2, p.size / 2);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                } else if (p.type === 'squiggle') {
                    ctx.lineWidth = 8;
                    ctx.moveTo(-p.size / 2, 0);
                    ctx.bezierCurveTo(-p.size / 4, -p.size, p.size / 4, p.size, p.size / 2, 0);
                    ctx.stroke();
                } else if (p.type === 'bracket') {
                    ctx.font = `bold ${p.size * 1.5}px "IBM Plex Mono"`;
                    ctx.fillStyle = '#111111';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(p.bracketLabel, 0, 0);
                }

                ctx.restore();

                p.x += p.speedX;
                p.y += p.speedY;
                p.rotation += p.rotationSpeed;

                if (p.x < -100) p.x = canvas.width + 100;
                if (p.x > canvas.width + 100) p.x = -100;
                if (p.y < -100) p.y = canvas.height + 100;
                if (p.y > canvas.height + 100) p.y = -100;
            });

            requestAnimationFrame(animate);
        };
        animate();

        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none opacity-50 mix-blend-multiply"
        />
    );
}