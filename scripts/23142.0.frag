#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 m;

float circle(vec2 p, float r){
	return length(p) - r;
}

float box(vec2 p, vec2 b ){
	vec2 d = abs(p) - b;
	return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}
float map(vec2 p){
	float d = circle(p, 4.0);
	d = min(d, box(p + -m+  vec2(0., 0.), vec2(4.)));
	return d;
}

#define EPS 0.1

bool approx(float a, float b){
	return (abs(b - a) < EPS);
}

float nSin(float a){
	return ((sin(a)+1.)*0.5);
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv -= 0.5;
	uv.x*=resolution.x/resolution.y;
	uv*=32.;
	m = (mouse-0.5);
	m.x*=resolution.x/resolution.y;
	m*=32.;
	
	vec3 color = vec3(0.);
	
	float dis = map(uv);
	if(approx(dis, 0.)){
		color.b = 1.;
	}
	else if(dis < EPS){
		color.r = nSin(dis*4.);
	}
	else if(dis > EPS){
		color.g = nSin(dis*4.);
	}
	
	gl_FragColor = vec4(color, 1.0 );

}