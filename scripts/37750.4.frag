#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void )
{
    vec2 uv = vec2(gl_FragCoord.x / resolution.x, gl_FragCoord.y  / resolution.y);
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    float minY = (uv.y / resolution.y) + 0.005;
    float x = uv.x - (time / 4.0);
    float y = uv.y - 0.05;
    float p = (1.0 - sin(x * 20.0))/2.4 ;
    if (abs(y - p) < minY) {
	color = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        color = vec4(p / 2.0, max(mix(p / 2.0, (sin(p * time) + 0.5), 0.5), 0.0), 1.0, 1.0);
	color *= fract(p * 2.0) ; 
    }
    gl_FragColor = color;
}