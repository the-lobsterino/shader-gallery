#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float orient(vec2 v1, vec2 v2, vec2 v3){
	float res = 0.0;
	res += (v1.x-v3.x)*(v1.y+v3.y);
	res += (v2.x-v1.x)*(v2.y+v1.y);
	res += (v3.x-v2.x)*(v3.y+v2.y);
	return res;
}

void main( void ) {

	vec2 position = gl_FragCoord.xy;
	vec2 p1 = vec2(resolution.x/4.0,resolution.y/4.0);
	vec2 p2 = vec2(3.0*resolution.x/4.0,resolution.y/4.0);
	vec2 p3 = vec2(resolution.x/2.0,3.0*resolution.y/4.0);
	p1.x = p1.x+sin(time)*30.0;
	p1.y = p1.y-sin(time)*30.0;
	p2.x = p2.x+sin(time)*30.0;
	p2.y = p2.y+sin(time)*30.0;
	p3.x = p3.x-sin(time)*30.0;
	p3.y = p3.y+sin(time)*30.0;
	float r = 0.0;//1.0-mod(position.x,10.0)*1.0;//(sin(position.x)+1.0)/2.0;
	float g = 0.0;//(sin(position.y)+1.0)/2.0;
	float b = 0.0;
	if (distance(position,p1)<1.0){
		r = 1.0;
		g = 1.0;
		b = 1.0;
	} else if (distance(position,p2)<1.0){
		r = 1.0;
		g = 1.0;
		b = 1.0;
	} else if (distance(position,p3)<1.0){
		r = 1.0;
		g = 1.0;
		b = 1.0;
	}
	// ax1 + b = y1
	// ax2 + b = y2
	// float a1 = (p1.y - b1)/p1.x;
	// float a1 = (p2.y - b1)/p2.x;
	// float a1 = p1.y/p1.x - b1/p1.x;
	// float a1 = p2.y/p2.x - b1/p2.x;
	// p1.y/p1.x - b1/p1.x = p2.y/p2.x - b1/p2.x;
	// b1/p2.x - b1/p1.x = p2.y/p2.x - p1.y/p1.x        | p1.x * p2.x
	// b1 * p1.x / p2.x * p1.x - b1 * p2.x / p1.x * p2.x = p2.y * p1.x / p1.x * p2.x - p1.y * p2.x / p1.x * p2.x
	// b1 * p1.x - b1 * p2.x = p2.y * p1.x - p1.y * p2.x
	// b1 * (p1.x - p2.x) = p2.y * p1.x - p1.y * p2.x
	// b1 = (p2.y * p1.x - p1.y * p2.x) / (p1.x - p2.x)
	float b1 = (p2.y * p1.x - p1.y * p2.x) / (p1.x - p2.x);
	float a1 = (p1.y - b1)/p1.x;
	float d1 = abs((a1*position.x) + b1 - position.y);
	
	float b2 = (p2.y * p3.x - p3.y * p2.x) / (p3.x - p2.x);
	float a2 = (p3.y - b2)/p3.x;
	float d2 = abs((a2*position.x) + b2 - position.y);
	
	float b3 = (p3.y * p1.x - p1.y * p3.x) / (p1.x - p3.x);
	float a3 = (p1.y - b3)/p1.x;
	float d3 = abs((a3*position.x) + b3 - position.y);
	
	float o1 = orient(position,p1,p2);
	float o2 = orient(position,p2,p3);
	float o3 = orient(position,p3,p1);
	
	if ((o1<0.0)&&(o2<0.0)&&(o3<0.0)){
		b = 1.0;
		r = sin(time/2.0);
		g = sin(time+1.0)/2.0;
		b = b - g;
	} else if ((o1>0.0)&&(o2<0.0)&&(o3<0.0)){
		r = 0.1;
	} else if ((o1>0.0)&&(o2<0.0)&&(o3>0.0)){
		r = 0.2;
	} else if ((o1<0.0)&&(o2<0.0)&&(o3>0.0)){
		r = 0.3;
	} else if ((o1<0.0)&&(o2>0.0)&&(o3>0.0)){
		r = 0.4;
	} else if ((o1<0.0)&&(o2>0.0)&&(o3<0.0)){
		r = 0.5;
	} else if ((o1>0.0)&&(o2>0.0)&&(o3<0.0)){
		r = 0.6;
	}
	if (d1 < 1.0){
		b = 1.0;
	}
	if (d2 < 1.0){
		b = 1.0;
	}
	if (d3 < 1.0){
		b = 1.0;
	}
	if (b == 1.0){
		r = sin(time/2.0);
	}
	if (b == 1.0){
		g = sin(time+1.0)/2.0;
		b = b - g;
	}
	gl_FragColor = vec4( r, g, b , 1.0 );

}