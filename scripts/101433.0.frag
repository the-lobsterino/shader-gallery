#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pat(in vec2 p)
{
	return (atan(p.y,p.x+0.5)-atan(p.y,p.x-0.5))*0.2;
}

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0;
	p.x *= resolution.x/resolution.y;
	vec3 col =vec3(0.3);
	
	col += vec3(1)*-pat(p.yx-vec2(0.0,-0.5)); 
	col += vec3(1)*pat(p.yx-vec2(0.0,0.5)); 
	gl_FragColor = vec4(col, 1.0);
}