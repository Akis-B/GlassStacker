import React, { useEffect, useRef } from 'react';

export default function GlassStackingArt() {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      new window.p5((p) => {
        let glasses = [];
        let selected = null;
        let cameraX = 0.5;
        let cameraY = 0;
        let startX = 0;
        let startY = 0;
        let dragging = false;

        p.setup = () => {
          p.createCanvas(800, 600, p.WEBGL);
          
          glasses.push({ x: 0, y: 0, z: 0, size: 200 });
          glasses.push({ x: 50, y: -30, z: 50, size: 180 });
          glasses.push({ x: -50, y: -60, z: -50, size: 220 });
        };

        p.draw = () => {
          p.background(255);
          p.ambientLight(100);
          p.directionalLight(255, 255, 255, 0.5, 0.5, -1);
          
          p.rotateX(cameraX);
          p.rotateY(cameraY);
          
          // sort by depth
          glasses.sort((a, b) => {
            let depthA = a.z * Math.cos(cameraY) - a.x * Math.sin(cameraY);
            let depthB = b.z * Math.cos(cameraY) - b.x * Math.sin(cameraY);
            return depthA - depthB;
          });
          
          for (let i = 0; i < glasses.length; i++) {
            let g = glasses[i];
            p.push();
            p.translate(g.x, g.y, g.z);
            
            if (selected === g) {
              p.stroke(255, 100, 0, 200);
              p.strokeWeight(3);
            } else {
              p.stroke(64, 224, 208, 150);
              p.strokeWeight(1);
            }
            
            p.fill(64, 224, 208, 60);
            p.box(g.size, 10, g.size);
            p.pop();
          }
        };

        p.mousePressed = () => {
          let found = false;
          
          for (let i = glasses.length - 1; i >= 0; i--) {
            let g = glasses[i];
            let mx = p.mouseX - p.width / 2;
            let my = p.mouseY - p.height / 2;
            let distance = p.dist(mx, my, g.x, g.y);
            
            if (distance < g.size / 2) {
              selected = g;
              found = true;
              break;
            }
          }
          
          if (!found) {
            selected = null;
            dragging = true;
            startX = p.mouseX;
            startY = p.mouseY;
          }
        };

        p.mouseDragged = () => {
          if (dragging) {
            let dx = p.mouseX - startX;
            let dy = p.mouseY - startY;
            cameraY = cameraY + dx * 0.01;
            cameraX = cameraX + dy * 0.01;
            startX = p.mouseX;
            startY = p.mouseY;
          }
        };

        p.mouseReleased = () => {
          dragging = false;
        };

        p.keyPressed = () => {
          if (p.key === 'a' || p.key === 'A') {
            let newGlass = {
              x: p.random(-100, 100),
              y: p.random(-100, 100),
              z: p.random(-100, 100),
              size: p.random(150, 250)
            };
            glasses.push(newGlass);
          }
          
          if (p.key === 'r' || p.key === 'R') {
            if (glasses.length > 0) {
              glasses.pop();
            }
          }
          
          if (selected) {
            if (p.keyCode === p.LEFT_ARROW) {
              selected.x = selected.x - 10;
            }
            if (p.keyCode === p.RIGHT_ARROW) {
              selected.x = selected.x + 10;
            }
            if (p.keyCode === p.UP_ARROW) {
              selected.y = selected.y - 10;
            }
            if (p.keyCode === p.DOWN_ARROW) {
              selected.y = selected.y + 10;
            }
          }
        };
      }, containerRef.current);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-white flex items-center justify-center relative">
      <div className="absolute top-4 left-4 text-black border border-black p-3" style={{ fontFamily: 'Menlo, monospace' }}>
        <div className="font-semibold text-lg mb-2">Controls</div>
        <div className="text-sm space-y-1">
          <div>A - Add new glass piece</div>
          <div>R - Remove last piece</div>
          <div>Click - Select glass piece</div>
          <div>Arrow Keys - Move selected piece</div>
          <div>Drag - Rotate camera view</div>
        </div>
      </div>
      <div ref={containerRef} />
    </div>
  );
}
