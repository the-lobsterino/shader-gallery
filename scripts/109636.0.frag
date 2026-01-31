#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


const float PI = 3.14159265;

float tex(vec2 pos){
	float upper = length(vec2(cos(PI/3.), sin(PI/11.))*length(pos)-pos);
	return min(pow(upper, .2), pow(1.-length(pos), .88));
}


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / min(resolution.x, resolution.y) ) - vec2(1., 0.5);
	position *= 2.;
	gl_FragColor = vec4(abs(position), abs(position));

	float color = 0.0;
	vec2 circleDistor = position;
	circleDistor /= (sqrt(5.) - length(circleDistor));
	float modab = 1.;
	float off = mod(time, 1.) * modab;
	circleDistor = normalize(circleDistor)*mod(length(circleDistor)-off, modab);
	float ang = asin(circleDistor.y/length(circleDistor));
	if(circleDistor.x < 0.){ 
		ang = PI-ang;
	}
	ang = mod(ang, PI/3.);
	circleDistor = vec2(cos(ang), sin(ang))*length(circleDistor);
	vec4 col = mix(vec4(0.5), vec4(0.), tex(circleDistor));

	gl_FragColor = col; //vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}