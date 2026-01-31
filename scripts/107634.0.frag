// Ecolocating the direction of a pulse with four virtual microphones
// Author: Sebastian Ferreyra Pons

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.141592;
 vec2 SOURCE = vec2(25.0, sin(time)*10.0);

const vec2 MIC0 = vec2(-3.0, 7.2);
const vec2 MIC1 = vec2(-3.0, -3.0);
const vec2 MIC2 = vec2(3.0, -3.0);
const vec2 MIC3 = vec2(3.0, 3.0);

float cmag(float dist) {
	float phase = dist*2.0 - time*10.0;
	float mp = mod(phase, PI * 30.0);
	return (mp > 0.0 && mp < PI*1.0) ? sin(phase)/*(dist*dist)*/ : 0.0;
}

void main( void ) {
	float aspect = resolution.x / resolution.y;
	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	pos -= 0.5;
	pos.x *= aspect;
	pos *= 60.;
	
	float mag1 = cmag(length(pos+SOURCE));
	float mag2 = cmag(length(MIC1-SOURCE)+length(pos+MIC1));
	float mag3 = cmag(length(MIC2-SOURCE)+length(pos+MIC2));
	float mag4 = cmag(length(MIC3-SOURCE)+length(pos+MIC3));
	float mag5 = cmag(length(MIC0-SOURCE)+length(pos+MIC0));

	vec3 color = vec3( mag1 );
	color += vec3( mag2, mag3, mag4 );
	color += vec3( mag5, mag5, 0 );
	if (mag2+mag3+mag4+mag5 > 2.9) color = vec3(0.0);
	else if (mag2+mag3+mag4+mag5 > 1.8) color *= 3.0;
	else color /= 3.0;
	if (length(pos-SOURCE) < 0.2) color = vec3(1.0,0.0,0.0);
	if (length(pos+SOURCE) < 0.2) color = vec3(1.0,0.0,0.0);
	if (length(MIC1+pos) < 0.2) color = vec3(1.0,0.0,0.0);
	if (length(MIC2+pos) < 0.2) color = vec3(0.0,1.0,0.0);
	if (length(MIC3+pos) < 0.2) color = vec3(0.0,0.0,1.0);
	if (length(MIC0+pos) < 0.2) color = vec3(1.0,1.0,0.0);


	gl_FragColor = vec4( color, 1.0 );

}