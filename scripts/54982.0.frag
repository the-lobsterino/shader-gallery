#ifdef GL_ES
precision mediump float;
#endif
 
#extension GL_OES_standard_derivatives : enable
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
vec2 razy(vec2 a, vec2 b) {
    return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}
 
vec2 kwadrat(vec2 a) {
    return razy(a, a);
}
 
 
// Funkcja badająca czy dana liczba należy do zbioru Mandlebrota
// Zwraca 0 jeśli należy oraz inną liczbę w przeciwnym wypadku
int zbadajLiczbe(vec2 liczba) {
   
    vec2 z = vec2(0.0, 0.0);
    for(int i = 1; i < 100; i++) {
        // W każdym kroku przekształć punkt z. Wykorzystaj do tego funkcję kwadrat()
        // z = ???
        if(length(z) >= 2.0) {
            return i;
        }
    }
   
    return 0;
}
 
void main( void ) {
   
    float scale = mouse.y;
    float shiftX = mouse.x;
 
    vec2 position = ( gl_FragCoord.xy / resolution.y );
    position.y -= 0.5;
    position *= scale*2.0;
    position.x -= shiftX*8.0;
 
    vec4 color;
    int iterations = zbadajLiczbe(position);
    if(iterations == 0) {
        color = vec4(0.0, 0.0, 0.0, 1.0);
    }
    else {
        float t = float(iterations)/10.0;
        float red = sin(t);
        float green = cos(t);
        float blue = sin(2.0*t);
        color = vec4(red, green, blue, 1.0);
    }
 
    gl_FragColor = color;
 
}