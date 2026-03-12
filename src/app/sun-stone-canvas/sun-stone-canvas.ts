import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import p5 from 'p5';

@Component({
  selector: 'app-sun-stone-canvas',
  templateUrl: './sun-stone-canvas.html',
  styleUrls: ['./sun-stone-canvas.css'],
})
export class SunStoneCanvasComponent implements OnInit, OnDestroy {
  // Grab the div we created in the HTML
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;

  private p5Instance: p5 | undefined;
  // The 20 day signs of the Tonalpohualli in sequential order
  daySigns: string[] = [
    'Cipactli',
    'Ehecatl',
    'Calli',
    'Cuetzpalin',
    'Coatl',
    'Miquiztli',
    'Mazatl',
    'Tochtli',
    'Atl',
    'Itzcuintli',
    'Ozomatli',
    'Malinalli',
    'Acatl',
    'Ocelotl',
    'Cuauhtli',
    'Cozcacuauhtli',
    'Ollin',
    'Tecpatl',
    'Quiahuitl',
    'Xochitl',
  ];
  // --- THE CALENDAR ENGINE (CUENTA UNIFICADA DE ANÁHUAC) ---
  calculateTonalpohualli(targetDate: Date) {
    // Anchor Date established from the Cuenta Unificada de Anáhuac
    // October 11, 2024 correlates to 5 Mazatl (5 Deer)
    const anchorDate = new Date(2024, 9, 11); // Month is 0-indexed in JS (9 = October)

    // In our daySigns array, 'Mazatl' is at index 6
    const anchorSignIndex = 6;
    const anchorNumber = 5;

    // Reset both target and anchor to exactly midnight local time
    // This prevents hours/minutes from throwing off the day count
    const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const anchor = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), anchorDate.getDate());

    // Calculate total days elapsed
    const diffTime = target.getTime() - anchor.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    // Calculate the 20-day cycle (The Outer Gear)
    let targetSignIndex = (anchorSignIndex + diffDays) % 20;
    if (targetSignIndex < 0) targetSignIndex += 20;

    // Calculate the 13-day cycle (The Inner Gear)
    let targetNumber = ((anchorNumber - 1 + diffDays) % 13) + 1;
    if (targetNumber <= 0) targetNumber += 13;

    return {
      dayName: this.daySigns[targetSignIndex],
      dayNumber: targetNumber,
    };
  }

  ngOnInit(): void {
    // Get today's date
    const today = new Date();

    // Run the engine
    const todayNahuatl = this.calculateTonalpohualli(today);

    console.log(`Today's Tonalpohualli date is: ${todayNahuatl.dayNumber} ${todayNahuatl.dayName}`);

    this.instantiateP5();
  }

  ngOnDestroy(): void {
    // Clean up the canvas if the component is destroyed
    if (this.p5Instance) {
      this.p5Instance.remove();
    }
  }
  private instantiateP5(): void {
    const sketch = (s: p5) => {
      // 1. Current angles for the animation
      let currentOuterAngle = 0;
      let currentInnerAngle = 0;

      // 2. Target angles (where the rings need to stop)
      let targetOuterAngle = 0;
      let targetInnerAngle = 0;

      s.setup = () => {
        const canvas = s.createCanvas(600, 600);
        canvas.parent(this.canvasContainer.nativeElement);
        s.angleMode(s.RADIANS);

        // --- RUN THE ENGINE ON LOAD ---
        // Get today's Nahuatl date using your Unified Count algorithm
        const todayNahuatl = this.calculateTonalpohualli(new Date());

        // Find the index positions (0-19 for signs, 0-12 for numbers)
        const signIndex = this.daySigns.indexOf(todayNahuatl.dayName);
        const numberIndex = todayNahuatl.dayNumber - 1;

        // Calculate exactly how far to rotate so these indices hit 12 o'clock (-HALF_PI)
        const outerAngleStep = s.TWO_PI / 20;
        targetOuterAngle = -s.HALF_PI - signIndex * outerAngleStep;

        const innerAngleStep = s.TWO_PI / 13;
        // We spin the inner ring the opposite way visually, so we add the angle
        targetInnerAngle = -s.HALF_PI + numberIndex * innerAngleStep;
      };

      s.draw = () => {
        s.background(30);
        s.translate(s.width / 2, s.height / 2);

        // --- SMOOTH ANIMATION (LERP) ---
        // This eases the current angle toward the target angle by 5% every frame
        currentOuterAngle = s.lerp(currentOuterAngle, targetOuterAngle, 0.05);
        currentInnerAngle = s.lerp(currentInnerAngle, targetInnerAngle, 0.05);

        // --- CENTER (Tonatiuh) ---
        s.fill(200, 150, 50);
        s.noStroke();
        s.circle(0, 0, 100);

        // --- 20-DAY OUTER RING ---
        s.push();
        s.rotate(currentOuterAngle); // Use the animated angle
        s.textAlign(s.CENTER, s.CENTER);
        s.textSize(12);
        s.fill(255);

        const outerRadius = 120;
        const outerAngleStep = s.TWO_PI / 20;

        for (let i = 0; i < 20; i++) {
          s.push();
          s.rotate(i * outerAngleStep);
          s.translate(outerRadius, 0);
          // Keep text readable horizontally
          s.rotate(-i * outerAngleStep - currentOuterAngle);
          s.text(this.daySigns[i], 0, 0);
          s.pop();
        }
        s.pop();

        // --- 13-NUMBER INNER RING ---
        s.push();
        // Spin opposite direction using the inner angle
        s.rotate(-currentInnerAngle);
        s.fill(200);
        s.textSize(16);

        const innerRadius = 80;
        const innerAngleStep = s.TWO_PI / 13;

        for (let j = 0; j < 13; j++) {
          s.push();
          s.rotate(j * innerAngleStep);
          s.translate(innerRadius, 0);
          // Keep text readable horizontally
          s.rotate(-j * innerAngleStep + currentInnerAngle);
          s.text((j + 1).toString(), 0, 0);
          s.pop();
        }
        s.pop();

        // --- HIGHLIGHT THE 12 O'CLOCK POSITION ---
        // A simple visual indicator showing where to read the current date
        s.stroke(255, 0, 0); // Red line
        s.strokeWeight(2);
        s.line(0, -60, 0, -140);
      };
    };

    this.p5Instance = new p5(sketch);
  }
}
