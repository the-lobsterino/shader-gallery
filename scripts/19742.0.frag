#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 toPolar(vec2 p) {
	float a = atan(p.y/p.x);
	if (p.x < 0.0) a += 3.1415;
	float r = sqrt(p.x*p.x + p.y*p.y);
	return vec2(a, r);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy )*2.0 - 1.0;
	p.x = p.x*(resolution.x/resolution.y);

	float a = 0.0;
	
	if(p.y > 0.1){
		a += .01 / abs(p.x*p.x+pow(p.y-0.1, 1.4)*1.4 - .4);
	}else if(p.x > 0.0){
		a += .01 / abs(p.x*p.x+pow(abs(p.y-0.1), 1.4)*2.0 - .4);
	}
	
	vec2 r = toPolar(p);
	//if(r.y < 0.45) a += abs(pow(abs(sin(r.x*0.5 - r.y*4.6 + 1.)), 200.));
	
	a += pow(r.y, .2)*0.3;
	
	
	for(float i = 0.; i < 8.; i += 1.){
		r.y *= 0.8;
		a += .0007 / abs(sin(r.x*i+time*pow(i+1.0, i+5.*sin(time+r.y))/r.y)+r.y*3.0);
	}
	
	
	if(p.y > 0.){
		a += .0013 / abs(p.x*p.x+p.y*p.y - .015);
		a += .0027 / abs(p.x*p.x*.55+p.y*p.y - .07);
	}else{
		a += .004 / abs(pow(p.x-0.115, 2.)+p.y*p.y*1.4 - .06);
		if(p.x < 0.){
			a += .004 / abs(pow(p.x, 2.)+pow(p.y, 2.)*0.8 - .13);
		}
	}
	// junk-tier < https://duckduckgo.com/i/8a6cebff.png >
	
	
	gl_FragColor = vec4( vec3(a), 1.0 );
}