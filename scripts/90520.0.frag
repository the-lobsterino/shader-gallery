#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// depth of field approx, tests...

float evalZ(float fx, float fy){
	return sin(time*0.15+cos(2.5*time+0.1*fx))*cos(time*0.1+sin(0.2*time+3.14+0.2*fy));
}

const int Nx = 9;
const int Ny = 6;

void main( void ) {

	vec2 pos =  gl_FragCoord.xy / resolution.x - vec2(0.5, 0.5*resolution.y/resolution.x);
	pos*=resolution.x/resolution.y;
	
	vec3 rgb;
	
	
	for(int x = -Nx; x < Nx; ++x){	
		for(int y = -Ny; y < Ny; ++y){
			float fx = float(x);
			float fy = float(y);
			float z = evalZ(fx,fy);
			vec3 p = vec3(0.1*fx, 0.1*float(y), z);
			p = p*(1.+0.1*z);
			
			
			
			float s = 0.01*abs(p.z)+0.005;
			float R0 = 0.01+0.05*z;
			
			float d = distance(pos, p.xy);
			float i = 1.-smoothstep(R0-2.*s,R0+2.*s,d);
			i*=(500.)/(0.1+30.*(1.0-s));
			
			rgb+=i*2.0;	
		}
	}
	
	gl_FragColor = vec4(rgb,1.);

}