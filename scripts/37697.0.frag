#ifdef GL_ES
precision mediump float;
#endif

// http://www.bidouille.org/prog/plasma

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415926535897932384626433832795
 
vec2 scale = resolution.xy / 10.0;
float time_scaled = time * 1.0;
 
void main() {
    vec2 position = ( gl_FragCoord.xy / resolution.xy );
    vec2 c = position * scale - scale/2.0;
    
    // sins build up
    float v = 0.0;
    v += sin((c.x + time_scaled));
    v += sin((c.y + time_scaled) / 2.0);
    v += sin((c.x + c.y + time_scaled) / 2.0);
    c += scale / 2.0 * vec2(sin(time_scaled / 3.0), cos(time_scaled / 2.0));
    v += sin(sqrt(c.x * c.x + c.y * c.y + 1.0) + time_scaled);
    v = v / 3.0;
	
    float r = sin(v * PI + 5.0 * PI / 3.0);
    float g = sin(v * PI + 7.0 * v * PI);(v * PI + 11.0 * PI / 7.0);
    float b = sin(v * PI + 23.0 * PI / 17.0);
    vec3 col = vec3(r, g, b) * 0.8 + 0.2;
    gl_FragColor = vec4(col, 1.0);
}