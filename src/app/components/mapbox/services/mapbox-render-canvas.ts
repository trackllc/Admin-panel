import mapboxgl from "mapbox-gl";

export class MapboxRenderCanvasService {

    public width: 100;
    public height: 100;
    public data: Uint8Array;
    public size: 150;
    public context: CanvasRenderingContext2D;
    public map: mapboxgl.Map;

    constructor(
        map: mapboxgl.Map
    ) {
        this.data = new Uint8Array(this.size * this.size * 4);
        this.map = map;
    }

    public onAdd() {
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d')!;
    }

    public render() {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (this.size / 2) * 0.3;
        const outerRadius = (this.size / 2) * 0.7 * t + radius;
        const context = this.context;

        this.context.clearRect(0, 0, this.width, this.height);
        this.context.beginPath();
        this.context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
        );
        this.context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
        this.context.fill();

        this.context.beginPath();
        this.context.arc(
            this.width / 2,
            this.height / 2,
            radius,
            0,
            Math.PI * 2
        );
        this.context.fillStyle = 'rgba(255, 100, 100, 1)';
        this.context.lineWidth = 2 + 4 * (1 - t);
        this.context.fill();

        this.data = (this.context as any).getImageData(
            0,
            0,
            this.width,
            this.height
        ).data;

        this.map.triggerRepaint();

        return true;
    }

}