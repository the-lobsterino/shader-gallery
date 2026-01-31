#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Amber color
vec4 line_color = vec4(1.0, 0.75, 0.0, 1.0);

void main( void ) 
{	
    	// Compress the pixel coordinates between 0 and 1.
	vec2 uv = gl_FragCoord.xy/resolution.xy;
    	gl_FragColor = 1.5*(exp(-5.0*abs(sin(abs(uv.y - abs(cos(uv.x+time)*cos(time)))))))*line_color;
}