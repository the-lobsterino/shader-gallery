#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 hash(vec2 v) {
    vec2 n;
    n.x=fract(fract(v.y-v.x*871.0518)*(v.y+v.x)*3156.7821);
    n.y=fract(fract(v.x+v.y*804.3048)*(v.x-v.y)*5349.2627);
    return n;
}


//via http://glsl.herokuapp.com/e#4841.11
float partition_noise(vec2 p) {
	vec2 id;
	float a, b;
	
	id = floor(floor(p)-.5);
	p *= floor(hash(id) * 1.)+.5;

	id = floor(p);
	p.yx *= floor(hash(id) * 3.)-8.*sin(time*.001);

	id -= floor(p);

	p *= floor(hash(id) * 2.)+1.;
	id = floor(p);
	p -= id;


    	vec2 u = abs(p - .5) * 2.;
	//a = mix(u.x, u.y, 1.0);
	//b = clamp(0.0, u.x, u.y);	
        //return mix(a, b, mod(time,10.));
	
	//return max(u.x, u.y);
	//return min(u.x, u.y);
	return mix(u.x, u.y, 0.);
	//return step(u.x, u.y);
	//return clamp(0.0, u.x, u.y);
	//return smoothstep(u.x, u.y, sin(time*4.)*1.75 );

}

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	uv *= 8.;
	uv += mouse * 14.;
	uv -= time*0.1;

	gl_FragColor = vec4(partition_noise(uv));
}//echophon && sphinx && credit @paniq