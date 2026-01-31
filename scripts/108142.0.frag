#ifdef GL_ES
precision mediump float;
#endif
// Celia was here ;)  
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Function to convert angle to a color hue
vec3 hueToRgb(float hue) {
    hue = fract(hue); // Wrap around 1.0
    float r = abs(hue * 6.0 - 3.0) - 1.0;
    float g = 2.0 - abs(hue * 6.0 - 2.0);
    float b = 2.0 - abs(hue * 6.0 - 4.0);
    return clamp(vec3(r, g, b), 0.0, 1.0);
}

// Function to calculate angle from a point
float angle(vec2 p){
    if(p.x<0.0)return atan(p.y/p.x)*180.0/3.1415926536+180.0;
    if(p.y>0.0)return atan(p.y/p.x)*180.0/3.1415926536;
    return atan(p.y/p.x)*180.0/3.1415926536+360.0;
}

void main( void ) {
    vec2 p = vec2((gl_FragCoord.x / (resolution.x / 2.0) - 1.0) * (resolution.x / resolution.y),
                  gl_FragCoord.y / (resolution.y / 2.0) - 1.0);
    float d = sqrt(p.x * p.x + p.y * p.y);
    float a = mod(angle(p) + time * 400.0, 360.0); // Angle for hue
    float c = cos(d * 50.0 + a * 0.0524) * 0.5 + 0.5; // Map to 0.0 - 1.0 range

    vec3 color = hueToRgb(c); // Convert to RGB

    gl_FragColor = vec4(color, 1.0);
}