precision highp float;

uniform float time;
uniform vec2 mouse,resolution;

void main(void){
	
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 color = vec3(0.0, 0.3, 0.5);
	float d = 0.8-smoothstep(0.0,1.8,length(p));
	float f = 0.0;
	float PI = 3.141592;
	for(float i = 0.0; i < 16.0; i++){
		
		float s = sin(0.5*time + i * PI / 8.0) * 10.01;
		float c = cos(0.5*time + i * PI / 8.0) * 8.5;
 
		f +=  atan(sin(time)*p.y+cos(time)*p.x, 1.-p.y) / ( floor(-d-fract(12.*d)+2.5) + p.x * c + fract(.35*time-2.*d) + p.y * s);
	}
	
	
	gl_FragColor = vec4(max(cos(acos(1.7*p.y) *f + color),1.-vec3(fract(2.*time), 0, 0.) - (fract(time+12.*abs(p.x)-2.*p.y) + acos(1.05*abs(p.y)))), 1.0);
}