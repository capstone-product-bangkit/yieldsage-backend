
class YieldCalculation {
    private focal_length: number = 45;
    private sensor_width: number = 13;
    private sensor_height: number = 17.3;
    private flight_height: number = 30;
    private cpa: Array<number>;
    private image_height: number = 640;
    private image_width: number = 640;

    private yield_production: Record<string, number> = {
        "1": 14,
        "2": 24,
        "3": 29,
        "4": 33,
        "5": 33,
        "6": 31,
        "7": 31,
        "8": 35,
        "9": 32,
        "10": 30,
    }

    constructor(cpa: Array<number>) {
        this.cpa = cpa;
    }   

    public calculateGSDHeight(): number {
        return (this.flight_height * this.sensor_height) / (this.focal_length * this.image_height);
    }

    public calculateGSDWidth(): number {
        return (this.flight_height * this.sensor_width) / (this.focal_length * this.image_width);
    }

    public calculateIndividualCPA(cpa: number): number { 
        return  (this.calculateGSDHeight() * cpa) + (this.calculateGSDWidth() * cpa);
    }

    public calculateIndividualAge(): Array<number> { 
        return this.cpa.map(cpa => Math.floor(0.59 + 0.15 * this.calculateIndividualCPA(cpa)));
    }

    public calculateAgeAverage(age: Array<number>): number { 
        return Math.floor(age.reduce((a, b) => a + b) / age.length);
    }

    public calculateCPAAverage(): number { 
        return this.cpa.reduce((a, b) => a + b) / this.cpa.length;
    }

    public treecount(): number {
        return this.cpa.length;
    }

    public calculateIndividialYield(): Array<number> { 
        let ages = this.calculateIndividualAge();
        let yields: Array<number> = [];
        ages.forEach((age, index) => {
            if (Math.floor(age) < 1) { 
                yields.push(this.yield_production["1"]);
                return;
            }
            if (Math.floor(age) > 10) {
                yields.push(this.yield_production["10"]);
                return;
            }
            yields.push(this.yield_production[Math.floor(age).toString()]);
        });
        return yields;
    }

    public totalYield(): number { 
        let yields = this.calculateIndividialYield();
        return yields.reduce((a, b) => a + b);
    }

}

export {
    YieldCalculation
}