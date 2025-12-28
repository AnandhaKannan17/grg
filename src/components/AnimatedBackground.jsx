import React, { useMemo } from 'react';
import '../styles/AnimatedBackground.css';

const AnimatedBackground = ({ variant = 'default' }) => {
    // Generate random particles
    const particles = useMemo(() => {
        return Array.from({ length: 30 }, (_, i) => ({
            id: i,
            size: Math.random() * 4 + 2,
            left: Math.random() * 100,
            delay: Math.random() * 8,
            duration: Math.random() * 10 + 15,
            opacity: Math.random() * 0.5 + 0.2
        }));
    }, []);

    // Generate sparkles
    const sparkles = useMemo(() => {
        return Array.from({ length: 15 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 5,
            duration: Math.random() * 2 + 1
        }));
    }, []);

    return (
        <div className={`animated-bg animated-bg--${variant}`}>
            {/* Aurora Waves */}
            <div className="aurora-container">
                <div className="aurora aurora-1"></div>
                <div className="aurora aurora-2"></div>
                <div className="aurora aurora-3"></div>
            </div>

            {/* Gradient Mesh */}
            <div className="gradient-mesh">
                <div className="mesh-blob mesh-blob-1"></div>
                <div className="mesh-blob mesh-blob-2"></div>
                <div className="mesh-blob mesh-blob-3"></div>
                <div className="mesh-blob mesh-blob-4"></div>
            </div>

            {/* Floating Orbs */}
            <div className="orbs-container">
                <div className="bg-orb bg-orb-1"></div>
                <div className="bg-orb bg-orb-2"></div>
                <div className="bg-orb bg-orb-3"></div>
                <div className="bg-orb bg-orb-4"></div>
                <div className="bg-orb bg-orb-5"></div>
            </div>

            {/* Floating Particles */}
            <div className="particles-container">
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="particle"
                        style={{
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            left: `${particle.left}%`,
                            animationDelay: `${particle.delay}s`,
                            animationDuration: `${particle.duration}s`,
                            opacity: particle.opacity
                        }}
                    />
                ))}
            </div>

            {/* Sparkles */}
            <div className="sparkles-container">
                {sparkles.map((sparkle) => (
                    <div
                        key={sparkle.id}
                        className="sparkle"
                        style={{
                            left: `${sparkle.left}%`,
                            top: `${sparkle.top}%`,
                            animationDelay: `${sparkle.delay}s`,
                            animationDuration: `${sparkle.duration}s`
                        }}
                    />
                ))}
            </div>

            {/* Floating Shapes */}
            <div className="shapes-container">
                <div className="bg-shape bg-shape-1"></div>
                <div className="bg-shape bg-shape-2"></div>
                <div className="bg-shape bg-shape-3"></div>
            </div>

            {/* Light Beams */}
            <div className="light-beams">
                <div className="beam beam-1"></div>
                <div className="beam beam-2"></div>
            </div>

            {/* Noise Overlay */}
            <div className="noise-overlay"></div>

            {/* Vignette */}
            <div className="vignette"></div>
        </div>
    );
};

export default AnimatedBackground;
