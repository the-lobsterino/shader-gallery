#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 mousepos = (mouse.xy*resolution.xy)+20.0;
	
	float angle = 0.2;
	float px = gl_FragCoord.x;
	float py = gl_FragCoord.y;
	
	float cosa = cos(-angle);
	float sina = sin(-angle);

		px = (px * cosa) + (py * sina);
		py = (py * cosa) - (px * sina);	
	
	
	float color=0.0;
	if (mod(px,20.0)<=1.0 || mod(py,20.0)<=1.0){
		color += 0.5;
	}
	
	color = min(color,0.8);
	gl_FragColor = vec4( vec3( color, color, color), 1.0 );

}