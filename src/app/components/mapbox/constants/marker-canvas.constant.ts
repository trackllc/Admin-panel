export default function (map: any, size: number) {
    const markerCanvas = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),
        context: CanvasRenderingContext2D,

        onAdd: function () {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            (this.context as any) = canvas.getContext('2d');
        },

        render: function () {
            const duration = 1000;
            const t = (performance.now() % duration) / duration;

            const radius = (size / 2) * 0.3;
            const outerRadius = (size / 2) * 0.7 * t + radius;

            (this.context as any).clearRect(0, 0, this.width, this.height);
            (this.context as any).beginPath();
            (this.context as any).arc(
                this.width / 2,
                this.height / 2,
                outerRadius,
                0,
                Math.PI * 2
            );
            (this.context as any).fillStyle = `rgba(255, 200, 200, ${1 - t})`;
            (this.context as any).fill();

            (this.context as any).beginPath();
            (this.context as any).arc(
                this.width / 2,
                this.height / 2,
                radius,
                0,
                Math.PI * 2
            );
            (this.context as any).fillStyle = 'rgba(255, 100, 100, 1)';
            (this.context as any).lineWidth = 2 + 4 * (1 - t);
            (this.context as any).fill();

            this.data = (this.context as any).getImageData(
                0,
                0,
                this.width,
                this.height
            ).data;

            map.triggerRepaint();
            return true;
        }
    };

    return markerCanvas;
}