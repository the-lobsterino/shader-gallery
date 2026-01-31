precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    // Ağın dalgalanmasını hesaplayın (örnek dalga fonksiyonu)
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float wave = sin(st.x * 10.0 + u_time) * 0.1; // Örnek dalga

    // Kale ağını çizin
    float lineWidth = 0.005;
    float goalWidth = 0.2;
    float goalHeight = 0.4;

    float goalTop = 0.5 - goalHeight / 2.0;
    float goalBottom = 0.5 + goalHeight / 2.0;
    float goalLeft = 1.0 - goalWidth;

    float netLeft = goalLeft - lineWidth;
    float netRight = 1.0;
    float netTop = goalTop;
    float netBottom = goalBottom;

    if (st.x > goalLeft && st.x < netLeft && st.y > goalTop && st.y < goalBottom) {
        // Kale içi, ağ rengi
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else if (st.x > netLeft && st.x < netRight && st.y > netTop && st.y < netBottom) {
        // Ağ, dalgalanma eklenebilir
        gl_FragColor = vec4(1.0, 1.0, 1.0, 0.8 + wave);
    } else {
        // Diğer bölgeler
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
