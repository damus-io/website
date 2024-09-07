/*
The code below was taken from https://codepen.io/ChuckWines/pen/OJPEzqN and licensed under the MIT License.

The code was further modified to be used in a React component with TypeScript.
---------
Copyright (c) 2024 by Charles Wines (https://codepen.io/ChuckWines/pen/OJPEzqN)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import { useScroll, useTransform } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

const STAR_COUNT = 300;
const STAR_MIN_SPEED = 0.005;
const STAR_MAX_SPEED = 0.09;
const MIN_VISION_PERSISTENCE = 0.2;
const MAX_VISION_PERSISTENCE = 0.99;

export function StarField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const { scrollYProgress } = useScroll()
  const speed = useTransform(scrollYProgress, [0, 0.3], [STAR_MIN_SPEED, STAR_MAX_SPEED]);
  const visionPersistence = useTransform(scrollYProgress, [0, 0.3], [MIN_VISION_PERSISTENCE, MAX_VISION_PERSISTENCE]);

  class Star {
    x: number;
    y: number;
    prevX: number;
    prevY: number;
    z: number;

    constructor(canvasWidth: number, canvasHeight: number) {
      this.x = Math.random() * canvasWidth - canvasWidth / 2;
      this.y = Math.random() * canvasHeight - canvasHeight / 2;
      this.prevX = this.x;
      this.prevY = this.y;
      this.z = Math.random() * 4;
    }

    update(speed: number, canvasWidth: number, canvasHeight: number) {
      this.prevX = this.x;
      this.prevY = this.y;
      this.z += speed;
      this.x += this.x * (speed * 0.2) * this.z;
      this.y += this.y * (speed * 0.2) * this.z;
      if (
        this.x > canvasWidth / 2 + 50 ||
        this.x < -canvasWidth / 2 - 50 ||
        this.y > canvasHeight / 2 + 50 ||
        this.y < -canvasHeight / 2 - 50
      ) {
        this.x = Math.random() * canvasWidth - canvasWidth / 2;
        this.y = Math.random() * canvasHeight - canvasHeight / 2;
        this.prevX = this.x;
        this.prevY = this.y;
        this.z = 0;
      }
    }

    show(context: CanvasRenderingContext2D) {
      context.lineWidth = this.z;
      context.beginPath();
      context.moveTo(this.x, this.y);
      context.lineTo(this.prevX, this.prevY);
      context.stroke();
    }
  }

  const getContext = () => {
    if (!contextRef.current && canvasRef.current) {
        let context = canvasRef.current.getContext('2d');
        if (!context) throw new Error('Failed to get canvas context');
        contextRef.current = context;
        return context;
    }
    else {
        if (!contextRef.current) throw new Error('Canvas context is not available');
        return contextRef.current;
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = getContext();

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let stars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(new Star(canvas.width, canvas.height));
    }

    context.fillStyle = `rgba(0, 0, 0, ${1 - visionPersistence.get()})`;
    context.strokeStyle = 'rgba(235, 215, 255)';
    context.translate(canvas.width / 2, canvas.height / 2);

    function draw() {
      if (!context) return;
      if (!canvas) return;
      context.fillStyle = `rgba(0, 0, 0, ${1 - visionPersistence.get()})`;
      context.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
      for (let star of stars) {
        star.update(speed.get(), canvas.width, canvas.height);
        star.show(context);
      }
      requestAnimationFrame(draw);
    }

    draw();
  }, []);

  return <canvas ref={canvasRef} className={className} style={{
    zIndex: -1,
  }} />;
};

export default StarField;