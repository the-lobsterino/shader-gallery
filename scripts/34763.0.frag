/*
           co3moz
     github.com/co3moz

     draw => for y-finite solutions
     drawYInfinite => for y-infinite solutions

     press left button of mouse and move for move.
     press right button of mouse and move for scale.
     press shift and left button of mouse, move a little bit will reset to default position.

     matrix edit
*/

precision highp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform sampler2D backbuffer;

#define draw(function, r, g, b) if(distance(function(p.x - c.x), p.y - c.y) < 0.002) color = vec3(r, g, b)
#define drawYInfinite(function, r, g, b) if(distance(function(p.x - c.x), p.y - c.y) < abs(function(p.x - c.x) - function(p.x - c.x - 0.01))) color = vec3(r, g, b)
#define mouseTrack(function) if(distance(mouse.x * aspect.x, p.x) < 0.003 && function(p.x - c.x) - p.y + c.y > 0.0 && sin((c.y - p.y) * 200.0) < 0.1) color = vec3(0.5, 0.5, 0.5)

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float y1(float x) {
	return rand(vec2(x, time)) * 5.0 - 2.5;
}


void main(void) {
	vec2 aspect = resolution.xy / min(resolution.x, resolution.y);
	vec2 c = vec2(0.5) * aspect - surfacePosition * 1.5;
	vec2 p = gl_FragCoord.xy / min(resolution.x, resolution.y);
	vec3 color = time > 1.0 ? texture2D(backbuffer, gl_FragCoord.xy / resolution.xy + vec2(0.00, 0.01)).xyz * 0.98 : vec3(0.0);
	
	draw(y1, 0.0, 1.0, 0.0); // y1
	
	//if(distance(p.y, c.y) < 0.005 && sin((c.x - p.x) * 200.0) < 0.1) color = vec3(0.0, 1.0, 0.0); // horizontal
	//if(distance(p.x, c.x) < 0.005 && sin((c.y - p.y) * 200.0) < 0.1) color = vec3(1.0, 0.0, 1.0); // vertical
	gl_FragColor = vec4(color, 1.0);
}