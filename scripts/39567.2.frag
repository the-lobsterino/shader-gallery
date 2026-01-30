#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash( float n ){
    return fract(sin(n)*758.5453);
}

float noise3d( in vec3 x ){
	vec3 p = floor(x);
	vec3 f = fract(x);
	f       = f*f*(3.0-2.0*f);
	float n = p.x + p.y*157.0 + 113.0*p.z;

	return mix(mix(	mix( hash(n+0.0), hash(n+1.0),f.x),
			mix( hash(n+157.0), hash(n+158.0),f.x),f.y),
		   mix(	mix( hash(n+113.0), hash(n+114.0),f.x),
			mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	vec3 camera = vec3(0.0, 0.0, time );
	vec3 ray = normalize(vec3(position.x * 2.0 - 1.0, position.y * 2.0 - 1.0, 1.0));
	
	vec3 color = vec3(0.0);
	float dimmer = 1.0;
		camera += ray * 0.01 * hash(position.x + position.y * 1000.0);
	for(int i=0;i<100;i++){
		if(noise3d(camera * 10.1) < 0.2) { 
			color = vec3(dimmer, 0.0, 0.0 );
			float dens = noise3d(camera * 10.1);
			vec3 N = normalize(vec3(
				dens - noise3d(camera * 10.1 + vec3(0.01, 0.0, 0.0)),
				dens - noise3d(camera * 10.1 + vec3(0.0, 0.01, 0.0)),
				dens - noise3d(camera * 10.1 + vec3(0.0, 0.0, 0.01))
			));
			color = dot(N, vec3(-1.0)) * vec3(1.0, 0.7, 0.4);
			break;
		}
		camera += ray * 0.01;
		dimmer -= 1.0 / 100.0;
	}

	gl_FragColor = vec4(color, 1.0 );

}