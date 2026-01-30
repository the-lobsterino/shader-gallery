#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float gauss(float t, float w) {
	return exp(-t*t/w);
}

float cosgauss(float t, float w) {
	t = cos(0.5*t*w);
	return exp(-t*t/w);
}

float random(vec2 co)
{
   return fract(sin(dot(co.xy,vec2(12.9898,78.233))) * 43758.5453);
}

float random(float x, float y){
	return 2.0*random(vec2(x,y))-1.0;
}

float randGauss(float seed, vec2 p) {
	float a = random(1.0*seed,0.0);
	float b = random(2.0*seed,0.1);
	float c = random(3.0*seed,0.1);
	float d = random(4.0*seed,0.2);
	float e = random(5.0*seed,0.2);
	float f = random(6.0*seed,0.3);
	float g = random(6.0*seed,0.3);
	
	return gauss(a*p.x*p.x*p.x + b*p.y*p.y*p.y + c*p.x*p.y + d*p.x + e*p.y + f, 1.0);
}


float randMatColor(float seed, vec2 p) {
    mat4 M = mat4(random(2.0*seed,0.1),random(2.0*seed,0.2),random(2.0*seed,0.3),random(2.0*seed,0.4),
		  random(1.0*seed,0.5),random(2.0*seed,0.6),random(3.0*seed,0.7),random(4.0*seed,0.8),
		  random(3.0*seed,0.1),random(3.0*seed,0.2),random(4.0*seed,0.2),random(1.0*seed,0.25),
		  random(2.0*seed,0.15),random(1.0*seed,0.16),random(2.0*seed,0.17),random(1.0*seed,0.18)
		 );
	
    vec4 x = vec4(1.0, p.x, p.x*p.x*p.x, p.x*p.x*p.x*p.x*p.x);
    vec4 y = vec4(1.0, p.y, p.y*p.y*p.y, p.y*p.y*p.y*p.y*p.y);
    return gauss(dot((x*M),y), 1.0);
}


float randMatColorTimed(float seed, vec2 p, float t) {
			
    mat4 M = mat4(
	    sin(1.0*(t+seed)),sin(1.1*(t+seed)),sin(1.2*(t+seed)),sin(1.3*(t+seed)),
	    sin(1.4*(t+seed)),sin(1.5*(t+seed)),sin(1.6*(t+seed)),sin(1.7*(t+seed)),
	    sin(1.8*(t+seed)),sin(1.9*(t+seed)),sin(2.0*(t+seed)),sin(2.1*(t+seed)),
	    sin(2.2*(t+seed)),sin(2.3*(t+seed)),sin(2.4*(t+seed)),sin(2.5*(t+seed))
		 );
	
    vec4 x = vec4(1.0, p.x, p.x*p.x, p.x*p.x*p.x);
    vec4 y = vec4(1.0, p.y, p.y*p.y, p.y*p.y*p.y);
	
    return gauss(dot((x*M),y), 1.0);
}

float test(vec2 p) {
    return gauss(p.x*p.x*p.x + p.y*p.y*p.y, 1.0);
}

float contr(float x) {
	x = x*x;
	x = x*x;
	x = x*x;
	//x = x*x;
	return x;
}


void main( void ) {
	
	vec2 p = (( gl_FragCoord.xy / resolution.xy )-0.5)*2.0;

	float t = time * 1.0;
	
	float r = randMatColorTimed(6.0*(mouse.x+0.31), p,t);
	float g = randMatColorTimed(7.0*(mouse.y+0.5), p,t);
	float b = randMatColorTimed(11.0*(mouse.x+mouse.y+0.17), p,t);
	
	vec3 c1 = vec3(69, 71, 108)/255.0;
	vec3 c2 = vec3(102, 91, 136)/255.0;
        vec3 c3 = vec3(125, 113, 159)/255.0;
	
	//float r = test(p);
	//float g = test(p);
	//float b = test(p);
	
	float N = 0.01;
	

        gl_FragColor = vec4(r,g,b,1.0) ;
}



