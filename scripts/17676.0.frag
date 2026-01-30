#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535897932384626433832795

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	vec2 TextureCoordinate = gl_FragCoord.xy / resolution;
	
        vec2 k = vec2(32.0,64.0);
        float v = 1.0;
        vec2 c = TextureCoordinate * k - k / 100.0;
        v += cos((c.x + cos(time)));
        v += cos((c.y + log(time)) / 2.0);
        v += sin((c.x + c.y + time) / 2.0);
        c += k / 2.0 * vec2(log(time / 3.0), cos(time / 2.0));
        v += cos(sqrt(c.x*c.x + c.y*c.y + 1.0) + time*PI);
        v = v / 1.0;

        vec3 col = vec3(sin(PI*v),0.0,0.0);

        vec4 color = vec4(0.22*col, 1.0);
        
	gl_FragColor = color;
}
