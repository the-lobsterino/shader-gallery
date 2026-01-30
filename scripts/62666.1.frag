#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

vec2 polToRec(vec2 pol){
	return vec2(pol.x * cos(pol.y),pol.x * sin(pol.y));
}

vec2 recToPol(vec2 rec){
	return vec2(length(rec), atan(rec.y,rec.x));
}

vec2 ripple(vec2 pol){
	pol.x *= 40.0;
	pol.x = pol.x - sin(pol.x - u_time * 8.0);
	pol.x /= 40.0;
	return pol;
}

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / u_resolution.xy );
	
	
	
	float color = fract((pos.x + pos.y) * 3.0);
	
	
	
	gl_FragColor = vec4( vec3(color), 1.0 );

}