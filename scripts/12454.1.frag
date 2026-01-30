#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

mat4 rotmatrix(float a) {
	return mat4( 	cos( a ),-sin( a ),  0.0, 0.0,
			sin( a ), cos( a ),  0.0, 0.0,
			0.0, 	 0.0, 	     1.0, 0.0,
			0.0,  	 0.0,        0.0, 1.0);
}

float light(vec2 pos, float ang)
{
	pos = (vec4(pos,0,0) * rotmatrix(ang)).xy;
	pos.y -= 0.5;
	
	float mask = 1. - (pos.x * pos.x * 60. - pos.y + 0.5);
	float brightness = clamp(pow(0.1/(pos.y+.5),2.),0.,1.);
	
	return mask*brightness*15.;
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy/resolution - vec2(0.5));

	
	vec3 color = vec3(0.3,0.3,0.6);
	color *= (1.0- p.x * p.x + p.y * p.y)/2.;
	
	vec2 p2 = p;
	p2.y += 0.5;
	
	
	

	
	color += clamp(light(vec2(p.x-0.2,p.y + 0.5),	sin(time/2. + 1.)/2.),0.,1.);
	color += clamp(light(vec2(p.x+0.2,p.y + 0.5),	sin(time/2. + 2.)/2.),0.,1.);
	color += clamp(light(vec2(p.x,p.y + 0.5),	sin(time/2. + 3.)/2.),0.,1.);
	
	
	gl_FragColor = vec4(color,1);
}