#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dir(vec2 a, vec2 b){
	return a.x*b.y - a.y*b.x;
}

bool insideTri(vec2 p, vec2 a, vec2 b, vec2 c){
	bool b1 = dir(p-a, b-a)>0.0;
	bool b2 = dir(p-b, c-b) > 0.0;
	bool b3 = dir(p-c, a-c) >0.0;
	return b1 == b2 && b2==b3;
}

float circle(vec2 center, float size, vec2 p){
	float c = distance(center, p);
	return step(c, size);
}

vec3 colorcircle(vec2 center, float size, vec3 color, vec2 p){
	float c = distance(center, p);
	float d = step(c, size);
//	float d = smoothstep(c, size, 0.5);
//	float d = smoothstep(size, size+0.1, c);
	return color * d;
}

vec3 colorcircle2(vec2 center, float size, vec3 color, vec2 p){
	p.x = p.x * 0.8+0.1*sin(time);
	float c = distance(center, p);
//	float d = step(c, size);
//	float d = smoothstep(c, size, 0.5);
	float d = smoothstep(size, size+0.1, c);
	return color * d;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p= p*2.0 - 1.0;

	float col = 0.0;
	float nose = 0.0;
//	vec3 nose;
	vec2 a = vec2(-0.2, 0.0);
	vec2 b = vec2(0.2, 0.0);
//	vec2 c = vec2(0.0, 0.2);
	vec2 c = vec2(0.0, 0.2*(-0.5+(0.5*sin(time))));
	if (insideTri (p,a,b,c)) nose = 1.0;
	
	vec3 color;
	vec3 face = colorcircle2(vec2(0.0, 0.0), 0.5, vec3(1.0, 1.0, 1.0), p);
	vec3 leye = colorcircle(vec2(0.2, 0.25), 0.1, vec3(1.0, 0.0, 0.0), p);
	vec3 reye = colorcircle(vec2(-0.2, 0.25), 0.1, vec3(0.0, 1.0, 0.0), p);
	//color = mix(face, vec3(nose), 0.5);
	color = face + vec3(nose);
	color = color + leye;
	color = color + reye;
	
	//color = mix(color, leye, 0.5);
	//color = mix(color, reye, 0.5);
//	color = mix(color, nose, 0.5);

	gl_FragColor = vec4( color, 1.0 );


	// vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	// float color = 0.0;
	// color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	// color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	// color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	// color *= sin( time / 10.0 ) * 0.5;

	// gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );


}

